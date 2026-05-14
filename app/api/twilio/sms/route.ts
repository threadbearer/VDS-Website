import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { saveMessage, createLead, supabase } from '@/lib/database';
import { findRelevantKnowledge } from '@/lib/rag';
import { notifyAgencyOfLead } from '@/lib/mail';

export const runtime = 'nodejs';

const SMS_SYSTEM_PROMPT = `
# ROLE & PERSONA
You are Alex, the virtual intake coordinator for Vega Technology Partners.
Your tone is professional, helpful, and highly concise.

# OBJECTIVE
Your goal is to qualify inbound leads over text messaging by gathering:
1. Their name.
2. Their business type or primary bottleneck.

# CRITICAL CONSTRAINTS
- Keep your responses UNDER 160 characters (1 to 2 short sentences max). 
- This is an SMS interface; long messages will be split and look unprofessional.
- Once you have gathered their Name, Phone, and Issue, you MUST execute the 'qualifyLead' tool immediately!
- Offer this booking link ONLY after qualification: https://calendly.com/vega-tech-partners
`;

export async function POST(req: Request) {
    try {
        // 1. Parse Twilio's incoming URL-encoded form data
        const formData = await req.formData();
        const userMessage = formData.get('Body') as string;
        const fromNumber = formData.get('From') as string;

        if (!userMessage) {
            return new Response('<Response />', { headers: { 'Content-Type': 'text/xml' } });
        }

        // 2. Log incoming user message & fetch/create conversation
        const saveResult = await saveMessage({
            phone: fromNumber,
            content: userMessage,
            role: 'user',
            source: 'sms',
        });

        const conversationId = saveResult?.conversationId;

        // 3. Check if the operator has manually paused this thread
        if (conversationId) {
            const { data: conv } = await supabase
                .from('conversations')
                .select('is_paused')
                .eq('id', conversationId)
                .maybeSingle();

            if (conv?.is_paused) {
                console.log(`[SMS Takeover] Thread ${conversationId} is muted. Skipping response.`);
                return new Response('<Response />', { headers: { 'Content-Type': 'text/xml' } });
            }
        }

        // 4. Retrieve Dynamic Knowledge (RAG)
        const ragContext = await findRelevantKnowledge(userMessage);
        const finalSystemPrompt = `${SMS_SYSTEM_PROMPT}

${ragContext ? `# FIRM KNOWLEDGE BASE\nUse this info to answer questions:\n${ragContext}` : ''}
`;

        // 5. Fetch full conversation history for total-recall context
        let conversationMessages: Array<{ role: 'user' | 'assistant', content: string }> = [];
        
        if (conversationId) {
            const { data: history } = await supabase
                .from('messages')
                .select('role, content')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (history && history.length > 0) {
                conversationMessages = history.map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content,
                }));
            }
        }

        // Fallback if database fetch fails
        if (conversationMessages.length === 0) {
            conversationMessages = [{ role: 'user', content: userMessage }];
        }

        // 6. Generate response using Multi-Step AI Loop
        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            system: finalSystemPrompt,
            messages: conversationMessages,
            stopWhen: stepCountIs(5), // Use stopWhen condition for AI SDK v5 looping limits
            tools: {
                qualifyLead: tool({
                    description: 'Registers the lead in CRM. Execute immediately when you have their Name, Phone, and Issue.',
                    inputSchema: z.object({
                        name: z.string().describe('Full name'),
                        issue: z.string().describe('Primary business bottleneck'),
                    }),
                    execute: async ({ name, issue }) => {
                        console.log('--- SMS AI TOOL: qualifyLead ---', { name, issue });
                        if (conversationId) {
                            try {
                                await createLead({
                                    sessionId: conversationId, // Pass conversation ID as session identifier for SMS
                                    businessName: `${name} - SMS`,
                                    phoneNumber: fromNumber,
                                    industry: 'agency',
                                });

                                // Dispatch real-time agency notification
                                notifyAgencyOfLead({
                                    name,
                                    phone: fromNumber,
                                    issue,
                                    source: 'SMS Bot'
                                }).catch(e => console.error('SMS lead email alert failed:', e));

                                return `Lead saved successfully. Send them the final short reply and scheduling link.`;
                            } catch (e) {
                                console.error('SMS CRM write failed:', e);
                            }
                        }
                        return 'Success';
                    }
                })
            }
        });

        // 7. Log outgoing AI response to database
        await saveMessage({
            phone: fromNumber,
            content: text,
            role: 'assistant',
            source: 'sms',
        });

        // 8. Construct & Return TwiML Response
        const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${text}</Message>
</Response>`;

        return new Response(twimlResponse, {
            status: 200,
            headers: {
                'Content-Type': 'text/xml',
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        console.error('Twilio SMS Webhook Critical Error:', error);
        return new Response('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Thanks for messaging us. We are checking into this and will text you back shortly!</Message></Response>', {
            headers: { 'Content-Type': 'text/xml' },
        });
    }
}