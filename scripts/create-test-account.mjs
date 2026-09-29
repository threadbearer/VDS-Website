 
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  const email = "test@knightshift.com";
  const password = "TestPassword123!";
  const businessName = "Test Plumbing Co.";

  console.log(`[1/3] Creating test user in Auth (${email})...`);
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { business_name: businessName },
  });

  if (authError) {
    if (authError.code === "email_exists") {
      console.log("User already exists, attempting to delete it first...");
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users.users.find(u => u.email === email);
      if (existingUser) {
        await supabase.auth.admin.deleteUser(existingUser.id);
        console.log("Deleted old user. Restart script.");
        process.exit(0);
      }
    }
    console.error("Auth error:", authError);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`User created: ${userId}`);

  console.log(`[2/3] Creating tenant for ${businessName}...`);
  const uniqueSuffix = Math.random().toString(36).substring(2, 7);
  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .insert({
      name: businessName,
      slug: `test-plumbing-co-${uniqueSuffix}`,
      subscription_tier: 'standard', // Mocking the stripe plan_id
      stripe_customer_id: 'cus_test_mock123',
      stripe_subscription_id: 'sub_test_mock123',
      onboarding_completed: false, // This ensures they are routed to /onboarding
    })
    .select('id')
    .single();

  if (tenantError) {
    console.error("Tenant error:", tenantError);
    process.exit(1);
  }

  const tenantId = tenantData.id;
  console.log(`Tenant created: ${tenantId}`);

  console.log(`[3/3] Mapping user to tenant...`);
  const { error: mapError } = await supabase
    .from('user_tenants')
    .insert({
      user_id: userId,
      tenant_id: tenantId,
      role: 'owner',
    });

  if (mapError) {
    console.error("Mapping error:", mapError);
    process.exit(1);
  }

  console.log("\n=========================================");
  console.log("✅ TEST ACCOUNT READY");
  console.log("=========================================");
  console.log(`Login URL: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`);
  console.log(`Email:     ${email}`);
  console.log(`Password:  ${password}`);
  console.log("=========================================");
  console.log("Log in with these credentials and you will be immediately routed to the Onboarding Flow.");
}

main();
