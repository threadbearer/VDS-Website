import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: tenant, error: tErr } = await supabase
    .from("tenants")
    .select("id")
    .eq("name", "Knight Shift Agents")
    .single();

  if (tErr || !tenant) {
    console.error("Failed to find tenant", tErr);
    return;
  }

  const tenantId = tenant.id;
  console.log("Found tenant:", tenantId);

  // Update owner_phone
  await supabase
    .from("tenants")
    .update({ owner_phone: "+15551234567" })
    .eq("id", tenantId);

  console.log("Updated owner_phone to +15551234567");

  // Check if agent exists
  const { data: existingAgent } = await supabase
    .from("agents")
    .select("id")
    .eq("tenant_id", tenantId)
    .single();

  if (!existingAgent) {
    console.log("No agent found, creating one...");
    const { error: aErr } = await supabase.from("agents").insert({
      tenant_id: tenantId,
      name: "Arthur (Knight Shift)",
      type: "receptionist",
      status: "active",
      provider: "vapi",
      system_prompt: "You are Arthur, the friendly AI assistant for Knight Shift Agents. You help manage appointments, answer questions, and assist with any inquiries.",
      persona_config: {
        archetypeId: "squire",
        custom_greeting: "Welcome to Knight Shift Agents! This is Arthur, how can I assist you today?"
      },
      config: {
        phone_number: "+18005550000"
      }
    });

    if (aErr) {
      console.error("Failed to create agent", aErr);
    } else {
      console.log("Agent provisioned successfully!");
    }
  } else {
    console.log("Agent already exists:", existingAgent.id);
  }
}

run();
