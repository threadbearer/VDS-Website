import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function main() {
  const { data } = await supabase.from("knowledge_items").select("*").eq("tenant_id", "7bb76919-2ec3-4867-acdf-fa727080b430");
  data?.forEach(d => console.log(d.title, "=>", d.content));
}
main();
