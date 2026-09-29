 
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const TOOL_REGISTRY_PATH = path.join(__dirname, '../src/lib/agent/tool-registry.ts');
const TOOLS_PATH = path.join(__dirname, '../src/lib/agent/tools.ts');

async function prompt(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function run() {
  console.log('🛡️ Crucible Tool Generator 🛡️\n');
  
  const name = await prompt('Tool Name (e.g., verifyTicket): ');
  if (!name.trim()) {
    console.error('Tool name is required.');
    process.exit(1);
  }

  const description = await prompt('Tool Description: ');

  console.log(`\nScaffolding tool '${name}'...`);

  // 1. Update tool-registry.ts
  try {
    let registryContent = fs.readFileSync(TOOL_REGISTRY_PATH, 'utf-8');
    const newSchema = `
  {
    name: '${name}',
    description: '${description.replace(/'/g, "\\'")}',
    parameters: {
      type: 'OBJECT',
      properties: {
        phone: {
          type: 'STRING',
          description: 'The phone number of the customer calling.'
        }
      },
      required: ['phone']
    }
  },`;
    
    // Inject right after the start of ALL_TOOLS array
    registryContent = registryContent.replace(
      'const ALL_TOOLS: ToolSchema[] = [', 
      `const ALL_TOOLS: ToolSchema[] = [${newSchema}`
    );
    fs.writeFileSync(TOOL_REGISTRY_PATH, registryContent);
  } catch (err) {
    console.error('Failed to update tool-registry.ts:', err);
  }

  // 2. Update tools.ts
  try {
    let toolsContent = fs.readFileSync(TOOLS_PATH, 'utf-8');
    const newExecutor = `
    case '${name}': {
      // TODO: Implement ${name} logic here
      // const tenant = await getTenantFromPhone(args.phone as string);
      return { success: true, message: '${name} executed successfully' };
    }`;
    
    // Inject right before the default case in the switch statement
    toolsContent = toolsContent.replace(
      'default:', 
      `${newExecutor}\n    default:`
    );
    fs.writeFileSync(TOOLS_PATH, toolsContent);
  } catch (err) {
    console.error('Failed to update tools.ts:', err);
  }

  console.log(`\n✅ Successfully scaffolded '${name}'!`);
  console.log(`- Schema added to: src/lib/agent/tool-registry.ts`);
  console.log(`- Executor stub added to: src/lib/agent/tools.ts\n`);
  
  rl.close();
}

run();
