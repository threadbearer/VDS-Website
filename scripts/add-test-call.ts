import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
  const tenantId = "7bb76919-2ec3-4867-acdf-fa727080b430";
  const agentId = "9b800454-7e9b-4e74-8a0b-d9e00f1f00c4";
  
  await supabase.from("conversations").insert({
    tenant_id: tenantId,
    agent_id: agentId,
    contact_phone: "+15551234567",
    contact_name: "Jacob",
    channel: "voice",
    status: "completed",
    started_at: new Date(Date.now() - 3600000).toISOString(),
    ended_at: new Date(Date.now() - 3500000).toISOString(),
    is_test: true,
    outcome: "qualified",
    lead_score: 85,
    analysis: {
      qa_review: {
        composite_score: 9.2,
        top_improvement: "Slightly faster response time on technical questions."
      }
    }
  });
  console.log("Test call added");
}
run();
