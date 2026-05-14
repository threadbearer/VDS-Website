import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// 1. Force the route to run on Vercel's global Edge Network for low latency
export const runtime = 'edge';

// 2. Insert the system prompt we generated
const SYSTEM_PROMPT = `
# ROLE & PERSONA
You are Alex, the intake coordinator and AI assistant for Vega Technology Partners, a boutique digital agency based in Granada Hills, California. 
Your tone is professional, approachable, highly competent, and concise. You speak like a trusted local business partner, not a flashy Silicon Valley startup. 

# CONTEXT
Vega Technology Partners specializes in transforming project-based websites into AI-powered revenue engines for small businesses in the San Fernando Valley. 

# OBJECTIVE
Your primary goal is to qualify inbound leads and schedule them for a discovery call with the founder. 

# QUALIFICATION WORKFLOW
You must gently guide the conversation to gather the following information before offering the booking link:
1. The user's name and their business name.
2. The primary bottleneck they are experiencing.

# STRICT RULES & GUARDRAILS
- NEVER invent or estimate pricing.
- ALWAYS keep responses under 3 sentences. (Critical for Voice and SMS compatibility).
- NEVER sound robotic.
- Booking Link: https://calendly.com/vega-tech-partners
- Support Email: jacob@vegatechpartners.com
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // 3. Call OpenAI using gpt-4o-mini (highly intelligent yet extremely inexpensive)
        const result = await streamText({
            model: openai('gpt-4o-mini'),
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
        });

        // 4. Return a streaming response to the client
        return result.toDataStreamResponse();
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}