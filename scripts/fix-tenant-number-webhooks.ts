/**
 * Backfill voice webhooks (+ A2P Messaging Service membership) on client
 * numbers bought before src/lib/provisioning.ts set them.
 *
 * Numbers purchased at onboarding only got an SMS webhook, so calls to them
 * never reached the client's agent. This lists every number on the Twilio
 * account and shows what it would change.
 *
 *   npx tsx scripts/fix-tenant-number-webhooks.ts            # dry run (default)
 *   npx tsx scripts/fix-tenant-number-webhooks.ts --apply    # make the changes
 *
 * Skips the main Knight Shift number (TWILIO_PHONE_NUMBER) and any number whose
 * voice URL points somewhere else on purpose (e.g. a dev tunnel) unless
 * --include-custom is passed.
 */

import { config } from "dotenv";
import twilio from "twilio";

config({ path: ".env.local" });

const apply = process.argv.includes("--apply");
const includeCustom = process.argv.includes("--include-custom");
const site = process.env.NEXT_PUBLIC_SITE_URL;
const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const main = process.env.TWILIO_PHONE_NUMBER;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

async function run() {
  if (!sid || !token || !site || site.includes("localhost")) {
    console.error("Need TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and a production NEXT_PUBLIC_SITE_URL in .env.local");
    process.exit(1);
  }
  const client = twilio(sid, token);
  const voiceUrl = `${site}/api/twilio/voice`;
  const fallbackUrl = `${site}/api/twilio/fallback`;

  const inService = new Set<string>();
  if (messagingServiceSid) {
    const members = await client.messaging.v1.services(messagingServiceSid).phoneNumbers.list({ limit: 1000 });
    members.forEach((m) => inService.add(m.sid));
  }

  const numbers = await client.incomingPhoneNumbers.list({ limit: 1000 });
  for (const n of numbers) {
    if (n.phoneNumber === main) continue;
    const custom = !!n.voiceUrl && n.voiceUrl !== voiceUrl;
    const needsVoice = !n.voiceUrl || (includeCustom && custom);
    const needsFallback = n.voiceFallbackUrl !== fallbackUrl && (needsVoice || !custom);
    const needsService = !!messagingServiceSid && !inService.has(n.sid);

    if (!needsVoice && !needsFallback && !needsService) {
      console.info(`OK       ${n.phoneNumber}`);
      continue;
    }
    console.info(
      `${apply ? "FIXING" : "WOULD FIX"} ${n.phoneNumber}:` +
        (needsVoice ? ` voiceUrl ${n.voiceUrl || "(none)"} → ${voiceUrl};` : "") +
        (needsFallback ? ` fallback → ${fallbackUrl};` : "") +
        (needsService ? ` add to Messaging Service ${messagingServiceSid};` : "") +
        (custom && !includeCustom ? ` (custom voiceUrl kept: ${n.voiceUrl})` : ""),
    );
    if (!apply) continue;

    if (needsVoice || needsFallback) {
      await client.incomingPhoneNumbers(n.sid).update({
        ...(needsVoice ? { voiceUrl, voiceMethod: "POST" } : {}),
        voiceFallbackUrl: fallbackUrl,
        voiceFallbackMethod: "POST",
      });
    }
    if (needsService) {
      await client.messaging.v1.services(messagingServiceSid!).phoneNumbers.create({ phoneNumberSid: n.sid });
    }
  }
  if (!apply) console.info("\nDry run only. Re-run with --apply to make these changes.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
