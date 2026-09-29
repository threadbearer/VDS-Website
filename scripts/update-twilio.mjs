// scripts/update-twilio.mjs
// Updates a Twilio DEV testing number to point at a provided base URL (e.g. a tunnel).
// NEVER point this at the production number or touch the fallback URL.

import twilio from 'twilio';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const prodNumber = process.env.TWILIO_PHONE_NUMBER;
const devNumber = process.env.TWILIO_DEV_PHONE_NUMBER;

if (!accountSid || !authToken) {
  console.error('Missing Twilio credentials in .env.local');
  process.exit(1);
}

if (!devNumber) {
  console.error('No TWILIO_DEV_PHONE_NUMBER set in .env.local; phone testing disabled.');
  process.exit(1);
}

if (devNumber === prodNumber) {
  console.error('TWILIO_DEV_PHONE_NUMBER must differ from the production TWILIO_PHONE_NUMBER.');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function updateWebhook() {
  const webhookUrl = process.argv[2];
  
  if (!webhookUrl) {
    console.error('Please provide your base URL (ngrok or production) as an argument.');
    console.error('Example: node scripts/update-twilio.mjs https://abcd-123.ngrok-free.app');
    process.exit(1);
  }

  const fullUrl = `${webhookUrl.replace(/\/$/, '')}/api/twilio/voice`;

  console.log(`Looking up DEV phone number ${devNumber}...`);
  const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({ phoneNumber: devNumber, limit: 1 });
  
  if (incomingPhoneNumbers.length === 0) {
    console.error(`Phone number ${devNumber} not found in Twilio account.`);
    process.exit(1);
  }

  const sid = incomingPhoneNumbers[0].sid;
  
  console.log(`Updating webhook for ${devNumber} to: ${fullUrl}`);
  
  await client.incomingPhoneNumbers(sid).update({
    voiceUrl: fullUrl,
    voiceMethod: 'POST',
  });

  console.log('✅ Twilio webhook successfully updated!');
  console.log(`Calls will now route to your in-house orchestrator via: ${fullUrl}`);
}

updateWebhook().catch((err) => {
  console.error(err);
  process.exit(1);
});
