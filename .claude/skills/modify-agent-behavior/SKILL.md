---
name: modify-agent-behavior
description: Where the AI agent's behavior lives in this repo — prompt pipeline, persona/archetypes, tool registry and tier/role gating, conversation state, and post-call analysis. Use when changing how the voice/SMS agent talks, what tools it can call, or how calls are analyzed.
---

# Modify agent behavior

The agent is data-driven (not hardcoded). Touch the smallest layer that fits:

- **Business context** (cached): `src/lib/agent/context.ts`
- **Identity resolution** (phone → AgentConfig): `src/lib/agent/resolver.ts`
- **Prompt composition** (5-tier: Persona + DB + State + RAG + Tools): `src/lib/agent/prompt-pipeline.ts`
- **Persona / archetypes**: `src/lib/agent/persona.ts`, `archetypes.ts`
- **Conversation state** (phase + mood): `src/lib/agent/conversation-state.ts`
- **Speech enrichment** (post-processing): `src/lib/agent/speech-patterns.ts`
- **Tools**: schemas + gating in `src/lib/agent/tool-registry.ts`; execution in `src/lib/agent/tools.ts`. Access is **additive** — tier gates (`TIER_FEATURES`) OR purchased-role grants (`roles.ts` `ROLE_TOOL_GRANTS`). Generate a new tool with `node scripts/generate-tool.mjs`.
- **Roles → behavior**: `src/lib/agent/roles.ts` maps purchased `AGENT_ROLES` (from `src/lib/stripe.ts`) to prompt blurbs + tool grants; folded in by `onboarding/complete/route.ts`.
- **Post-call analysis / lead scoring**: `src/lib/agent/analysis.ts`. **Marketing (MCA)**: `src/lib/agent/mca.ts`.
- **Constants** (UUIDs, thresholds, token budgets, tier gates): `src/lib/agent/constants.ts`.

**Webhook timing gotcha:** production `end-call` work (QA, scoring, summarize, billing) goes in `after()` / cron for an immediate 200; **test calls** (from a verified `test_phone_numbers` entry) run QA synchronously so the dashboard has metrics instantly.

Verify a prompt change with `npx tsx scripts/debug-prompt.ts` (and the orchestrator config test) before shipping.
