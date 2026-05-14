import { openai } from '@ai-sdk/openai';
import { streamText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { saveMessage, createLead } from '@/lib/database';
import { findRelevantKnowledge } from '@/lib/rag';
import { notifyAgencyOfLead } from '@/lib/mail';

// Using standard nodejs runtime to support shared backend notification integrations (SMTP/Nodemailer)
export const runtime = 'nodejs';

// Define predefined industry prompts
const INDUSTRY_PROMPTS: Record<string, string> = {
    agency: `
# ROLE & PERSONA
You are Alex, the intake coordinator and AI assistant for Vega Technology Partners. 
Your tone is professional, approachable, highly competent, and concise.

# OBJECTIVE
Your primary goal is to qualify inbound leads and schedule them for a discovery call with the founder. 

# QUALIFICATION WORKFLOW
You must gently guide the conversation to gather the following information:
1. The user's name and their business name.
2. Their primary bottleneck or issue.
3. Their phone number.

# STRICT RULES & GUARDRAILS
- NEVER invent or estimate pricing.
- ALWAYS keep responses under 3 sentences. (Critical for Voice and SMS compatibility).
- NEVER sound robotic.
- Once you gather their Name, Phone, and Issue, you MUST execute the 'qualifyLead' tool to save their data!
- Booking Link: https://calendly.com/vega-tech-partners
- Support Email: jacob@vegatechpartners.com
`,
    plumber: `
# ROLE & PERSONA
You are Alex, the 24/7 AI dispatch coordinator for Valley Choice Plumbing. 
Your tone is urgent yet reassuring, reliable, and highly professional.

# OBJECTIVE
Your primary goal is to assess if their plumbing issue is an emergency, reassure them, and schedule a diagnostic visit.

# QUALIFICATION WORKFLOW
Gently guide the conversation to gather:
1. The user's name and contact phone number.
2. The nature of the plumbing emergency.
3. Confirm their address.

# STRICT RULES & GUARDRAILS
- NEVER give a flat pricing estimate over chat.
- ALWAYS keep responses under 3 sentences.
- Once you gather their Name, Phone, and Issue, you MUST execute the 'qualifyLead' tool!
- Action Link: https://calendly.com/valley-choice-plumbing/diagnostic
`,
    lawyer: `
# ROLE & PERSONA
You are Alex, the AI Case Intake Specialist at Valley Justice Law Group. 
Your tone is highly empathetic, reassuring, professional, and discreet.

# OBJECTIVE
Your primary goal is to show empathy, gather initial incident details, and book a free legal consultation.

# QUALIFICATION WORKFLOW
Empathetically guide the conversation to gather:
1. The user's name and best contact number.
2. The date of the accident and a brief overview of the incident.

# STRICT RULES & GUARDRAILS
- NEVER give legal advice.
- NEVER guarantee any settlement amount or case outcome.
- ALWAYS keep responses under 3 sentences.
- Once you gather their Name, Phone, and Incident details, you MUST execute the 'qualifyLead' tool!
- Action Link: https://calendly.com/valley-justice-law/consultation
`,
    dentist: `
# ROLE & PERSONA
You are Alex, the AI Scheduling Coordinator for Smile Valley Dental. 
Your tone is welcoming, warm, professional, and clean.

# OBJECTIVE
Your primary goal is to identify the patient's appointment type and schedule their visit.

# QUALIFICATION WORKFLOW
Warmly guide the conversation to gather:
1. The user's name and contact phone number.
2. The purpose of the visit: routine cleaning, cosmetic interest, or emergency pain.

# STRICT RULES & GUARDRAILS
- NEVER provide medical diagnosis.
- ALWAYS keep responses under 3 sentences.
- Once you gather their Name, Phone, and Visit Reason, you MUST execute the 'qualifyLead' tool!
- Action Link: https://calendly.com/smile-valley-dental/appointment
`
};

export async function POST(req: Request) {
    try {
        const { messages, sessionId, industry = 'agency', clientId } = await req.json();

        const userLastMessage = messages[messages.length - 1];

        // 1. Retrieve Dynamic Context (RAG)
        let ragContext = '';
        if (userLastMessage?.content) {
            ragContext = await findRelevantKnowledge(userLastMessage.content, clientId);
        }

        // 2. Build Final Prompt
        const systemPromptBase = INDUSTRY_PROMPTS[industry] || INDUSTRY_PROMPTS.agency;
        const finalSystemPrompt = `${systemPromptBase}

${ragContext ? `# FIRM KNOWLEDGE BASE\nUse the following strictly verified knowledge to answer questions:\n${ragContext}` : ''}
`;

        // 3. Log incoming user message
        if (sessionId && userLastMessage && userLastMessage.role === 'user') {
            await saveMessage({
                sessionId,
                content: userLastMessage.content,
                role: 'user',
                source: 'web',
            });
        }

        // 4. Call OpenAI using gpt-4o-mini with Tools
        const result = await streamText({
            model: openai('gpt-4o-mini'),
            stopWhen: stepCountIs(5), // Limit sequential LLM loops in AI SDK v5
            messages: [
                { role: 'system', content: finalSystemPrompt },
                ...messages
            ],
            tools: {
                qualifyLead: tool({
                    description: "Execute this tool IMMEDIATELY once you have gathered the user's name, phone number, and their primary issue/bottleneck. This registers them securely into the firm's CRM.",
                    inputSchema: z.object({
                        name: z.string().describe('The full name of the prospect/lead'),
                        phone: z.string().describe('The phone number of the prospect/lead'),
                        issue: z.string().describe('A concise summary of their primary issue or what they need help with'),
                    }),
                    execute: async ({ name, phone, issue }) => {
                        console.log('--- AI TOOL EXECUTED: qualifyLead ---', { name, phone, issue });
                        if (sessionId) {
                            try {
                                await createLead({
                                    sessionId,
                                    businessName: `${name} - ${issue.substring(0, 30)}`, 
                                    phoneNumber: phone,
                                    industry: industry,
                                });
                                
                                // Fire-and-forget real-time email notification to agency
                                notifyAgencyOfLead({
                                    name,
                                    phone,
                                    issue,
                                    source: `Web Chat - ${industry}`
                                }).catch(err => console.error('Background lead notification failed:', err));

                                return `Successfully saved ${name}'s profile and issue to the CRM. Now provide them the Action/Booking Link and welcome them.`;
                            } catch (e) {
                                console.error('Failed to create lead via tool:', e);
                                return 'Failed to save to CRM due to an internal error. Please ask them to reach out via email instead.';
                            }
                        }
                        return 'Simulated success (No session ID provided).';
                    }
                })
            },
            // Save the completed assistant message to database once stream closes
            onFinish: async ({ text }) => {
                if (sessionId && text) {
                    await saveMessage({
                        sessionId,
                        content: text,
                        role: 'assistant',
                        source: 'web',
                    });
                }
            }
        });

        // 5. Return a streaming response
        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Chat Completion API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}