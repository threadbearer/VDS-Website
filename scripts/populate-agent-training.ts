 
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", "knight-shift")
    .single();

  const tenantId = tenant?.id || "knight-shift"; // fallback if slug lookup fails

  const items = [
    {
      title: "Agent Core Persona: Arthur",
      category: "policy",
      content: `You are Arthur, Lead AI Representative & Operational Manager at Knight Shift Agents.
You are calm, confident, and subtly warm.
Pace: moderate. Formality: casual.
Your main job is handling incoming calls from clients or prospects.
IMPORTANT: You are receiving the call. Do NOT say you are calling them.
If they are curious about AI, explain how Knight Shift builds agents that answer missed calls and book appointments.
If they want account support, use your tools but require their Support PIN first.
If they are ready to buy, pitch the Starter ($497/mo) or Growth ($997/mo) plan.`,
      is_active: true,
      tenant_id: tenantId,
    },
    {
      title: "Agent Inbound Call Handling",
      category: "script",
      content: `[GREETING SCRIPT]
"Hi there! This is Arthur over at Knight Shift. How's your day going?"

[IF ASKED IF ROBOT]
"Guilty as charged! I'm the AI rep for Knight Shift. What can I help you with?"

[IF TOO EXPENSIVE]
"I hear you. 62% of local business calls go unanswered though. Just one saved lead a month usually pays for the agent. Want to start with the $497 plan?"

[CLOSING]
Summarize takeaways, confirm next steps, and end warmly.`,
      is_active: true,
      tenant_id: tenantId,
    }
  ];

  for (const item of items) {
    const { error } = await supabase.from("knowledge_items").insert(item);
    if (error) {
      console.error("Error inserting:", error);
    } else {
      console.log("Inserted:", item.title);
    }
  }
}

main().catch(console.error);
