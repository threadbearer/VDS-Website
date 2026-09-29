 
/**
 * ==========================================================================
 * THE CRUCIBLE METHOD: Automated Foundation Fortification & Enrichment
 * ==========================================================================
 * Analyzes recent changes (`git diff`) and surfaces opportunities to improve
 * token efficiency, performance integrity, and code cleanliness — through a
 * project-context-aware lens (CONTEXT.md + AGENTS.md) that static linters miss.
 *
 * DESIGN NOTES (2026-07-21 fortification):
 *  - PROPOSE-ONLY: the Crucible NEVER writes to AGENTS.md. Any new-rule ideas
 *    are surfaced in the report + `enrichment_suggestions.json` for a human to
 *    curate. Keeps the shared constitution lean and human-owned.
 *  - DUAL-MODEL: loads BOTH CONTEXT.md and AGENTS.md so this Gemini pass is
 *    governed by the same ruleset Claude follows — one constitution, two engines.
 *  - COMPLEMENT, DON'T DUPLICATE: deep security/RLS and architecture drift are
 *    owned by scripts/audit-security.sh, scripts/audit-health.sh, and the
 *    security-auditor / architecture-reviewer subagents. The Crucible only
 *    flags HIGH-CONFIDENCE issues there and focuses on its unique lens:
 *    token/context efficiency, cross-file inefficiencies, and dead-code/junk.
 *
 * Usage:
 *   npx tsx scripts/crucible-fortify.ts [optional/path/to/file.ts]
 */

import { execSync } from 'child_process';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load local env so `npx tsx scripts/crucible-fortify.ts` / `/fortify` works
// outside CI without exporting the key by hand (mirrors scripts/tests/smoke-tests.ts).
dotenv.config({ path: '.env.local' });

// Total character budget for the diff payload sent to the model. Kept generous
// but bounded so we never blow the context window. Override with CRUCIBLE_DIFF_BUDGET.
const TOTAL_DIFF_BUDGET = Number(process.env.CRUCIBLE_DIFF_BUDGET) || 60000;
// Per-file cap so one huge file can't crowd out every other change.
const PER_FILE_BUDGET = 12000;
// Pathspecs excluded from analysis (generated / noisy / non-source).
const EXCLUDES = [":!*.lock", ":!*.json", ":!*.svg", ":!package-lock.json"];

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('[Crucible] Error: GEMINI_API_KEY environment variable is missing.');
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey });

/** Run a git command, returning stdout (empty string on failure). */
function git(args: string): string {
  try {
    return execSync(`git ${args}`, { encoding: 'utf-8' });
  } catch {
    return '';
  }
}

/** List changed files for a diff range, honoring the exclude pathspecs. */
function changedFiles(range: string): string[] {
  const spec = EXCLUDES.map((e) => `'${e}'`).join(' ');
  return git(`diff ${range} --name-only -- ${spec}`)
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);
}

/**
 * Build a structured diff payload: a `--stat` overview followed by per-file
 * hunks, each capped at PER_FILE_BUDGET and the whole thing at TOTAL_DIFF_BUDGET.
 * Replaces the old blind `.substring(0, 15000)` that could cut mid-hunk.
 */
function buildDiffPayload(range: string): string {
  const files = changedFiles(range);
  if (files.length === 0) return '';

  const spec = EXCLUDES.map((e) => `'${e}'`).join(' ');
  const overview = git(`diff ${range} --stat -- ${spec}`).trim();

  let payload = `## Change Overview (${range})\n${overview}\n\n## Per-file diffs\n`;
  let used = payload.length;
  const skipped: string[] = [];

  for (const file of files) {
    let hunk = git(`diff ${range} -- '${file}'`);
    if (!hunk.trim()) continue;

    if (hunk.length > PER_FILE_BUDGET) {
      hunk = hunk.slice(0, PER_FILE_BUDGET) + `\n...[${file} diff truncated at ${PER_FILE_BUDGET} chars]`;
    }
    if (used + hunk.length > TOTAL_DIFF_BUDGET) {
      skipped.push(file);
      continue;
    }
    payload += `\n${hunk}\n`;
    used += hunk.length;
  }

  if (skipped.length) {
    payload += `\n\n[Budget reached — ${skipped.length} file(s) omitted from detail: ${skipped.join(', ')}]`;
  }
  return payload;
}

function readIfExists(p: string): string {
  const full = path.join(process.cwd(), p);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf-8') : '';
}

async function runCrucible() {
  console.log('🔥 Initializing The Crucible Method...');

  try {
    // 1. Assemble the code to analyze (a specific file, or the working/last-commit diff).
    let diff = '';
    const targetFile = process.argv[2];

    if (targetFile) {
      console.log(`Analyzing specific target: ${targetFile}`);
      try {
        const fileContent = fs.readFileSync(path.resolve(process.cwd(), targetFile), 'utf-8');
        const capped =
          fileContent.length > PER_FILE_BUDGET
            ? fileContent.slice(0, PER_FILE_BUDGET) + `\n...[truncated at ${PER_FILE_BUDGET} chars]`
            : fileContent;
        diff = `File: ${targetFile}\n\n${capped}`;
      } catch (e) {
        console.error(`Error reading target file ${targetFile}:`, e);
        process.exit(1);
      }
    } else {
      diff = buildDiffPayload('HEAD');
      if (!diff) {
        console.log('No uncommitted changes. Analyzing last commit...');
        diff = buildDiffPayload('HEAD~1 HEAD');
      }
      if (!diff) {
        console.log('No recent changes found. System is stable.');
        return;
      }
    }

    // 2. Load BOTH the architecture index and the shared constitution so this
    //    Gemini pass is governed by the same rules Claude follows.
    const contextMd = readIfExists('CONTEXT.md');
    const agentsMd = readIfExists('AGENTS.md');

    // 3. Ask Gemini to analyze the changes through the Crucible's unique lens.
    const prompt = `You are the core intelligence of "The Crucible Method" for Knight Shift Agents.
Your job is to fortify the codebase. Review the code changes below against the project's
architecture index and its shared engineering constitution.

=== ARCHITECTURE INDEX (CONTEXT.md) ===
${contextMd}

=== SHARED CONSTITUTION (AGENTS.md) — the SAME rules the Claude coding agent follows ===
${agentsMd}

=== CHANGES TO ANALYZE ===
${diff}

SCOPE — stay in your lane. Deep security/RLS auditing is owned by
scripts/audit-security.sh + the security-auditor subagent; architecture-drift and
Supabase-client misuse are owned by scripts/audit-health.sh + the architecture-reviewer
subagent; correctness bugs are owned by Claude's /code-review. Do NOT duplicate those —
only mention a security/architecture item if it is HIGH-CONFIDENCE and likely missed by
the deterministic scanners. Spend your effort on the Crucible's UNIQUE lens:

1. **Junk / Dead Code**: console.logs, unused imports, orphaned files, stray debug/test scripts.
2. **Token & Context Efficiency**: prompt/payload bloat; oversized inline Tailwind strings that
   should become semantic classes in globals.css; raw <svg> that should import from
   src/components/icons.tsx; anything that needlessly enlarges an agent's context window.
3. **Cross-file Inefficiency**: select("*") over-fetching (name explicit columns), sequential
   await waterfalls that should be Promise.all, N+1 queries, and missing TTL/caching layers.
4. **Build Hygiene**: raw \`npm run build\` in scripts/agents instead of \`./scripts/build-check.sh\`.
5. **High-confidence security/architecture** ONLY if likely missed by the scanners above.

Produce a structured Markdown report titled "🔥 The Crucible: Enrichment Suggestions" with
actionable steps grouped by the categories above.

PROPOSE-ONLY RULE SUGGESTIONS: If you spot a systemic anti-pattern NOT already covered by
AGENTS.md that would be worth adding, describe it under a final "## Proposed Rules (human
review required)" section. You do NOT edit AGENTS.md — a human curates these.

**CRITICAL OUTPUT CONTRACT**: End your response with a single fenced JSON block of the form
\`\`\`json ... \`\`\` containing a \`proposedRules\` array of strings. Example:
\`\`\`json
{ "proposedRules": ["Rule: [Title] — [one-line description of the new efficiency rule]"] }
\`\`\`
If nothing is worth proposing, return \`{ "proposedRules": [] }\`.`;

    console.log('🧠 Analyzing changes with Gemini...');
    const analysisRes = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { temperature: 0.2, maxOutputTokens: 8192 },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    let report = analysisRes.text || 'No insights generated.';

    // 4. Parse proposed rules — but NEVER write them into AGENTS.md. Propose-only:
    //    surface to the human via the report + a machine-readable sidecar.
    let proposedRules: string[] = [];
    const jsonMatch = report.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed.proposedRules)) {
          proposedRules = parsed.proposedRules.filter((r: unknown) => typeof r === 'string');
        }
      } catch {
        console.warn('Could not parse the proposedRules JSON block (non-fatal).');
      }
      // Strip the machine block out of the human-facing markdown.
      report = report.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
    }

    if (proposedRules.length) {
      console.log(`\n💡 The Crucible proposed ${proposedRules.length} rule(s) for HUMAN REVIEW:`);
      for (const r of proposedRules) console.log(`  -> ${r}`);
      console.log('   (Not written to AGENTS.md — curate manually if you agree.)');
    }

    // 5. Write the human report + machine sidecar.
    const reportPath = path.join(process.cwd(), 'enrichment_suggestions.md');
    fs.writeFileSync(reportPath, report + '\n');

    const sidecar = {
      generatedAt: new Date().toISOString(),
      engine: 'gemini-2.5-flash',
      proposedRules,
      note: 'Proposed rules are advisory. A human curates approved rules into AGENTS.md.',
    };
    fs.writeFileSync(
      path.join(process.cwd(), 'enrichment_suggestions.json'),
      JSON.stringify(sidecar, null, 2) + '\n'
    );

    console.log(`\n✅ Fortification complete!`);
    console.log(`   Report:  enrichment_suggestions.md`);
    console.log(`   Sidecar: enrichment_suggestions.json (${proposedRules.length} proposed rule(s))`);
    console.log('Review the report before continuing development.');
  } catch (error) {
    console.error('🔥 Crucible analysis failed:', error);
  }
}

runCrucible();
