/* eslint-disable */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { buildCRASystemPrompt } from "../src/lib/agent/prompts";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log("Starting backfill for agent system_prompts...");

  // Fetch all agents
  const { data: agents, error } = await supabase.from("agents").select("id, tenant_id, system_prompt, type");
  if (error || !agents) {
    console.error("Failed to fetch agents", error);
    return;
  }

  for (const agent of agents) {
    if (!agent.system_prompt) {
      if (agent.type === "cra") {
        // We need the tenant's business context to build the prompt.
        const { data: tenant } = await supabase.from("tenants").select("*").eq("id", agent.tenant_id).single();
        if (tenant) {
          const settings = (tenant.settings as any) || {};
          const ctx = {
            businessName: tenant.name,
            industry: tenant.industry || "General",
            services: settings.services || "General services",
            hours: settings.hours || "Standard business hours",
            phone: tenant.owner_phone || "",
            location: settings.location || "Local area",
            appointmentProcess: settings.appointmentProcess || "Call to schedule",
            escalationPhone: tenant.owner_phone || "",
            additionalContext: settings.additionalContext || "",
          };

          const newPrompt = buildCRASystemPrompt(ctx);
          
          const { error: updateError } = await supabase
            .from("agents")
            .update({ system_prompt: newPrompt })
            .eq("id", agent.id);

          if (updateError) {
            console.error(`Error updating agent ${agent.id}:`, updateError);
          } else {
            console.log(`Backfilled system_prompt for CRA agent ${agent.id}`);
          }
        }
      }
    } else {
      console.log(`Agent ${agent.id} already has a system_prompt.`);
    }
  }

  console.log("Backfill complete.");
}

main().catch(console.error);
