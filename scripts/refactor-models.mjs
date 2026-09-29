import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', 'src');

const filesToUpdate = [
  'app/api/dashboard-assistant/route.ts',
  'app/api/demo/summarize/route.ts',
  'app/api/demo/chat/route.ts',
  'app/api/onboarding/analyze-url/route.ts',
  'app/api/onboarding/extract-document/route.ts',
  'app/api/conversations/[id]/summarize/route.ts',
  'app/api/campaigns/generate-image/route.ts',
  'app/api/agents/[id]/optimizations/[optId]/route.ts',
  'app/api/cron/arthur-reports/route.ts',
  'app/api/cron/qa-critic/route.ts',
  'lib/agent/ad-optimizer.ts',
  'lib/agent/analysis.ts',
  'lib/agent/tools.ts',
  'lib/agent/mca.ts',
  'lib/agent/marketing/content-generator.ts',
  'lib/agent/marketing/campaign-builder.ts'
];

for (const relPath of filesToUpdate) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${relPath} - not found`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // Ensure import exists
  if (!content.includes("resolveModel")) {
    // figure out relative path to ai/router
    const dirDepth = relPath.split('/').length - 1;
    let prefix = '../'.repeat(dirDepth);
    // For lib/agent/tools.ts: depth 2 (lib, agent) -> ../../
    // wait, we are in src/. ai/router is at src/lib/ai/router
    // So relative from src/lib/agent/tools.ts -> ../ai/router
    // relative from src/app/api/demo/chat/route.ts -> ../../../../lib/ai/router
    const srcToLib = 'lib/ai/router';
    let importPath = '';
    if (relPath.startsWith('lib/')) {
       // if lib/agent/mca.ts -> ../ai/router
       const parts = relPath.split('/');
       if (parts.length === 3) importPath = '../ai/router';
       else if (parts.length === 4) importPath = '../../ai/router';
       else importPath = '@/lib/ai/router'; // fallback to absolute alias
    } else {
       importPath = '@/lib/ai/router';
    }

    // fallback to absolute alias everywhere for simplicity
    importPath = '@/lib/ai/router';
    
    // add import after the last import statement
    const importRegex = /import .*? from .*?;/g;
    let lastIndex = 0;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex > 0) {
      content = content.slice(0, lastIndex) + `\nimport { resolveModel } from '${importPath}';` + content.slice(lastIndex);
      changed = true;
    } else {
      content = `import { resolveModel } from '${importPath}';\n` + content;
      changed = true;
    }
  }

  // Determine complexity
  let complexity = "'speed'";
  if (
    relPath.includes('summarize') || 
    relPath.includes('analyze') || 
    relPath.includes('extract') || 
    relPath.includes('analysis') || 
    relPath.includes('qa-critic') ||
    relPath.includes('reports') ||
    relPath.includes('optimizations') ||
    relPath.includes('campaign-builder') ||
    relPath.includes('content-generator') ||
    relPath.includes('ad-optimizer')
  ) {
    complexity = "'reasoning'";
  }

  // Replace hardcoded models
  const modelRegex = /model:\s*['"`]gemini-.*?['"`],?/g;
  if (modelRegex.test(content)) {
    content = content.replace(modelRegex, `model: resolveModel(${complexity}),`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${relPath} to use resolveModel(${complexity})`);
  }
}
