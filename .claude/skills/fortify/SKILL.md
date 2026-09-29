---
name: fortify
description: Run the Crucible over the current changes and apply its worthwhile suggestions.
disable-model-invocation: true
---

Run the Crucible and act on it:

1. Run `npx tsx scripts/crucible-fortify.ts` (add a file path to target one file). It analyzes the working diff against CONTEXT.md + AGENTS.md and writes `enrichment_suggestions.md` + `enrichment_suggestions.json`.
2. Read `enrichment_suggestions.md`. Apply the suggestions that genuinely improve token efficiency, cross-file performance, or cleanliness. Skip anything already covered by `audit-security.sh` / `audit-health.sh` / `/code-review`, and skip over-engineering.
3. If `enrichment_suggestions.json` lists `proposedRules`, evaluate each. The Crucible does NOT edit AGENTS.md — if a rule is clearly worth keeping, add it to AGENTS.md yourself (concise, human-curated); otherwise note why you skipped it.
4. Summarize what you applied and what you deliberately skipped.
