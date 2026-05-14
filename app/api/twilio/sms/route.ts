import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { saveMessage, supabase } from '@/lib/database';

// Note: Twilio webhooks expect standard serverless execution rather than edge streams, 
// because SMS cannot "stream" text letter-by-letter to a phone screen anyway.
export const runtime = 'nodejs';

const SMS_SYSTEM_PROMPT = `
You are Alex, the virtual intake coordinator for Vega Technology Partners in Granada Hills, CA. 
Your tone is professional, helpful, and concise. 

Your goal is to qualify inbound leads over text messaging by gathering:
1. Their name and business type.
2. Their primary bottleneck.

CRITICAL: Keep your responses under 160 characters (1 to 2 short sentences max) because this is an SMS interface. Never invent pricing. Offer this booking link when they are qualified: https://calendly.com/vega-tech-partners
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

        // 1.5 Log incoming user message
        const saveResult = await saveMessage({
            phone: fromNumber,
            content: userMessage,
            role: 'user',
            source: 'sms',
        });

        // 1.8 Security / AI Mute Check: Check if the operator manually paused this thread
        if (saveResult?.conversationId) {
            const { data: conv, error: dbError } = await supabase
                .from('conversations')
                .select('is_paused')
                .eq('id', saveResult.conversationId)
                .maybeSingle();

            if (conv?.is_paused) {
                console.log(`[SMS Takeover] Conversation ${saveResult.conversationId} is muted for AI. Skipping automatic response.`);
                return new Response('<Response />', { 
                    headers: { 'Content-Type': 'text/xml' } 
                });
            }
        }

        // 2. Execute the model logic
        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            system: SMS_SYSTEM_PROMPT,
            prompt: userMessage,
        });

        // 2.5 Log outgoing AI message
        await saveMessage({
            phone: fromNumber,
            content: text,
            role: 'assistant',
            source: 'sms',
        });

        // 3. Construct the TwiML XML Response
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
        console.error('Twilio SMS Webhook Error:', error);
        // Silent failure fallback so Twilio doesn't throw a generic carrier error
        return new Response('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Thanks for messaging Vega. Our system is busy, but we will text you shortly.</Message></Response>', {
            headers: { 'Content-Type': 'text/xml' },
        });
    }
}