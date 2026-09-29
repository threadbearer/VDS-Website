import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function audit() {
  console.log("\n=== TENANTS ===");
  const { data: tenants } = await supabase
    .from("tenants")
    .select("id, name, owner_email, subscription_tier, settings");
  console.log(JSON.stringify(tenants, null, 2));

  console.log("\n=== USER_TENANTS ===");
  const { data: userTenants } = await supabase
    .from("user_tenants")
    .select("user_id, tenant_id, role");
  console.log(JSON.stringify(userTenants, null, 2));

  console.log("\n=== AGENTS ===");
  const { data: agents } = await supabase
    .from("agents")
    .select("id, tenant_id, name, type, status, voice_id, system_prompt, persona_config, config");
  for (const agent of agents || []) {
    console.log(`\n--- Agent: ${agent.name} (${agent.id}) ---`);
    console.log("  tenant_id:", agent.tenant_id);
    console.log("  status:", agent.status);
    console.log("  voice_id:", agent.voice_id);
    console.log("  config:", JSON.stringify(agent.config));
    console.log("  persona_config:", JSON.stringify(agent.persona_config));
    console.log("  system_prompt (first 200):", agent.system_prompt?.slice(0, 200));
  }

  console.log("\n=== KNOWLEDGE ITEMS ===");
  const { data: knowledge } = await supabase
    .from("knowledge_items")
    .select("id, tenant_id, category, title, is_active");
  console.log(JSON.stringify(knowledge, null, 2));

  console.log("\n=== AUTH USERS ===");
  const { data: { users } } = await supabase.auth.admin.listUsers();
  for (const u of users) {
    console.log(`  ${u.email} | id: ${u.id}`);
  }
}

audit().catch(console.error);
