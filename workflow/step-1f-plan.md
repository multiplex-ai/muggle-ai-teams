# /muggle-ai-teams → Step 1F: Implementation Plan

> **Load rules**: coding.md, testing.md, planning.md, agents-routing.md
> **Skill**: `superpowers:writing-plans`

**Non-coding?** Read `workflow/ref-non-coding-design.md` (Non-Coding Plan section).

---

## 1. Route the requirement

Read the project config — its scope table is the source of truth for agent routing.

| Requirement type | Agent |
|-----------------|-------|
| UI, pages, styling, hooks, frontend state | Frontend Engineer |
| API, controllers, services, DB, queues | Backend Engineer |
| CLI, MCP, protocol layers | General Engineer |
| API contract change | Both (split requirement) |

**Cross-scope?** Read `workflow/ref-cross-scope-planning.md` for parallel/sequential decision + contract artifact.

## 2. Break into committable slices

Each slice must be:
- Small enough to commit independently
- Testable in isolation
- Clear about which agent owns it

Per slice, specify:
- **Agent** + **Skills** (from Step 1A/1D1 skill search — REQUIRED)
- **Scope**: files to touch / NOT touch
- **TDD steps**: what tests to write first
- **QA instruction** (user-facing slices): browser test description for muggle-ai-works
  - Omit for backend-only slices → `QA: N/A (backend-only)`
- **Localhost test instructions**: how user verifies it

## 3. Batch planning

If more than 5 slices, group into batches of max 5. Note batch boundaries in the plan.

## 4. Multi-phase tracking (if design produced multiple phases)

If the design (Steps 1C-1E) defined multiple phases, create a phase tracking file:

`muggle-ai-teams/projects/<project>/tracking/phases.md`

```markdown
# Phase Tracking
- [ ] Phase 1: [name/scope] — Branch: [branch]
- [ ] Phase 2: [name/scope] — Branch: [branch]
- [ ] Phase 3: [name/scope] — Branch: [branch]
> Current: Phase 1
```

**This file is read by Step 5 to decide whether to loop back or proceed to Step 6.** If it doesn't exist, Step 5 assumes single-phase and goes to Step 6.

If this is a **subsequent phase** (looping back from Step 5): read `phases.md`, update `> Current:` to the new phase, and plan only this phase's slices.

## 5. User approval

Present the full plan. Wait for explicit approval before Step 2.

## Completion Criteria

- [ ] Requirements routed to agents via project config scope table
- [ ] Cross-scope: parallel/sequential decided, contract defined
- [ ] Slices defined with agent, skills, scope, TDD steps, QA instructions
- [ ] Batches defined if > 5 slices
- [ ] Phase tracking file created (if multi-phase)
- [ ] User approved

## Next → Read `muggle-ai-teams/workflow/step-2-execute.md`
