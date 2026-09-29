/**
 * A4 Synthetic-Caller Exam Harness
 * Simulates calls against the local agent to detect regressions.
 */
import fs from 'fs';
import path from 'path';
import { randomUUID } from "crypto";
import { getGeminiClient } from "../../src/lib/gemini";
import { resolveAgent } from "../../src/lib/agent/resolver";
import { processInboundMessage } from "../../src/lib/agent/cra";
import { runVoiceQAAnalysis } from "../../src/lib/agent/analysis";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("Starting Synthetic-Caller Exam Harness...");

const scenariosDir = path.join(__dirname, 'scenarios');
const files = fs.readdirSync(scenariosDir).filter(f => f.endsWith('.json'));

let passed = 0;
let failed = 0;

async function runExam() {
  const ai = getGeminiClient();
  const agentPhone = process.env.SIM_AGENT_PHONE || "+16614492210";
  const agentConfig = await resolveAgent(agentPhone);
  
  if (!agentConfig) {
    console.error("❌ Failed to resolve test agent for phone:", agentPhone);
    process.exit(1);
  }

  for (const file of files) {
    const scenario = JSON.parse(fs.readFileSync(path.join(scenariosDir, file), 'utf-8'));
    console.log(`\n[TEST] Running Scenario ${scenario.id}: ${scenario.trade} - ${scenario.type}`);
    
    const callerPhone = `+1555${Math.floor(1000000 + Math.random() * 9000000)}`;
    const conversationId = randomUUID();
    let transcript = "";
    let lastAgentReply = "Agent answered the phone.";

    const systemInstruction = `You are a simulated caller testing an AI answering service.
Persona: ${scenario.persona}
Goal: Follow these beats strictly:
${scenario.scriptBeats.map((b: string) => "- " + b).join("\n")}
Keep your responses short, conversational, and exactly like a phone call.
If the agent resolves the issue, hits a dead end, or if 6 turns have passed, output exactly [HANGUP].`;

    const chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    let turnCount = 0;
    let hangup = false;

    while (turnCount < 8 && !hangup) {
      turnCount++;
      const res = await chatSession.sendMessage({ message: lastAgentReply });
      const callerMsg = res.text?.trim() || "";
      if (callerMsg.includes("[HANGUP]")) {
        hangup = true;
        break;
      }

      transcript += `Customer: ${callerMsg}\n`;
      console.log(`  Customer: ${callerMsg}`);

      const agentRes = await processInboundMessage(
        agentConfig,
        "chat", // Simulate text channel
        callerPhone,
        callerMsg,
        conversationId
      );
      
      lastAgentReply = agentRes.response;
      transcript += `Agent: ${lastAgentReply}\n`;
      console.log(`  Agent: ${lastAgentReply}`);
    }

    const qa = await runVoiceQAAnalysis(transcript, `[Scenario ${scenario.id}]`);
    const compositeScore = (qa.composite_score as number) || 0;

    if (compositeScore < 7.0) {
      console.error(`❌ FAILED: ${scenario.id} (Score: ${compositeScore}/10)`);
      console.error(`   Feedback: ${qa.feedback}`);
      failed++;
    } else {
      console.log(`✅ PASSED: ${scenario.id} (Score: ${compositeScore}/10)`);
      passed++;
    }
  }

  console.log(`\nExam Completed: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runExam().catch(console.error);
