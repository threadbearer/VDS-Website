import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const KNIGHT_SHIFT_TENANT_ID = "7bb76919-2ec3-4867-acdf-fa727080b430";

async function main() {
  const phone = "+16614492210";
  const phone2 = "+16614771610";
  
  // Clear conversations with his phone numbers
  const { data: conv1, error: err1 } = await supabase.from("conversations").delete().in("contact_phone", [phone, phone2]);
  console.log("Deleted conversations:", err1 ? err1 : "Success");
  
  // Clear leads with his phone numbers
  const { data: lead1, error: err2 } = await supabase.from("leads").delete().in("phone", [phone, phone2]);
  console.log("Deleted leads:", err2 ? err2 : "Success");
  
  // Clear any dummy tenants he might have created during a test
  const { data: ten1, error: err3 } = await supabase.from("tenants").delete()
    .in("owner_phone", [phone, phone2])
    .neq("id", KNIGHT_SHIFT_TENANT_ID);
  console.log("Deleted dummy tenants:", err3 ? err3 : "Success");
}
main();
