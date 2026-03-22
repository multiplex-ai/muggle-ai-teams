# /muggle-ai-teams → Step 2: Execute Per Slice

> Part of /muggle-ai-teams. Mindset: `muggle-ai-teams/contexts/dev.md` — write code first, explain after.

> **Skills**: `superpowers:executing-plans`, `superpowers:dispatching-parallel-agents`, `superpowers:test-driven-development`

---

## Task Management Warning

**Do NOT create TaskCreate tasks for individual slices.** Creating slice tasks hijacks the workflow task list and causes the orchestrator to lose sight of Steps 3 (Verify), 4 (Review), 5 (Push), and 6 (Learn) after slices complete. The workflow step tasks created at session start are the permanent backbone — they must remain visible throughout.

**BEFORE executing any slice, create a sub-task tracking file:**
`muggle-ai-teams/projects/<project>/tracking/step-2-<phase>-slices.md` with a checkbox per slice. Check off each slice as it's committed. This file is NOT committed to git — it's local tracking only. Do NOT skip this — "mental tracking" leads to lost slices and skipped steps.

---

## Dispatch Strategy

- **2+ independent slices** (e.g. parallel frontend + backend): Invoke `superpowers:dispatching-parallel-agents` to run them simultaneously
- **Sequential slices**: Execute one at a time using `superpowers:executing-plans`
- **Single slice**: Execute directly

---

## Per Slice Execution — MANDATORY GATE SEQUENCE

Each slice MUST pass through ALL 7 gates in order. **No gate may be skipped. No next slice may be dispatched until all gates pass.** The tracking file enforces this — each gate is a sub-checkbox under the slice.

### Gate 1. Execute — Spawn the engineer agent with:
- Slice details + applicable stack rules
- **Instruction to follow TDD** (`superpowers:test-driven-development`): write failing test → implement → pass → refactor
- Scope (files to touch, files NOT to touch)
- Contract (if cross-repo)

### Gate 2. Scope check
- Run `git diff --name-only` and verify all modified files are within the declared scope.
- If the agent touched files outside scope, flag and revert before proceeding.
- **Contract check** (parallel cross-repo slices only): Verify the implementation matches the contract artifact defined in the plan.
- Update tracking file: `- [x] Scope check passed`

### Gate 3. Localhost test instructions — BLOCKING
- Post specific steps the user can follow to verify the slice works locally.
- **STOP HERE. Do not proceed to Gate 4 until the user responds.**

### Gate 4. User confirmation — BLOCKING
- Wait for the user to confirm the slice works.
- **Do not proceed until the user explicitly confirms.** No implicit confirmation. No "the user didn't object so I'll continue."
- If the user reports issues → enter fix cycle (see below).
- Update tracking file: `- [x] User confirmed`

### Gate 5. Commit
- Stage ONLY in-scope files (never `git add -A`).
- Commit with `type(scope): description` format.
- Verify clean working tree with `git status --short`.
- Update tracking file: `- [x] Committed (hash: <sha>)`

### Gate 6. Update tracking
- Mark the slice as complete in the tracking file with all sub-gates checked off.
- **Read the tracking file back** to confirm it's written correctly.

### Gate 7. Next slice
- **Pre-flight check: Read the tracking file.** Verify the previous slice has ALL gates checked. If any gate is unchecked, STOP — do not dispatch the next agent.
- Only then proceed to Gate 1 for the next slice.

---

## Fix Cycle (when user reports issues)

> **Skill**: `superpowers:systematic-debugging`

1. User describes issue
2. Invoke `superpowers:systematic-debugging` — structured diagnosis, not guessing:
   - Reproduce the issue
   - Form hypothesis
   - Verify with evidence
   - Fix root cause, not symptoms
3. Triage: which agent? Bug, missing feature, or adjustment?
4. Spawn correct Engineer with fix scope + TDD
5. Quality gates → user re-tests → commit locally
6. **If same issue persists after 2 fix attempts** → escalate to user: (A) accept risk, (B) redesign, (C) different approach
7. Back to normal flow

## Completion Criteria

- [ ] All slices executed and committed locally
- [ ] Quality gates passed per slice (typecheck, lint, test)
- [ ] Scope check passed per slice (no out-of-scope file changes)
- [ ] Contract check passed (if cross-scope)
- [ ] User confirmed each slice works via localhost testing

## Next → Read `muggle-ai-teams/workflow/step-3-verify.md`
