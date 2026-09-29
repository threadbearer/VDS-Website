import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
  // Find Knight Shift Agents tenant
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("name", "Knight Shift Agents")
    .single();

  if (!tenant) return;

  // Find users
  const { data: users, error: usersErr } = await supabase.auth.admin.listUsers();
  if (usersErr || !users.users) {
      console.log("Failed to get users", usersErr);
      return;
  }
  
  const adminUser = users.users.find(u => u.email?.includes('admin') || u.email?.includes('jacob'));
  
  if (!adminUser) {
      console.log("Could not find admin user");
      return;
  }

  // Link them
  const { error } = await supabase.from("user_tenants").insert({
      user_id: adminUser.id,
      tenant_id: tenant.id,
      role: 'owner'
  }).select().single();

  if (error) {
      if (error.code === '23505') {
          console.log("Already linked!");
      } else {
          console.log("Error linking", error);
      }
  } else {
      console.log(`Linked user ${adminUser.email} to tenant ${tenant.id}`);
  }
}
run();
