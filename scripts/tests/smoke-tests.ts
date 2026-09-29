import assert from "assert";
import crypto from "crypto";
import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { POST as stripeWebhookHandler } from "../../src/app/api/stripe/webhook/route";
import { POST as endCallHandler } from "../../src/app/api/orchestrator/end-call/route";
import {
  classifyConsentKeyword,
  normalizePhone,
  isWithinQuietHours,
} from "../../src/lib/compliance/sms-consent";
import {
  roleSlotsFor,
  effectiveAllowance,
  PLANS,
  CAPACITY_PACK_GRANT,
  buildCheckoutMetadata,
  parseCheckoutMetadata,
} from "../../src/lib/stripe";
import { crossedThreshold } from "../../src/lib/usage/meter";
import { inferTimezoneFromPhone } from "../../src/lib/compliance/area-code-timezone";

dotenv.config({ path: ".env.local" });

const STRIPE_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "whsec_dummy";
const BASE_URL = "http://localhost:3000"; // Used just for the Request URL

function generateStripeSignature(payload: string, secret: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadToSign = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadToSign)
    .digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

async function runSmokeTests() {
  console.info("Running smoke tests...");

  // 1. Test /api/stripe/webhook with missing signature
  console.info("Testing /api/stripe/webhook (Missing Signature)...");
  const reqNoSig = new NextRequest(`${BASE_URL}/api/stripe/webhook`, {
    method: "POST",
    body: JSON.stringify({ type: "checkout.session.completed" }),
  });
  const resNoSig = await stripeWebhookHandler(reqNoSig);
  assert.strictEqual(resNoSig.status, 400, "Expected 400 for missing signature");

  // 2. Test /api/stripe/webhook with invalid signature
  console.info("Testing /api/stripe/webhook (Invalid Signature)...");
  const reqInvalidSig = new NextRequest(`${BASE_URL}/api/stripe/webhook`, {
    method: "POST",
    headers: { "stripe-signature": "t=123,v1=invalid" },
    body: JSON.stringify({ type: "checkout.session.completed" }),
  });
  const resInvalidSig = await stripeWebhookHandler(reqInvalidSig);
  assert.strictEqual(resInvalidSig.status, 400, "Expected 400 for invalid signature");

  // 3. Test /api/stripe/webhook with valid signature but unhandled event
  console.info("Testing /api/stripe/webhook (Valid Signature, Unhandled Event)...");
  const payload = JSON.stringify({ type: "some.random.event" });
  const validSig = generateStripeSignature(payload, STRIPE_SECRET);
  const reqValid = new NextRequest(`${BASE_URL}/api/stripe/webhook`, {
    method: "POST",
    headers: { "stripe-signature": validSig },
    body: payload,
  });
  const resValid = await stripeWebhookHandler(reqValid);
  assert.strictEqual(resValid.status, 200, "Expected 200 for valid signature");

  // 4. Test /api/orchestrator/end-call without auth
  console.info("Testing /api/orchestrator/end-call (Missing Auth)...");
  const reqNoAuthEndCall = new NextRequest(`${BASE_URL}/api/orchestrator/end-call`, {
    method: "POST",
    body: JSON.stringify({ call_id: "test", duration: 60 }),
  });
  const resNoAuthEndCall = await endCallHandler(reqNoAuthEndCall);
  assert.strictEqual(resNoAuthEndCall.status, 401, "Expected 401 for missing auth");

  // 5. Wrong bearer secret must also be rejected. This specifically guards the
  // `Bearer undefined` class of bug called out in CONTEXT.md §2 — if the env
  // var were unset and compared via a template literal, this would pass.
  console.info("Testing /api/orchestrator/end-call (Wrong Secret)...");
  const reqBadSecret = new NextRequest(`${BASE_URL}/api/orchestrator/end-call`, {
    method: "POST",
    headers: { authorization: "Bearer definitely-not-the-secret" },
    body: JSON.stringify({ call_id: "test", duration: 60 }),
  });
  const resBadSecret = await endCallHandler(reqBadSecret);
  assert.strictEqual(resBadSecret.status, 401, "Expected 401 for wrong secret");

  // ── Pure-logic guards ──────────────────────────────────────────────────
  // No DB or network. These cover the compliance and billing-entitlement
  // rules where a silent regression means legal exposure or lost revenue.

  // 6. TCPA consent keywords
  console.info("Testing SMS consent keyword classification...");
  assert.strictEqual(classifyConsentKeyword("STOP"), "stop");
  assert.strictEqual(classifyConsentKeyword(" stop. "), "stop");
  assert.strictEqual(classifyConsentKeyword("Unsubscribe"), "stop");
  assert.strictEqual(classifyConsentKeyword("START"), "start");
  assert.strictEqual(classifyConsentKeyword("help"), "help");
  // Must NOT treat a normal sentence containing "stop" as an opt-out —
  // silently unsubscribing a real customer loses the lead.
  assert.strictEqual(classifyConsentKeyword("can you stop by tomorrow?"), null);
  assert.strictEqual(classifyConsentKeyword("I need a quote"), null);

  assert.strictEqual(normalizePhone("+1 (661) 449-2210"), "6614492210");
  assert.strictEqual(normalizePhone("6614492210"), "6614492210");

  // 7. TCPA quiet hours (8am–9pm in the tenant's timezone)
  console.info("Testing TCPA quiet-hours window...");
  const noonPacific = new Date("2026-01-15T20:00:00Z"); // 12:00 PST
  const twoAmPacific = new Date("2026-01-15T10:00:00Z"); // 02:00 PST
  assert.strictEqual(
    isWithinQuietHours("America/Los_Angeles", noonPacific),
    true,
    "Midday should be sendable",
  );
  assert.strictEqual(
    isWithinQuietHours("America/Los_Angeles", twoAmPacific),
    false,
    "2am must never be sendable",
  );
  // Unknown timezone fails closed rather than risking an off-hours send.
  assert.strictEqual(isWithinQuietHours("Not/AZone", noonPacific), false);

  // 8. Role entitlement math (drives what a paying customer receives)
  console.info("Testing role-slot entitlement math...");
  assert.strictEqual(roleSlotsFor("starter", 0), 1);
  assert.strictEqual(roleSlotsFor("starter", 2), 3, "Extra roles must add slots");
  assert.strictEqual(roleSlotsFor("growth", 0), 2);
  assert.strictEqual(roleSlotsFor("scale", 0), 5); // all 5 roles incl. Office Manager
  assert.strictEqual(roleSlotsFor("starter", -5), 1, "Negative units clamp to 0");

  // 9. Usage allowance math (drives whether a paying customer's capacity_pack
  // add-on actually does anything — this was previously unenforced entirely)
  console.info("Testing usage allowance math...");
  // Assert the MATH against PLANS/CAPACITY_PACK_GRANT rather than restating
  // the marketing numbers — those legitimately change (they did in the
  // 2026-08-06 Starter redesign, which silently broke the old hardcoded
  // expectations here). stripe.ts is the single source of truth for values.
  const starterBase = effectiveAllowance("starter", []);
  assert.strictEqual(starterBase.voiceMinutes, PLANS.starter.limits.voiceMinutes);
  assert.strictEqual(starterBase.sms, PLANS.starter.limits.sms);
  assert.strictEqual(starterBase.capacityPacks, 0);

  const starterWithPack = effectiveAllowance("starter", [
    { id: "capacity_pack", quantity: 1 },
  ]);
  assert.strictEqual(
    starterWithPack.voiceMinutes,
    PLANS.starter.limits.voiceMinutes + CAPACITY_PACK_GRANT.voiceMinutes,
    "One capacity pack should add its full minute grant",
  );
  assert.strictEqual(
    starterWithPack.sms,
    PLANS.starter.limits.sms + CAPACITY_PACK_GRANT.sms,
    "One capacity pack should add its full SMS grant",
  );
  assert.strictEqual(starterWithPack.capacityPacks, 1);

  const starterWithTwoPacks = effectiveAllowance("starter", [
    { id: "capacity_pack", quantity: 2 },
  ]);
  assert.strictEqual(
    starterWithTwoPacks.voiceMinutes,
    PLANS.starter.limits.voiceMinutes + 2 * CAPACITY_PACK_GRANT.voiceMinutes,
  );
  assert.strictEqual(starterWithTwoPacks.capacityPacks, 2);

  // Legacy shape (plain string[]) must still count as one unit each.
  const legacyShape = effectiveAllowance("starter", ["capacity_pack"]);
  assert.strictEqual(legacyShape.capacityPacks, 1);

  assert.strictEqual(
    effectiveAllowance("growth", []).voiceMinutes,
    PLANS.growth.limits.voiceMinutes,
  );
  assert.strictEqual(effectiveAllowance("scale", []).sms, PLANS.scale.limits.sms);

  // 10. Alert threshold crossing (80%/100%) must fire exactly once per level
  console.info("Testing usage alert threshold crossing...");
  assert.strictEqual(crossedThreshold(50), null, "Below 80% is not alertable");
  assert.strictEqual(crossedThreshold(80), 0.8);
  assert.strictEqual(crossedThreshold(99), 0.8, "99% is still the 80% tier");
  assert.strictEqual(crossedThreshold(100), 1, "100%+ hits the top tier");
  assert.strictEqual(crossedThreshold(150), 1, "Overage still reports the top tier, not higher");

  // 11. Area-code timezone inference (drives per-contact TCPA quiet hours)
  console.info("Testing area-code timezone inference...");
  assert.strictEqual(inferTimezoneFromPhone("+16614492210"), "America/Los_Angeles");
  assert.strictEqual(inferTimezoneFromPhone("2125551234"), "America/New_York");
  assert.strictEqual(inferTimezoneFromPhone("14805551234"), "America/Phoenix");
  // Unrecognized/foreign/malformed numbers must fail to null, not throw or guess.
  assert.strictEqual(inferTimezoneFromPhone("123"), null);
  assert.strictEqual(inferTimezoneFromPhone(""), null);
  assert.strictEqual(inferTimezoneFromPhone("+442071234567"), null, "Non-NANP numbers must not be guessed");

  // 12. Integration credential encryption (tenant_integrations vault)
  console.info("Testing integration credential crypto...");
  const priorKey = process.env.INTEGRATIONS_ENCRYPTION_KEY;
  process.env.INTEGRATIONS_ENCRYPTION_KEY = crypto.randomBytes(32).toString("base64");
  {
    const { encryptSecret, decryptSecret } = await import(
      "../../src/lib/connectors/crypto"
    );
    const secret = JSON.stringify({ access_token: "tok_123", hook_url: "https://hooks.zapier.com/x" });
    const encrypted = encryptSecret(secret);
    assert.notStrictEqual(encrypted, secret, "Ciphertext must not equal plaintext");
    assert.ok(encrypted.startsWith("enc1:"), "Versioned wire format expected");
    assert.strictEqual(decryptSecret(encrypted), secret, "Roundtrip must recover the plaintext");
    // GCM auth tag must reject tampered ciphertext instead of returning garbage.
    const parts = encrypted.split(":");
    const tampered = Buffer.from(parts[3], "base64");
    tampered[0] ^= 0xff;
    parts[3] = tampered.toString("base64");
    assert.throws(() => decryptSecret(parts.join(":")), "Tampered ciphertext must fail auth");
  }
  if (priorKey === undefined) delete process.env.INTEGRATIONS_ENCRYPTION_KEY;
  else process.env.INTEGRATIONS_ENCRYPTION_KEY = priorKey;

  console.info("Testing admin voice token (app mints, orchestrator verifies)...");
  const priorOrchSecret = process.env.ORCHESTRATOR_SECRET;
  process.env.ORCHESTRATOR_SECRET = "smoke-orch-secret";
  {
    const { mintAdminVoiceToken } = await import("../../src/lib/admin-voice-token");
    const { verifyAdminToken } = await import("../../services/orchestrator/lib/admin-token");
    const tenant = "11111111-2222-3333-4444-555555555555";
    const token = mintAdminVoiceToken(tenant)!;
    assert.ok(verifyAdminToken(token, tenant), "Fresh token must verify for its tenant");
    assert.ok(!verifyAdminToken(token, "99999999-2222-3333-4444-555555555555"), "Token must not verify for another tenant");
    assert.ok(!verifyAdminToken(undefined, tenant), "Missing token must fail");
    const [t, , sig] = token.split(".");
    assert.ok(!verifyAdminToken(`${t}.${Date.now() - 1000}.${sig}`, tenant), "Expired/altered expiry must fail");
    assert.ok(!verifyAdminToken(`${t}.${Date.now() + 999999}.forged`, tenant), "Forged signature must fail");
  }
  if (priorOrchSecret === undefined) delete process.env.ORCHESTRATOR_SECRET;
  else process.env.ORCHESTRATOR_SECRET = priorOrchSecret;

  console.info("Testing owner message preferences...");
  {
    const { readOwnerPrefs } = await import("../../src/lib/owner-prefs");
    assert.deepStrictEqual(readOwnerPrefs(null), { morningRundown: true, ownerLanguage: "en" }, "Defaults: rundown on, English");
    assert.deepStrictEqual(readOwnerPrefs({ morningRundown: false, ownerLanguage: "es" }), { morningRundown: false, ownerLanguage: "es" });
    assert.strictEqual(readOwnerPrefs({ ownerLanguage: "fr" }).ownerLanguage, "en", "Unsupported language falls back to English");
  }

  console.info("Testing Ask the Boss reply parsing...");
  {
    const { parseBossReply } = await import("../../src/lib/agent/boss-requests");
    assert.deepStrictEqual(parseBossReply("yes 123"), { kind: "approval", shortId: "123", approved: true });
    assert.deepStrictEqual(parseBossReply("SÍ 482"), { kind: "approval", shortId: "482", approved: true });
    assert.deepStrictEqual(parseBossReply("NO 482"), { kind: "approval", shortId: "482", approved: false });
    assert.deepStrictEqual(parseBossReply("123 yes we service tankless"), { kind: "answer", shortId: "123", answer: "yes we service tankless" });
    assert.strictEqual(parseBossReply("what's on today?"), null, "Normal owner texts fall through to the agent");
    assert.strictEqual(parseBossReply("DONE"), null);
  }

  console.info("Testing supplier invoice reconciliation...");
  {
    const { parseSupplierLines, compareToPurchaseOrder } = await import("../../src/lib/office/reconcile");
    const po = parseSupplierLines("Rheem 50 gal water heater x2 @ 920; Flex connector x4 @ 12.50");
    assert.deepStrictEqual(po[0], { description: "Rheem 50 gal water heater", quantity: 2, unitPrice: 920, total: 1840 });
    const clean = compareToPurchaseOrder({ lines: po, total: 1890 }, { lines: parseSupplierLines("RHEEM 50 GAL WATER HEATER x2 @ 920; Flex connector x4 @ 12.50"), total: 1890 });
    assert.strictEqual(clean.length, 0, "A matching invoice has no discrepancies");
    const off = compareToPurchaseOrder(
      { lines: po, total: 1890 },
      { lines: parseSupplierLines("Rheem 50 gal water heater x2 @ 945; Flex connector x3 @ 12.50; Fuel surcharge x1 @ 18"), total: 1945.5 },
    );
    assert.deepStrictEqual(off.map((d) => d.kind).sort(), ["extra_item", "price", "quantity", "total"]);
  }

  console.info("Testing team lines (shift + load schedule)...");
  {
    const { normalizeShift, parseCsv, findLoad, readTeamLines } = await import("../../src/lib/team-lines");
    assert.strictEqual(normalizeShift("second shift"), "2nd");
    assert.strictEqual(normalizeShift("graveyard"), "3rd");
    assert.strictEqual(normalizeShift("the 1st"), "1st");
    assert.strictEqual(normalizeShift("whenever"), null);
    const rows = parseCsv('PO Number,Door,Notes\n"PO-44 18",Door 7,"Check in at gate 2, then dock"\n5521,Door 3,\n');
    assert.deepStrictEqual(findLoad(rows, "po4418")?.details, { Door: "Door 7", Notes: "Check in at gate 2, then dock" });
    assert.strictEqual(findLoad(rows, "9999"), null);
    const lines = readTeamLines({ shiftSupervisors: [{ name: "Ana", phone: "(818) 555-0100", shifts: ["2nd", "bogus"], language: "es" }] });
    assert.deepStrictEqual(lines.shiftSupervisors, [{ name: "Ana", phone: "+18185550100", shifts: ["2nd"], language: "es" }]);
  }

  console.info("Testing price book matching + business tool settings...");
  {
    const { parseItemRequest, matchItem } = await import("../../src/lib/estimates");
    const book = [
      { id: "a", name: "50-gal water heater install", description: null, unit_price: 1800, unit: "each", tier: null },
      { id: "b", name: "Haul away old unit", description: null, unit_price: 95, unit: "each", tier: null },
    ];
    assert.deepStrictEqual(parseItemRequest("50-gal water heater install x1; Haul away old unit x 2"), [
      { name: "50-gal water heater install", quantity: 1 },
      { name: "Haul away old unit", quantity: 2 },
    ]);
    assert.strictEqual(matchItem("water heater install 50 gal", book)?.id, "a");
    assert.strictEqual(matchItem("roof replacement", book), null, "Nothing is quoted that isn't in the price book");
    const { readBusinessTools } = await import("../../src/lib/business-tools");
    const tools = readBusinessTools({ reviewLink: "http://not-https.example", serviceZips: "91344, 91343 abc", estimateDepositPercent: 250 });
    assert.strictEqual(tools.reviewLink, null, "Only https review links are used");
    assert.deepStrictEqual(tools.serviceZips, ["91344", "91343"]);
    assert.strictEqual(tools.estimateDepositPercent, 100, "Deposit is clamped to 100%");
  }

  console.info("Testing tool entitlement gating (tier / role / team module)...");
  {
    const { getToolsForTier } = await import("../../src/lib/agent/tool-registry");
    const names = (tier: "starter" | "growth" | "scale" | null, roles: any[] = [], modules: any[] = []) =>
      new Set(getToolsForTier(tier, undefined, roles, modules).map((t) => t.name));

    // Estimates are Growth/Scale, or the Sales Rep role on any tier.
    assert.ok(!names("starter").has("draftEstimate"), "Starter must not get estimates by default");
    assert.ok(names("growth").has("draftEstimate"), "Growth gets estimates");
    assert.ok(names("starter", ["Sales Rep"]).has("draftEstimate"), "Sales Rep role grants estimates on Starter");

    // Office Manager tools are Scale, or the Office Manager role.
    assert.ok(!names("growth").has("reconcileSupplierInvoice"), "Growth must not get Office Manager tools");
    assert.ok(names("growth", ["Office Manager"]).has("reconcileSupplierInvoice"), "Office Manager role grants them");

    // Team-line tools exist only for tenants that turned that module on —
    // not even Scale gets them by tier alone.
    for (const tier of ["starter", "growth", "scale"] as const) {
      assert.ok(!names(tier).has("logCallOff"), `${tier} must not get call-off tools without the module`);
    }
    assert.ok(names("growth", [], ["call_off"]).has("logCallOff"), "call_off module grants logCallOff");
    assert.ok(!names("growth", [], ["call_off"]).has("transferToDepartment"), "one module doesn't grant another's tools");

    // Disabled tools are never offered to anyone.
    assert.ok(!names("scale", ["Office Manager", "Sales Rep"]).has("navigateBrowser"), "navigateBrowser stays disabled");
  }

  console.info("Testing Google Ads manager-link mapping...");
  {
    const { toLinkedAccounts } = await import("../../src/lib/ads/google-ads");
    const rows = [
      { customer_client: { id: 1111111111, level: 0, descriptive_name: "Knight Shift MCC" } },
      { customer_client: { id: 2222222222, level: 1, descriptive_name: "Client A" } },
      { customer_client: { id: "3333333333", level: 2, descriptive_name: "Client B (sub-account)" } },
      { customer_client: { level: 1 } },
      {},
    ];
    const linked = toLinkedAccounts(rows);
    assert.deepStrictEqual(linked.map((a) => a.customerId), ["2222222222", "3333333333"]);
    assert.ok(
      !linked.some((a) => a.customerId === "1111111111"),
      "The manager's own account (level 0) must never be claimable by a tenant",
    );
  }

  console.info("Testing orchestrator pre-flight classification + call rescue...");
  {
    const { classifyProbe } = await import("../../src/lib/orchestrator-health");
    const { missedCallTextBody, isTextableCaller } = await import("../../src/lib/call-rescue");

    // Only a DEFINITE failure diverts a call; ambiguity must still stream
    // (Cloud Run cold starts look like timeouts — failing closed would send
    // every first call of the morning to voicemail).
    assert.strictEqual(classifyProbe({ kind: "response", status: 200, body: { ready: true } }).verdict, "up");
    assert.strictEqual(classifyProbe({ kind: "response", status: 503, body: { ready: false, reasons: ["x"] } }).verdict, "down");
    assert.strictEqual(classifyProbe({ kind: "response", status: 500 }).verdict, "down");
    assert.strictEqual(classifyProbe({ kind: "network", message: "ECONNREFUSED" }).verdict, "down");
    assert.strictEqual(classifyProbe({ kind: "timeout" }).verdict, "unknown", "a timeout is a possible cold start, not an outage");
    assert.strictEqual(classifyProbe({ kind: "response", status: 404 }).verdict, "unknown", "a build without /ready must not divert calls");

    assert.ok(missedCallTextBody("Acme HVAC", false).includes("Reply STOP"), "text-back always carries an opt-out");
    assert.ok(!missedCallTextBody("Acme HVAC", false).includes("Perdón"), "no Spanish when the tenant turned it off");
    assert.ok(missedCallTextBody("Acme HVAC", true).includes("Perdón"));
    assert.ok(!isTextableCaller("anonymous") && !isTextableCaller("") && isTextableCaller("+16614492210"));
  }

  console.info("Testing checkout metadata key preservation...");
  {
    // A test that fails if checkout stops sending any key the webhook reads
    // (plan_id, business_name, email, phone, industry, addons, roles)
    const requiredKeys = ["plan_id", "business_name", "email", "phone", "industry", "addons", "roles"] as const;
    const metadata = buildCheckoutMetadata({
      plan_id: "starter",
      business_name: "Smoke Test LLC",
      email: "smoke@example.com",
      phone: "1234567890",
      industry: "tech",
      addons: "[]",
      roles: "[]"
    });
    
    // Check that build Checkout Metadata returns everything
    for (const key of requiredKeys) {
      assert.ok(
        key in metadata,
        `buildCheckoutMetadata must include required key '${key}'`
      );
    }
    
    // Check that parseCheckoutMetadata reads them back out
    const parsed = parseCheckoutMetadata(metadata);
    for (const key of requiredKeys) {
      assert.ok(
        key in parsed,
        `parseCheckoutMetadata must parse and return required key '${key}'`
      );
    }
  }
  console.info("Testing ROI report message builder...");
  {
    const { buildRoiMessage } = await import("../../src/lib/roi-report");
    
    const stats = { voice: 42, sms: 10, leads: 5, appts: 2 };
    
    // 1. With average ticket and revenue
    const msgWithRev = buildRoiMessage("August", stats, 350, "en");
    assert.ok(msgWithRev.includes("≈ $700 at your $350 avg ticket"), "Message must include calculated revenue");
    assert.ok(msgWithRev.includes("- Calls Handled: 42"), "Message must include calls handled");
    
    // 2. Without average ticket (no revenue line)
    const msgNoRev = buildRoiMessage("August", stats, null, "en");
    assert.ok(!msgNoRev.includes("≈ $"), "Message must omit revenue if no average ticket");
    
    // 3. With 0 appts (no revenue line)
    const statsZeroAppts = { ...stats, appts: 0 };
    const msgZeroAppts = buildRoiMessage("August", statsZeroAppts, 350, "en");
    assert.ok(!msgZeroAppts.includes("≈ $"), "Message must omit revenue if 0 appts");
    
    // 4. Spanish translation
    const msgEs = buildRoiMessage("August", stats, 350, "es");
    assert.ok(msgEs.includes("Informe Mensual"), "Must translate to Spanish");
    assert.ok(msgEs.includes("≈ $700 con un ticket promedio de $350"), "Must translate revenue line to Spanish");
  }

  console.info("Testing Heat Wave logic helper...");
  {
    const { shouldSendHeatWaveAlert } = await import("../../src/lib/heat-wave");
    const today = "2026-09-23";
    const baseSettings = { industry: "HVAC Services", serviceZips: ["90210"] };
    
    // Valid case
    assert.ok(shouldSendHeatWaveAlert(baseSettings, today, 105, "America/Los_Angeles", () => true));
    
    // Not HVAC
    assert.ok(!shouldSendHeatWaveAlert({ ...baseSettings, industry: "Plumbing" }, today, 105, "America/Los_Angeles", () => true));
    
    // Already asked today
    assert.ok(!shouldSendHeatWaveAlert({ ...baseSettings, lastHeatWaveAsk: today }, today, 105, "America/Los_Angeles", () => true));
    
    // Already enabled
    assert.ok(!shouldSendHeatWaveAlert({ ...baseSettings, heatWaveModeEnabled: true }, today, 105, "America/Los_Angeles", () => true));
    
    // Quiet hours
    assert.ok(!shouldSendHeatWaveAlert(baseSettings, today, 105, "America/Los_Angeles", () => false));
    
    // Temp under 100
    assert.ok(!shouldSendHeatWaveAlert(baseSettings, today, 99, "America/Los_Angeles", () => true));
  }

  console.info("✅ All smoke tests passed!");
}

runSmokeTests().catch((err) => {
  console.error("❌ Smoke tests failed:", err);
  process.exit(1);
});
