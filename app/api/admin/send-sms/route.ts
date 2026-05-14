import { NextResponse } from 'next/server';
import { isUserAuthenticated } from '@/admin/actions';
import { saveMessage } from '@/lib/database';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

export async function POST(req: Request) {
  try {
    // 1. Security check: Only authenticated agency personnel
    const authenticated = await isUserAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized admin session' }, { status: 401 });
    }

    const { to, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing "to" or "message" fields' }, { status: 400 });
    }

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Twilio credentials missing from server environment');
      return NextResponse.json({ error: 'SMS gateway misconfigured on server' }, { status: 500 });
    }

    // 2. Deliver outbound Twilio SMS
    const client = twilio(accountSid, authToken);
    const twilioResp = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });

    console.log(`SMS sent successfully to ${to}, SID: ${twilioResp.sid}`);

    // 3. Logging Persistence: Save to messages database with 'admin' role
    await saveMessage({
      phone: to,
      content: message,
      role: 'admin',
      source: 'sms',
    });

    return NextResponse.json({ success: true, sid: twilioResp.sid });
  } catch (error: any) {
    console.error('Error delivering admin SMS:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to route outbound message' },
      { status: 500 }
    );
  }
}
