import { createServiceClient } from "../src/lib/supabase";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function run() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("id, tenant_id, agent_id, contact_phone, channel, status, outcome, started_at")
    .order("started_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching conversations:", error);
    return;
  }

  console.log("Recent Conversations:");
  console.log(JSON.stringify(data, null, 2));

  if (data && data.length > 0) {
    const mostRecentId = data[0].id;
    console.log(`\nMessages for most recent conversation (${mostRecentId}):`);
    const { data: msgs, error: msgsError } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("conversation_id", mostRecentId)
      .order("created_at", { ascending: true });

    if (msgsError) {
      console.error("Error fetching messages:", msgsError);
    } else {
      console.log(JSON.stringify(msgs, null, 2));
    }
  }
}

run();
