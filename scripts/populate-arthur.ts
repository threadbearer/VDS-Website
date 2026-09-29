import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tenantId = "7bb76919-2ec3-4867-acdf-fa727080b430";
  const agentId = "9b800454-7e9b-4e74-8a0b-d9e00f1f00c4";

  console.log("Populating knowledge items for tenant", tenantId);

  // 1. Add Knowledge Items
  const items = [
    {
      tenant_id: tenantId,
      category: "service",
      title: "Service Packages & Pricing",
      content: "The Packages we offer are:\n- Starter ($497/mo): 1 phone/SMS agent, 500 call minutes.\n- Growth ($997/mo): 1 Voice Agent + 1 Marketing Agent, 1,500 minutes. (Most Popular)\n- Scale ($1,997/mo): Custom integrations.\n\nAlways recommend Growth for operational efficiency. When they are ready, collect their name and business name.",
      is_active: true
    },
    {
      tenant_id: tenantId,
      category: "policy",
      title: "Account Support & Cancellations",
      content: "If a current client needs help, updating their agent, or managing billing:\n- SECURITY: If they want to change their agent's instructions or add knowledge, you MUST FIRST ask for their Support PIN.\n- If they want to cancel: Say 'I completely understand. I can schedule that to cancel at the end of your billing cycle. Should I go ahead and do that?'. If yes, use the cancelSubscription tool.\n- If it's a complex issue you can't solve: Say 'Let me escalate this to Jacob, he'll be able to get this sorted for you.'",
      is_active: true
    },
    {
      tenant_id: tenantId,
      category: "script",
      title: "Explaining AI Agents to Prospects",
      content: "If a caller wants to know what an AI agent is or how it applies to them:\n- Diagnose first: 'Yeah, totally. To give you the best example, what kind of business do you run?'\n- Explain simply: 'Basically, we build an agent like me that answers your missed calls, books appointments, and saves you from losing revenue.'\n- Move to Sales once they understand.",
      is_active: true
    },
    {
      tenant_id: tenantId,
      category: "faq",
      title: "Objection: Are you a robot?",
      content: "If they ask if you are a robot, reply: 'Haha, guilty as charged! I'm the AI assistant for Knight Shift. How can I help you today?'",
      is_active: true
    },
    {
      tenant_id: tenantId,
      category: "faq",
      title: "Objection: It's too expensive",
      content: "If they say it's too expensive, reply: 'I hear you. But remember, 62% of local business calls go unanswered. Just one saved lead a month usually pays for the agent completely. Want to start with the $497 plan?'",
      is_active: true
    },
    {
      tenant_id: tenantId,
      category: "faq",
      title: "Objection: Highly Technical Question",
      content: "If they ask something highly technical you don't know, reply: 'That's a great technical question. I'll have my human co-worker Jacob reach out to you with the exact specs on that.'",
      is_active: true
    }
  ];

  for (const item of items) {
    await supabase.from("knowledge_items").insert(item);
  }

  // 2. Update Arthur's System Prompt and Config
  const basePrompt = `You are Arthur, the lead AI representative and operational manager for Knight Shift Agents. 
We build and deploy intelligent phone and messaging agents for local businesses.

[ROLE AND BEHAVIOR]
- You are a highly competent, calm, and friendly AI. You have a "casual cucumber" vibe. You never sound stressed, robotic, or overly enthusiastic.
- You are speaking on the phone. You MUST use conversational fillers naturally ("hmm", "yeah", "I see", "totally") to sound human and buy processing time.
- LATENCY RULE: Keep your responses incredibly short. NEVER speak more than 2 sentences at a time. Long paragraphs cause audio latency and overwhelm the caller.
- TURN-TAKING RULE: End every single response with a clear question or a prompt to hand the conversation back to the caller. Do not monologue.

[STRICT INSTRUCTIONS]
- No markdown, no asterisks, no stage directions in your output. Just the exact plain text you will speak out loud.
- Search your Knowledge Base for pricing, objections, and support policies if asked.`;

  const { data: agent } = await supabase
    .from("agents")
    .select("persona_config")
    .eq("id", agentId)
    .single();

  const currentConfig = agent?.persona_config || {};

  await supabase
    .from("agents")
    .update({
      system_prompt: basePrompt,
      voice_id: "pNInz6obpgDQGcFmaJcg", // Adam (Deep, Authoritative)
      persona_config: {
        ...currentConfig,
        archetypeId: "commander",
        interruption_sensitivity: "60",
        response_speed: "75",
        custom_greeting: "Thanks for calling Knight Shift Agents. This is Arthur, how can I help you today?"
      }
    })
    .eq("id", agentId);

  console.log("Arthur configured successfully.");
}

run();
