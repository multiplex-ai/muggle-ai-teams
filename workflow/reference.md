# /muggle-ai-teams — Reference

Quick reference for error recovery, agent/skill lookup, and maintenance.

---

## Error Recovery

| Situation | Action |
|-----------|--------|
| Quick question during workflow execution | Use `/aside <question>` to get an answer without losing workflow state |
| Long-running workflow | Use `/save-session` periodically to ensure recoverability |
| Quality gates fail repeatedly | Escalate to user (likely architectural issue, not a code fix) |
| Same finding persists after 2 fix attempts | Escalate to user: (A) accept risk, (B) redesign, (C) different approach |
| User issue unreproducible | Ask for screenshots/console errors; invoke `superpowers:systematic-debugging` |
| Parallel file conflict | Orchestrator resolves before committing; prevent by declaring file ownership in planning |
| No progress for 10 minutes | Checkpoint current state and alert user (stuck agent detection) |
| Workflow step completed | Explicitly check off the sub-step (1A→1B→1C→1D1→1D2→1E→1F→2→3→4→5→6). Never assume a step is complete because a skill finished — skills don't track workflow position. Panel Equip (1D1), Panel Review (1D2), and User Approval (1E) must NEVER be skipped. |
| Per-slice QA fails (slice test fails against localhost) | Enter fix cycle: systematic-debugging → fix → re-run QA |
| Muggle MCP unavailable (auth status check fails or tools missing) | Fall back to manual localhost testing |

---

## Quick Reference: Agents & Skills by Phase

| Phase | Agent / Skill | When |
|-------|--------------|------|
| Research | `feature-dev:code-explorer`, `WebSearch`, `Context7`, `EnterPlanMode` | Step 1A: understand current state + landscape |
| Design | `feature-dev:code-architect`, `frontend-design:frontend-design`, `workflow-aware-brainstorming` | Step 1C: architecture + visual design + approach exploration |
| Panel Review | `superpowers:dispatching-parallel-agents` + specialist panelists | Step 1D: multi-expert scrutiny of design |
| Plan | `superpowers:writing-plans` | Step 1F: implementation slices |
| Execute (Step 2) | `superpowers:executing-plans` | Running the plan sequentially |
| Execute (Step 2) | `superpowers:dispatching-parallel-agents` | 2+ independent slices |
| Execute (Step 2) | `superpowers:test-driven-development` | Every engineer agent slice |
| Debug (Step 2) | `superpowers:systematic-debugging` | Any bug, test failure, or unexpected behavior |
| Verify (Step 3) | `superpowers:verification-before-completion` | Before claiming work is done |
| Review (Step 4) | `superpowers:requesting-code-review` | After all slices committed locally |
| Review (Step 4) | `superpowers:receiving-code-review` | Processing reviewer findings |
| Push (Step 5) | `superpowers:finishing-a-development-branch` | Push to remote + PR after review passes |
| Learn (Step 6) | `claude-md-management:revise-claude-md` | Graduate learnings into persistent rules |

---

## /muggle-do vs /muggle-ai-teams — When to Use Which

| Scenario | Use | Why |
|----------|-----|-----|
| Typo, config change, small bug | /muggle-do | Autonomous, fast, built-in QA |
| "Just do it" — clear requirements | /muggle-do | No design phase needed |
| New feature, unclear scope | /muggle-ai-teams (standard) | Needs requirements + design |
| Architectural change, multi-service | /muggle-ai-teams (full) | Needs panel review |
| Security-sensitive changes | /muggle-ai-teams (full) | Needs security panel |
| Refactoring 10+ files | /muggle-ai-teams (full) | Needs impact analysis |

Note: /muggle-ai-teams triage (Step 1A Phase 1) auto-routes Quick tasks to /muggle-do.

## Workflow Tiers

**Quick tier**: `1A (triage only) → /muggle-do` (autonomous: code → test → QA → PR)

**Standard tier**: `1A → 1B → 1C → 1E (with mockups) → 1F → 2 (per-slice QA) → 3 → 4 → 5 (publish) → 6`

**Full tier**: `1A → 1B → 1C → 1D1 → 1D2 → 1E (with mockups) → 1F → 2 (per-slice QA) → 3 (regression sweep) → 4 → 5 (publish) → 6`

## Mission Types

| Task | Mission | Tier Example |
|------|---------|-------------|
| "Fix login bug" | Coding | Quick → /muggle-do |
| "Add dashboard page" | Coding | Standard |
| "Redesign auth system" | Coding | Full |
| "Write investor pitch deck" | Non-coding | Standard (2 deliverables, investor-facing) |
| "Draft a cold email" | Non-coding | Quick → direct skill invocation |
| "Plan Tokyo trip with hotels" | Non-coding | Standard (3+ deliverables, external actions) |
| "Build full marketing campaign" | Non-coding | Full (5+ deliverables, multi-channel) |

### Non-coding execution differences

| Aspect | Coding Mode | Non-Coding Mode |
|--------|------------|-----------------|
| Step 2 unit | Code slice → git commit | Deliverable section → save to file |
| Verification | Typecheck, lint, test, QA | Completeness + consistency check |
| Review | 3-pass code review | Content quality review (audience, clarity, polish) |
| Delivery | Git push, PR, CI | Present output files, perform external actions |
| Tracking | Gate-level (execute, scope, QA, commit) | Gate-level (execute, scope, quality, user review, save) |

## Per-Slice QA via muggle-ai-works

Step 2 Gate 4 integrates Muggle AI **browser-based** QA testing. Tools:
- `muggle-remote-test-case-create` — create test case from instruction
- `muggle-local-execute-test-generation` — execute against localhost
- `muggle-local-run-result-get` — get pass/fail + screenshots
- `muggle-local-publish-test-script` — publish to cloud (Step 5)

### When QA triggers vs skips

| Slice type | Gate 4 QA | Primary verification |
|-----------|-----------|---------------------|
| Frontend (UI changes) | Triggers — browser test | QA screenshots + unit tests |
| Full-stack (UI + API) | Triggers — browser test | QA screenshots + unit tests |
| Backend-only (API/DB/services) | **Skips** — no UI to test | Unit tests (Gate 3) only |
| Docs/config only | Skips | N/A |

Falls back to manual localhost test if MCP unavailable or QA skipped.

---

## Sync Check

After updating any agent or workflow file, run: `scripts/sync-agents.sh`
