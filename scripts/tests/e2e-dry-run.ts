import assert from "assert";
import crypto from "crypto";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { POST as stripeWebhookHandler } from "../../src/app/api/stripe/webhook/route";

dotenv.config({ path: ".env.local" });

const BASE_URL = "http://localhost:3000";
const STRIPE_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "whsec_dummy";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const supabaseAuth = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);

function generateStripeSignature(payload: string, secret: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadToSign = `${timestamp}.${payload}`;
  const signature = crypto.createHmac("sha256", secret).update(payloadToSign).digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

async function runE2E() {
  console.info("🚀 Starting E2E Dry Run...");
  const testEmail = `e2e_${Date.now()}@knightshift.test`;
  const businessName = "E2E Test Corp";
  
  // 1. Simulate Stripe Webhook
  console.info(`\n[1] Simulating Stripe Webhook (Signup) for ${testEmail}...`);
  const stripePayload = JSON.stringify({
    id: `evt_test_${Date.now()}`,
    type: "checkout.session.completed",
    data: {
      object: {
        customer: `cus_test_${Date.now()}`,
        subscription: `sub_test_${Date.now()}`,
        metadata: {
          plan_id: "growth",
          business_name: businessName,
          email: testEmail,
          phone: "+15551234567"
        }
      }
    }
  });

  const req = new NextRequest(`${BASE_URL}/api/stripe/webhook`, {
    method: "POST",
    headers: { "stripe-signature": generateStripeSignature(stripePayload, STRIPE_SECRET) },
    body: stripePayload,
  });
  const webhookRes = await stripeWebhookHandler(req);
  assert.strictEqual(webhookRes.status, 200, "Webhook failed");
  
  // Wait a moment for Supabase triggers/inserts to settle
  await new Promise(r => setTimeout(r, 2000));

  // 2. Fetch User & Tenant from DB
  console.info("\n[2] Verifying Tenant & User Creation...");
  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  const testUser = users?.users?.find(u => u.email === testEmail);
  assert.ok(testUser, "User was not created by webhook");

  const { data: tenantMap } = await supabaseAdmin.from("user_tenants").select("tenant_id").eq("user_id", testUser.id).single();
  assert.ok(tenantMap, "User was not mapped to a tenant");
  
  const { data: tenant } = await supabaseAdmin.from("tenants").select("*").eq("id", tenantMap.tenant_id).single();
  assert.strictEqual(tenant.name, businessName, "Tenant name mismatch");
  assert.strictEqual(tenant.subscription_tier, "growth", "Tenant tier mismatch");

  // 3. Authenticate to get a session cookie for Next.js
  console.info("\n[3] Authenticating test user...");
  const password = "E2eTestPassword123!";
  await supabaseAdmin.auth.admin.updateUserById(testUser.id, { password });
  
  const { data: authData, error: authErr } = await supabaseAuth.auth.signInWithPassword({
    email: testEmail,
    password,
  });
  assert.ok(!authErr, "Failed to sign in test user");
  
  // 4. Complete Onboarding (Provisioning)
  console.info("\n[4] Calling /api/onboarding/complete (Provisioning)...");
  const onboardingRes = await fetch(`${BASE_URL}/api/onboarding/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authData.session.access_token}`
    },
    body: JSON.stringify({
      businessName: businessName,
      ownerName: "E2E User",
      agentName: "E2E Sales Agent",
      greetingStyle: "professional",
      customRequests: []
    })
  });
  
  const onboardData = await onboardingRes.json();
  assert.strictEqual(onboardingRes.status, 200, `Onboarding failed: ${JSON.stringify(onboardData)}`);
  assert.ok(onboardData.success, "Onboarding did not return success");
  
  // 5. Simulate /api/twilio/voice
  console.info("\n[5] Simulating /api/twilio/voice (Inbound Call)...");
  
  // Need to get the provisioned phone number first
  const { data: agents } = await supabaseAdmin.from("agents").select("id, config").eq("tenant_id", tenant.id);
  const agent = agents?.find(a => a.config?.phone_number);
  assert.ok(agent, "No agent with phone number found for tenant");
  const agentPhone = agent.config.phone_number;
  
  const twilioFormData = new URLSearchParams();
  twilioFormData.append("From", "+15559998888");
  twilioFormData.append("To", agentPhone);
  twilioFormData.append("CallSid", `CA_e2e_${Date.now()}`);

  const twilioRes = await fetch(`${BASE_URL}/api/twilio/voice`, {
    method: "POST",
    body: twilioFormData,
  });
  assert.strictEqual(twilioRes.status, 200, "Twilio voice failed");
  const twiml = await twilioRes.text();
  
  const convIdMatch = twiml.match(/<Parameter name="conversationId" value="([^"]+)"/);
  assert.ok(convIdMatch, "Failed to extract conversationId from TwiML");
  const conversationId = convIdMatch[1];
  
  // 6. Simulate /api/orchestrator/end-call
  console.info(`\n[6] Simulating /api/orchestrator/end-call for conversation ${conversationId}...`);
  const endCallRes = await fetch(`${BASE_URL}/api/orchestrator/end-call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.ORCHESTRATOR_SECRET || "dummy"}`
    },
    body: JSON.stringify({
      conversationId,
      tenantId: tenant.id,
      durationSeconds: 120, // 2 minutes
      transcript: "User: Hello\nAgent: Hi there!",
      callType: "twilio_inbound",
      isTest: false
    })
  });
  assert.strictEqual(endCallRes.status, 200, `End call failed: ${await endCallRes.text()}`);
  
  // 7. Verify usage_records insertion
  console.info("\n[7] Verifying usage records insertion...");
  const { data: usage } = await supabaseAdmin.from("usage_records").select("*").eq("tenant_id", tenant.id);
  assert.ok(usage && usage.length > 0, "No usage records were created");
  assert.strictEqual(usage[0].quantity, 2, "Usage record quantity is incorrect (expected 2 minutes)");
  assert.strictEqual(usage[0].type, "voice_minute", "Usage record type is incorrect");

  console.info("\n✅ E2E Dry Run Completed Successfully!");
}

runE2E().catch(err => {
  console.error("❌ E2E Dry Run Failed:", err);
  process.exit(1);
});
