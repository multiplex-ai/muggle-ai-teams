# Workflow Overhaul Plan

**Date:** 2026-03-21
**Status:** Feedback round 2 applied

---

## Issue List (18 actionable items)

| # | Issue | Source |
|---|-------|--------|
| 1 | Audit all files saving to external locations (`docs/superpowers/`, `skills/learned/`). Rewrite to save in `MuggleAI-Teams/plans/` or project folders with kebab naming. | User #1 |
| 2 | SkillsMP search #1 (Step 1A): purpose is diagnosis — if we lack skills for user's need, search and install. | User #2a |
| 3 | SkillsMP search #2 (before panel review): search for skills to equip panelists. | User #2b |
| 4 | SkillsMP constraint: 5K+ stars only (with user override). | User #2c |
| 5 | SkillsMP constraint: security scan before install (malicious, corrupt, hijacking). | User #2d |
| 6 | Remove "Visual design — don't invoke yet" from 1C, put where it belongs (1F). | User #3 |
| 7 | Remove redundant brainstorming warning from 1C. Just specify the right skill. | User #4 |
| 8 | Step 1D: skill search + equip existing agents or create new agents for panel. | User #5 |
| 9 | Remove hardcoded project names. Make generic, handle same-repo frontend+backend. | User #6 |
| 10 | Fresh project bootstrap: detect tech stack, create project config, adapt routing. | User #8 |
| 11 | Mock data option: if user wants frontend-first with mocks, offer it. Orchestrator generates from contract. | User #7 |
| 12 | Merge Steps 2+3 into 1F. Renumber remaining steps (14 → 12 files). | User #9 |
| 13 | Platform agnosticism: detect VCS/hosting, adapt commands, support non-git. | User #10 |
| 14 | Eliminate `skills/learned/`. Route ALL learnings to rules/agents/CLAUDE.md where they're actively loaded. | User #11 |
| 15 | Compliance enforcement: per-step completion criteria + transition gate. | User #12 |
| 16 | Running checklist: use task system to track progress through steps. | User #13 |
| 17 | Add MuggleAI-Teams.md command file to repo (currently only in ~/.claude/commands/). | My finding |
| 19 | Step 1E compression has no concrete instructions. Add procedure. | My finding |

---

## Evaluation Summary

### #1 — External file locations
**Valid.** Offenders found:
- `step-1a-research.md` → `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`
- `step-1e-approval.md` → `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`
- `commands/learn.md` → `~/.claude/skills/learned/`
- `commands/learn-eval.md` → `~/.claude/skills/learned/`
- `commands/update-codemaps.md` → `docs/CODEMAPS/`, `.reports/codemaps/`
- `agents/doc-updater.md` → `docs/CODEMAPS/*`
- `skills/continuous-learning/SKILL.md` → `~/.claude/skills/learned/`
- `skills/continuous-learning-v2/SKILL.md` → `~/.claude/skills/learned/`
- `README.md` → `skills/learned/`
- `step-8-learn.md` → `skills/learned/`

**Corrected per user feedback:**
- Plans are project-related → `MuggleAI-Teams/projects/<project-name>/plans/<feature-name>.md`
- Codemaps are project-related → `MuggleAI-Teams/projects/<project-name>/codemaps/<module-name>/` (kebab naming)
- `skills/learned/` eliminated entirely by #14

### #2 — SkillsMP search #1 purpose
**Valid.** Current wording is vague. Real purpose: after understanding user's request, diagnose whether existing skills cover it. If not, search for what's missing.

### #3 — SkillsMP search #2 before panel review
**Valid.** Panelists are subagents — equipping them with relevant skills makes findings more specific.

### #4 — 5K+ stars constraint
**Valid with nuance.** SkillsMP is relatively new. Default 5K+, but allow user override for lower-star skills that look relevant.

### #5 — Security scan before install
**Valid.** Three checks: (a) malicious content, (b) corruption, (c) workflow hijacking.

### #6 — Remove visual design note from 1C
**Valid.** "Don't do X" is noise. Move to Step 1F where visual design actually happens (after panel review has finalized the design, before implementation slices are defined). In 1F, visual mockups inform the frontend slice definitions.

### #7 — Remove brainstorming warning
**Valid.** Right skill is already specified. Warning about wrong skill is defensive noise.

### #8 — Skill search + dynamic agent creation for 1D
**Valid and ambitious.** This procedure is long enough to warrant its own sub-step file: `step-1d1-panel-equip.md`. Step 1D becomes two files:
- `step-1d1-panel-equip.md` — Skill search, equip existing agents, create new agents
- `step-1d2-panel-review.md` — The actual panel dispatch and review (current step-1d content)

**Detailed procedure for step-1d1-panel-equip.md:**

**1. Analyze expertise gaps.** After the orchestrator selects panelists from the existing roster (Architecture Expert, Security Reviewer, etc.), it asks: "What expertise does this design need that our existing panelists don't cover?" For example, a Stripe integration might need payment-security expertise that the generic Security Reviewer lacks.

**2. Search SkillsMP for panelist skills.** Using the shared search procedure (5K+ stars, security scan), search for skills matching the identified gaps. Example queries: "payment security stripe", "real-time websocket architecture", "HIPAA compliance healthcare".

**3. Equip or create.**
- **If an existing panelist covers the domain** (e.g., Security Reviewer for payment security): equip them by including the found skill's content in the panelist subagent's prompt alongside their base instructions. The panelist now has domain-specific knowledge.
- **If no existing panelist covers the domain** (e.g., no one covers payment compliance): create a temporary panelist agent. The agent definition follows a standard template:
  - Name: derived from the skill (e.g., "Payment Compliance Reviewer")
  - Base prompt: standard panelist instructions (MUST ADDRESS / SHOULD ADDRESS / CONSIDER format)
  - Domain knowledge: the found skill's content
  - Focus: extracted from the skill description
- **Temporary by default**: created agents exist only for this workflow run. After the panel completes, ask user: "Payment Compliance Reviewer was created for this review. Keep it for future runs?" If yes → save to `MuggleAI-Teams/agents/`. If no → discard.

**4. Present augmented panel to user.** Before dispatching, show the full panel including any skill-equipped or newly created panelists. User confirms or adjusts.

**Guardrails:**
- Maximum 3 dynamically created agents per panel (prevent bloat)
- Each created agent must have a clear, non-overlapping focus with existing panelists
- Skills are read-only in the panelist prompt — the panelist uses them as knowledge, not as executable procedures
- If SkillsMP search returns no relevant skills above 5K stars, skip this step (don't force it)

### #9 — Remove hardcoded project names
**Valid and critical for open source.** Replace with project-config-driven routing. Handle monorepo, polyrepo, and single-repo. **If user has no idea how to structure their project or which agent handles what, the orchestrator should provide a best recommendation** based on the detected tech stack and project structure — not just ask and wait.

### #10 — Fresh project bootstrap
**Valid.** Detect tech stack, detect structure, ask user to confirm, create project config.

### #11 — Mock data option
**Valid.** Add to parallel/sequential checklist. Orchestrator generates mocks from contract artifact. No special skill needed.

### #12 — Merge Steps 2+3 into 1F
**Valid.** Routing and parallelism are decisions made during planning. Renumber: 4→2, 5→3, 6→4, 7→5, 8→6.

### #13 — Platform agnosticism
**Valid.** Detect VCS/hosting in project config. Adapt commands per platform. Support no-VCS case.

### #14 — Eliminate `skills/learned/`
**Valid.** Route all learnings to where they're actively loaded:
- Debugging/fixing → `rules/behavior.md`
- Code quality → `rules/core.md` or `rules/coding.md`
- Testing → `rules/testing.md` or `rules/quality-gates.md`
- Agent-specific → agent definition file
- Project-specific → project CLAUDE.md

### #15 — Compliance enforcement
**Valid.** Add "Completion Criteria" section to each step file. Orchestrator must verify all criteria met before proceeding.

### #16 — Running checklist
**Valid.** Use task system at workflow start. Create task per step, update status as workflow progresses.

### #17 — Command file missing from repo
**Valid.** Simple copy.

### #19 — Step 1E compression lacks instructions
**Valid.** Add: remove raw research/panelist reports, keep only final synthesized sections. Plan document must be self-contained for a fresh agent.

---

## Concrete Plan

### Phase A: Structural changes (do first, affects everything)

| Task | What | Files |
|------|------|-------|
| A1 | Merge Steps 2+3 into Step 1F as sub-sections. Delete `step-2-routing.md` and `step-3-parallel.md`. Renumber: step-4→step-2, step-5→step-3, step-6→step-4, step-7→step-5, step-8→step-6. Update all "Next →" footers. Update command file step table. | `step-1f-plan.md`, delete `step-2-routing.md`, delete `step-3-parallel.md`, rename step-4 through step-8, update all footers, update `MuggleAI-Teams.md` |
| A2 | Add command file to repo | Copy `~/.claude/commands/MuggleAI-Teams.md` → `commands/MuggleAI-Teams.md` |
| A3 | Change plan output path from `docs/superpowers/plans/` to `MuggleAI-Teams/projects/<project-name>/plans/<feature-name>.md` (project-scoped, kebab naming) | `step-1a-research.md`, `step-1e-approval.md` |
| A4 | Change codemaps/reports path from `docs/CODEMAPS/` to `MuggleAI-Teams/projects/<project-name>/codemaps/<module-name>/` (project-scoped, kebab naming) | `commands/update-codemaps.md`, `agents/doc-updater.md` |

### Phase B: Make generic (remove MuggleTest-specific content)

| Task | What | Files |
|------|------|-------|
| B1 | Replace hardcoded routing table with project-config-driven routing | `step-1f-plan.md` (new routing sub-section), `rules/agents-routing.md`, `MuggleAI-Teams.md` command |
| B2 | Add fresh project bootstrap procedure. **If user has no idea, orchestrator provides best recommendation** based on detected tech stack and structure — not just ask and wait. | New section in `step-1a-research.md`: detect tech stack, detect structure, recommend config, create project config |
| B3 | Handle frontend+backend in same repo | Update routing logic for monorepo, polyrepo, single-repo |
| B4 | Platform agnosticism — detect VCS/hosting, adapt commands | `step-2` (was step-4), `step-4` (was step-6), `step-5` (was step-7) |

### Phase C: SkillsMP as first-class feature

| Task | What | Files |
|------|------|-------|
| C1 | Rewrite SkillsMP search #1 in Step 1A — diagnosis-driven with 5K+/security constraints | `step-1a-research.md` |
| C2 | Create new sub-step `step-1d1-panel-equip.md` — SkillsMP search for panelists, equip existing agents, create new agents. Current `step-1d` becomes `step-1d2-panel-review.md`. | New `step-1d1-panel-equip.md`, rename `step-1d-panel-review.md` → `step-1d2-panel-review.md` |
| C3 | Write shared SkillsMP search procedure: 5K+ filter (user override), 3-point security scan, install procedure | New file `workflow/procedure-skillsmp-search.md` (referenced by both 1A and 1D1) |
| C4 | Dynamic agent creation logic inside `step-1d1-panel-equip.md` — template, guardrails, temporary-by-default, user keep/discard prompt | `step-1d1-panel-equip.md` |

### Phase D: Step content fixes

| Task | What | Files |
|------|------|-------|
| D1 | Remove "Visual design — don't invoke yet" from 1C, add to Step 1F | `step-1c-design.md`, `step-1f-plan.md` |
| D2 | Remove brainstorming warning/routing table from 1C, keep just "Invoke `workflow-aware-brainstorming`" | `step-1c-design.md` |
| D3 | Add mock data option to parallel/sequential checklist in 1F | `step-1f-plan.md` |
| D4 | Add concrete compression instructions to 1E | `step-1e-approval.md` |

### Phase E: Learning system + compliance

| Task | What | Files |
|------|------|-------|
| E1 | Eliminate `skills/learned/`, route all learnings to rules/agents/CLAUDE.md | step-6 (was step-8), `commands/learn-eval.md`, `commands/learn.md`, `README.md` |
| E2 | Add completion criteria to every step file (before "Next →") | All step files |
| E3 | Add step transition gate rule — orchestrator must verify criteria before proceeding | `rules/behavior.md` or new `rules/workflow-compliance.md` |
| E4 | Add running checklist procedure — create tasks at workflow start, update per step | `MuggleAI-Teams.md` command file |

### Execution order

```
Phase A (structural) → Phase B (generic) → Phase C (SkillsMP) → Phase D (content) → Phase E (learning+compliance)
```

A first (renumbers everything). B before C (SkillsMP references step numbers). D and E can be parallel.

**Total: 18 tasks across 5 phases.**

---

## New step structure after Phase A

```
MuggleAI-Teams.md (command entry point)
  ↓
step-1a-research.md      Research & Context + Project Bootstrap
step-1b-requirements.md   Requirements & Impact
step-1c-design.md         Design Proposal
step-1d1-panel-equip.md   Skill Search + Equip/Create Panelists (new)
step-1d2-panel-review.md  Panel Review (dispatch + synthesize)
step-1e-approval.md       User Approval + Compression
step-1f-plan.md           Implementation Plan (includes routing, parallel/seq, mocks, visual design)
step-2-execute.md         Execute Per Slice (was step-4)
step-3-verify.md          Verify Before Completing (was step-5)
step-4-review.md          Review Per PR (was step-6)
step-5-push.md            Push & Finish (was step-7)
step-6-learn.md           Learn & Graduate (was step-8)
reference.md              Error recovery + quick reference
```

13 step files + 1 shared procedure (was 14). Steps 2+3 merged into 1F. Step 1D split into 1D1 (equip) + 1D2 (review).

---

## Feedback Log

### Round 2 (2026-03-21)

| # | User correction | Applied to |
|---|----------------|------------|
| 1a | Plans are project-related → `MuggleAI-Teams/projects/<project-name>/plans/` not `MuggleAI-Teams/plans/` | #1 evaluation, A3 task |
| 1b | Codemaps are project-related → `MuggleAI-Teams/projects/<project-name>/codemaps/` with kebab naming | #1 evaluation, A4 task |
| 6 | Visual design goes in Step 1F (confirmed destination) | #6 evaluation |
| 8 | Elaborate on dynamic agent creation — added full 4-step procedure with guardrails | #8 evaluation |
| 9 | If user has no idea, orchestrator provides best recommendation — don't just ask and wait | #9 evaluation, B2 task |

### Round 3 (2026-03-21)

| # | User correction | Applied to |
|---|----------------|------------|
| 8 | Panel equip procedure is too long for step-1d — make it a separate sub-step file `step-1d1-panel-equip.md` | #8 evaluation, C2/C4 tasks, step structure |
