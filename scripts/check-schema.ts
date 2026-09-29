import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function main() {
  const { data, error } = await supabase.from("agents").select("*").eq("id", "9b800454-7e9b-4e74-8a0b-d9e00f1f00c4").single();
  console.log(Object.keys(data));
}
main();
