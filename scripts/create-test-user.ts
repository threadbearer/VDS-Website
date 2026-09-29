 
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  const email = "test@knight.com";
  const password = "PassWord123!";
  const business_name = "Acme Corp";
  const plan_id = "growth";

  console.log("Creating tenant...");
  const { data: tenant, error: tenantErr } = await supabase
    .from("tenants")
    .insert({
      name: business_name,
      slug: "acme-corp-" + Date.now(),
      subscription_tier: plan_id,
      stripe_customer_id: "cus_test123",
      stripe_subscription_id: "sub_test123",
      onboarding_completed: false,
    })
    .select("id")
    .single();

  if (tenantErr) throw tenantErr;
  console.log("Tenant created:", tenant.id);

  console.log("Creating user...");
  // Try to list first
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u) => u.email === email);

  let userId;
  if (existingUser) {
    userId = existingUser.id;
    console.log("Found existing user:", userId);
    // Update password
    await supabase.auth.admin.updateUserById(userId, { password });
  } else {
    const { data: newUser, error: userErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { business_name },
    });
    if (userErr) throw userErr;
    userId = newUser.user.id;
    console.log("User created:", userId);
  }

  console.log("Mapping user to tenant...");
  const { error: mapErr } = await supabase.from("user_tenants").upsert({
    user_id: userId,
    tenant_id: tenant.id,
    role: "owner",
  });
  if (mapErr) throw mapErr;

  console.log("Setup complete! You can now log in with:", email, password);
}

createTestUser().catch(console.error);
