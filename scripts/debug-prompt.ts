 
import { resolveAgent } from '../src/lib/agent/resolver';
import { buildPrompt } from '../src/lib/agent/prompt-pipeline';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const agentPhone = process.argv[2];
  const callerPhone = process.argv[3] || '+15555555555';

  if (!agentPhone) {
    console.error('Usage: npx tsx scripts/debug-prompt.ts <agentPhone> [callerPhone]');
    process.exit(1);
  }

  console.log(`[Debug] Resolving agent for phone: ${agentPhone}`);
  try {
    const config = await resolveAgent(agentPhone, callerPhone);
    console.log(`[Debug] Resolved Agent:`, {
      agentId: config.agentId,
      tenantId: config.tenantId,
      personaId: config.persona?.id,
    });

    console.log(`\n[Debug] Building prompt...`);
    const composed = await buildPrompt(config, [], '', 'voice', callerPhone);
    
    console.log(`\n=== COMPOSED SYSTEM PROMPT ===`);
    console.log(composed.systemPrompt);
    console.log(`==============================\n`);
    console.log(`[Debug] Token Estimate: ${composed.tokenEstimate}`);
    console.log(`[Debug] Tools Included: ${composed.toolSchemas.length}`);
  } catch (err) {
    console.error('[Debug] Error:', err);
  }
}

main();
