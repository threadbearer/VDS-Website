import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const phone = "+16614492210";

async function main() {
  const { data: tenants } = await supabase.from("tenants").select("id, name, owner_phone").eq("owner_phone", phone);
  console.log("Tenants owned by phone:", tenants);
  
  const { data: convos } = await supabase.from("conversations").select("id, tenant_id").eq("contact_phone", phone);
  console.log("Conversations from phone:", convos?.length);
}
main();
