import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Emulate the user session
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  // Get Jacob's user
  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  const user = users.users.find(u => u.email === "jacobslegorreta@gmail.com");
  
  // We can't easily execute RLS without signing in. Let's just query via RPC if possible or check user_tenants.
  const { data: ut } = await supabaseAdmin.from("user_tenants").select("*").eq("user_id", user!.id);
  console.log("Jacob user_tenants:", ut);
}
run();
