import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const AGENT_USER_ID = "605188db-f62c-46a0-94d9-e5dac9823523";   // agent@knightshiftagents.com
const KS_TENANT_ID = "7bb76919-2ec3-4867-acdf-fa727080b430";    // Knight Shift Agents

async function run() {
  // Step 1: Link agent@ to Knight Shift Agents tenant
  console.log("Linking agent@knightshiftagents.com to Knight Shift Agents tenant...");
  const { error: linkError } = await supabase
    .from("user_tenants")
    .upsert({
      user_id: AGENT_USER_ID,
      tenant_id: KS_TENANT_ID,
      role: "admin",
    }, { onConflict: "user_id,tenant_id" });

  if (linkError) {
    console.error("Failed to link user to tenant:", linkError);
  } else {
    console.log("✅ agent@ linked to Knight Shift Agents as admin");
  }

  // Step 2: Deactivate null-category knowledge items (legacy, unstructured)
  console.log("\nDeactivating null-category knowledge items...");
  const { data: nullItems, error: fetchError } = await supabase
    .from("knowledge_items")
    .select("id, title, category")
    .eq("tenant_id", KS_TENANT_ID)
    .is("category", null);

  if (fetchError) {
    console.error("Failed to fetch null-category items:", fetchError);
  } else {
    console.log(`Found ${nullItems?.length || 0} uncategorized items:`);
    for (const item of nullItems || []) {
      console.log(`  - ${item.title}`);
    }

    const ids = (nullItems || []).map((i) => i.id);
    if (ids.length > 0) {
      const { error: deactivateError } = await supabase
        .from("knowledge_items")
        .update({ is_active: false })
        .in("id", ids);

      if (deactivateError) {
        console.error("Failed to deactivate:", deactivateError);
      } else {
        console.log(`✅ Deactivated ${ids.length} legacy items`);
      }
    }
  }

  // Step 3: Verify final state
  console.log("\n=== Final user_tenants ===");
  const { data: mappings } = await supabase
    .from("user_tenants")
    .select("user_id, tenant_id, role")
    .eq("tenant_id", KS_TENANT_ID);
  console.log(JSON.stringify(mappings, null, 2));

  console.log("\n=== Active Knowledge Items ===");
  const { data: activeItems } = await supabase
    .from("knowledge_items")
    .select("category, title")
    .eq("tenant_id", KS_TENANT_ID)
    .eq("is_active", true)
    .order("category");
  for (const item of activeItems || []) {
    console.log(`  [${item.category || "null"}] ${item.title}`);
  }
}

run().catch(console.error);
