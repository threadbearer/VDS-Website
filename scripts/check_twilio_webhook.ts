import twilio from 'twilio';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !phoneNumber) {
  console.error('Missing Twilio credentials in .env.local');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function run() {
  console.log(`Looking up phone number ${phoneNumber}...`);
  const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({ phoneNumber, limit: 1 });
  if (incomingPhoneNumbers.length === 0) {
    console.error('Phone number not found in Twilio account.');
    return;
  }
  const item = incomingPhoneNumbers[0];
  console.log(`Voice URL: ${item.voiceUrl}`);
  console.log(`Voice Method: ${item.voiceMethod}`);
  console.log(`SMS URL: ${item.smsUrl}`);
}

run().catch(console.error);
