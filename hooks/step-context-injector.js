#!/usr/bin/env node
/**
 * Step Context Injector Hook
 *
 * Fires on PostToolUse when a step-*.md file is read.
 * Automatically injects relevant rules and reference content
 * so the AI never needs to "decide" to read them.
 *
 * Outputs key points to stdout (returned to Claude's context).
 */

const fs = require('fs');
const path = require('path');
const { readStdinJson, output, log } = require('./lib/utils');

// Step → key points to inject (concise, not full files)
const STEP_INJECTIONS = {
  'step-1a': {
    label: 'Step 1A: Research',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Research completeness**: Do NOT skip items in the research checklist. Check each off as done.',
      '**Skill search is REQUIRED**: Search local skills + SkillsMP. Assign found skills to agents, not orchestrator.',
      '**Batch cap**: Max 5 research actions per batch.',
      '**Diagnosis rule**: If this is a bug task, orchestrator (Opus) must diagnose root cause before dispatching any engineer.',
      '**Context7**: Fetch docs for unfamiliar libraries — do not rely on training data.',
    ]
  },
  'step-1b': {
    label: 'Step 1B: Requirements',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Ask, don\'t assume**: Get explicit answers from user. One question at a time.',
      '**Proactive needs discovery**: Know MORE than what user asked for. If building a website → ask about SEO/GEO, pricing strategy, analytics. If building an API → ask about auth, rate limiting, versioning. Never ship something the user will regret because we didn\'t ask.',
      '**Impact analysis must be exhaustive**: Every file, service, flow, external system.',
      '**Risk identification**: Data loss, breaking changes, perf regression, security, race conditions.',
    ]
  },
  'step-1c': {
    label: 'Step 1C: Design',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Specialists, not engineers**: Engineers write code in Step 2. Design needs domain experts with skills.',
      '**Skills in dispatch**: Every specialist sub-agent MUST receive equipped skill content in their prompt.',
      '**Orchestrator stays clean**: Do not load full skill text into orchestrator context — sub-agents only.',
      '**1-2 approaches with trade-offs**: Performance, cost, complexity, maintainability, risk.',
    ]
  },
  'step-1d1': {
    label: 'Step 1D1: Panel Equip',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Search before equipping**: Search SkillsMP for domain expertise gaps. Do not skip.',
      '**Max 3 dynamic panelists**: Prevent panel bloat.',
      '**Persist useful panelists**: After review, ask user if temporary panelists should be saved to agent definitions.',
    ]
  },
  'step-1d2': {
    label: 'Step 1D2: Panel Review',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Roster**: Read workflow/ref-panel-roster.md for full panelist list.',
      '**Formats**: Read workflow/procedure-panelist-formats.md for output formats.',
      '**Synthesize by theme, not by panelist**: Eliminates duplication.',
      '**Escalation**: Same finding after 2 fixes → escalate to user (accept/redesign/different approach).',
      '**Panelist evolution**: Track "Keep next time?" — this feeds into Step 6 learning.',
    ]
  },
  'step-1e': {
    label: 'Step 1E: Approval',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Visual mockups**: If frontend changes, generate via frontend-design skill BEFORE presenting.',
      '**Context checkpoint after approval**: Save session, create git checkpoint, compress design phase, /compact.',
      '**Plan document must be self-contained**: A fresh agent reading only this doc should be able to execute Step 1F.',
    ]
  },
  'step-1f': {
    label: 'Step 1F: Plan',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Route via project config**: The scope table is the source of truth, not the generic fallback.',
      '**Cross-scope**: Read workflow/ref-cross-scope-planning.md for parallel/sequential + contracts.',
      '**Skills REQUIRED in dispatch**: Every slice must specify agent + skills. If no skills, state why.',
      '**QA instruction per user-facing slice**: Browser test description for muggle-ai-works.',
      '**Batch planning**: If > 5 slices, group into batches of max 5.',
      '**Multi-phase**: If design has multiple phases, create tracking/phases.md. Step 5 reads this to decide loop-back vs Step 6.',
    ]
  },
  'step-2': {
    label: 'Step 2: Execute',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Gate details**: Read workflow/ref-execution-gates.md for full gate procedures.',
      '**Batch cap**: Max 5 slices per batch. Verify all complete before next batch.',
      '**Skills in dispatch**: Agent prompt MUST include ## Skills section. Read the Skills Found table from the plan document. Multi-skill OK (e.g., /ui-ux-pro-max + /frontend-patterns), but no duplicate/overlapping skills.',
      '**After EVERY slice**: Re-read tracking file. State "Completed N/M. Next: [name]".',
      '**Bug diagnosis**: Orchestrator diagnoses (Opus) → engineer executes fix (Sonnet). Never send vague bugs to engineers.',
      '**TDD**: Write failing test → implement → pass → refactor.',
      '**User confirmation is BLOCKING**: No implicit confirmation. Wait for explicit yes.',
      '**Quality gates**: typecheck + lint + test must ALL pass before commit.',
    ]
  },
  'step-3': {
    label: 'Step 3: Verify',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Standard tier**: Lightweight — git status clean, no secrets, tracking file complete.',
      '**Full tier**: Run ALL quality gates + regression sweep.',
      '**Diagnose before fixing**: Root cause + blast radius. Do not blindly patch gate failures.',
    ]
  },
  'step-4': {
    label: 'Step 4: Review',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**3-pass review**: Quality → Compliance → Contract consistency.',
      '**Do NOT blindly implement**: Verify each finding is technically correct before fixing.',
      '**Batch cap**: Max 5 findings per fix batch.',
      '**MUST FIX items**: Diagnose root cause + blast radius before engineer fixes.',
      '**Escalation**: Same finding after 2 attempts → escalate to user.',
    ]
  },
  'step-5': {
    label: 'Step 5: Push',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '⚠️ **PHASE CHECK (MANDATORY)**: After PR, read tracking/phases.md. If remaining phases exist → loop back to Step 1F, DO NOT go to Step 6. The workflow is NOT complete until ALL phases have PRs.',
      '**Confirm with user before creating PR**: Do not publish automatically.',
      '**PR format**: type(scope): Short description. Body: What, How, Why, Test plan.',
      '**CI failures**: Diagnose before fixing — may indicate issues local gates missed.',
      '**QA publish**: Offer batch publish of QA results to cloud.',
      '**Delivery summary**: Files changed, tests passing/added, commits, cost.',
    ]
  },
  'step-6': {
    label: 'Step 6: Learn',
    points: [
      '## Injected Rules (auto-loaded)',
      '',
      '**Run log REQUIRED**: Read workflow/ref-run-log-template.md. Without data, you can\'t learn.',
      '**4 categories**: Reinforce good, improve bad, absorb user feedback, prevent bug recurrence.',
      '**Scope decision FIRST**: Project-only vs global. When in doubt, project-only.',
      '**Graduate to the right place**: Steps, agents, skills, rules, project configs — not just rules.',
      '**Skill persistence**: Useful skills → agent definitions. Useful panelists → ask user to keep.',
      '**Never save to memory only**: Rules/agents/steps are auto-loaded. Memory requires active recall.',
    ]
  }
};

async function main() {
  const input = await readStdinJson();

  // Get the file path from the tool input
  const filePath = input?.tool_input?.file_path || '';

  // Check if this is a step file read
  const stepMatch = filePath.match(/step-(\d+[a-z]?\d*)/);
  if (!stepMatch) {
    process.exit(0);
  }

  const stepKey = `step-${stepMatch[1]}`;
  const injection = STEP_INJECTIONS[stepKey];

  if (!injection) {
    process.exit(0);
  }

  // Add universal cost tracking reminder for steps 2+
  const costSteps = ['step-2', 'step-3', 'step-4', 'step-5', 'step-6'];
  const costReminder = costSteps.includes(stepKey)
    ? '\n**💰 Cost tracking**: Run /cost to check spent so far. Report to user: "Spent: $X. Estimated remaining: $Y."'
    : '';

  // Output the injection points — these go to stdout and appear in Claude's context
  output(injection.points.join('\n') + costReminder);

  log(`[StepInjector] Injected rules for ${injection.label}`);

  process.exit(0);
}

main().catch(() => process.exit(0));
