import twilio from "twilio";

async function main() {
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const client = twilio(sid, token);

  // Check the last 5 outbound messages
  console.warn("=== Recent Twilio outbound messages ===");
  const messages = await client.messages.list({ limit: 5 });
  for (const m of messages) {
    console.warn(`[${m.dateSent}] To: ${m.to} | From: ${m.from} | Status: ${m.status} | Error: ${m.errorCode ?? "none"} | Body: ${m.body?.slice(0, 60)}`);
  }

  // Check account status
  console.warn("\n=== Account ===");
  const account = await client.api.accounts(sid).fetch();
  console.warn("Status:", account.status, "| Type:", account.type);

  // Check if the Twilio number has SMS capability
  console.warn("\n=== Phone number capabilities ===");
  const numbers = await client.incomingPhoneNumbers.list({ limit: 5 });
  for (const n of numbers) {
    console.warn(`${n.phoneNumber} | SMS: ${n.capabilities?.sms} | Voice: ${n.capabilities?.voice}`);
  }
}

main().catch(e => console.error("Fatal:", e.message, e.code));
