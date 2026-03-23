# /muggle-ai-teams → Step 2: Execute Per Slice

> Part of /muggle-ai-teams. Mindset: `muggle-ai-teams/contexts/dev.md` — write code first, explain after.

> **Skills**: `superpowers:executing-plans`, `superpowers:dispatching-parallel-agents`, `superpowers:test-driven-development`

> **Load rules**: coding.md, testing.md, quality-gates.md, agents-advanced.md

---

## Task Management Warning

**Do NOT create TaskCreate tasks for individual slices.** Creating slice tasks hijacks the workflow task list and causes the orchestrator to lose sight of Steps 3 (Verify), 4 (Review), 5 (Push), and 6 (Learn) after slices complete. The workflow step tasks created at session start are the permanent backbone — they must remain visible throughout.

**BEFORE executing any slice, create a sub-task tracking file:**
`muggle-ai-teams/projects/<project>/tracking/step-2-<phase>-slices.md` with a checkbox per slice. Check off each slice as it's committed. This file is NOT committed to git — it's local tracking only. Do NOT skip this — "mental tracking" leads to lost slices and skipped steps.

Tracking file format:

```markdown
  - [ ] Slice 1: Login form
    - [x] Execute
    - [x] Scope check
    - [x] Quality gates passed
    - [x] QA: PASS (runId: abc123, screenshots: 3)
    - [x] User confirmed
    - [x] Committed (hash: a1b2c3d)
```

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

### Gate 3. Quality gates
- Run typecheck, lint, test for affected project(s) using commands from project config.
- If fail → fix cycle before proceeding.
- Update tracking file: `- [x] Quality gates passed`

### Gate 4. QA via muggle-ai-works — SMART TRIGGER

muggle-ai-works is **browser-based QA** (Electron app, UI interactions, screenshots). It verifies user-facing flows, not backend logic directly. Backend-only slices are verified by unit tests in Gate 3.

**Trigger conditions** (ALL must be true):
  a. Slice has QA test instruction (from Step 1F)
  b. Muggle MCP server is available (check `muggle-remote-auth-status`)
  c. Slice touches app code (not docs/config only)
  d. Slice has **user-facing changes** (UI components, pages, forms, navigation, visual output)

**Condition (d) — what counts as user-facing:**
- YES: Changes to UI components, pages, layouts, forms, modals, navigation, client-side state that affects display
- YES: Full-stack changes where the UI is the entry point (e.g., new form + API endpoint)
- NO: Backend-only changes (API logic, database queries, background jobs, migrations, services)
- NO: Config changes, dependency updates, refactoring with no UI impact
- EDGE CASE: API response shape changes that affect existing UI — only trigger if the UI is running and the change is observable in the browser

**If triggered (user-facing slice):**
  1. Check auth: `muggle-remote-auth-status` (login if needed)
  2. Find or create project: `muggle-remote-project-list` / `muggle-remote-project-create`
  3. Create test case from slice's QA test instruction:
     `muggle-remote-test-case-create` with instruction from Step 1F
  4. Execute locally: `muggle-local-execute-test-generation`
     - localUrl = localhost URL from project config
     - approveElectronAppLaunch = true (after user confirms)
  5. Get results: `muggle-local-run-result-get`
  6. Present results to user with screenshots as evidence
  7. Pass → proceed to Gate 5
  8. Fail → fix cycle (diagnose with `superpowers:systematic-debugging`)

**If NOT triggered — backend-only slice:**
  - Skip browser QA — unit tests (Gate 3) are the primary verification
  - Present skip reasoning:
    "This is a backend-only slice (no user-facing changes). Verified by unit tests
     in Gate 3. Skipping browser QA. Proceed to commit? (y/n)"
  - If slice has localhost test instructions: present them for optional manual verification
  - Proceed to Gate 5

**If NOT triggered — other reasons (MCP unavailable, no QA instruction, docs-only):**
  - Fall back to manual localhost test instructions (post steps for user)
  - Wait for user confirmation
  - Proceed to Gate 5

Update tracking: `- [x] QA: PASS (runId: <id>, screenshots: <N>)` or `- [x] QA: skipped (backend-only, verified by unit tests)` or `- [x] Manual test: confirmed`

### Gate 5. User confirmation — BLOCKING
- If Gate 4 ran QA: present results + screenshots. "QA passed with N screenshots. Confirm? (y/n)"
- If Gate 4 was manual: wait for user to confirm localhost test.
- Record QA run ID in tracking file (for publishing in Step 5).
- **Do not proceed until the user explicitly confirms.** No implicit confirmation. No "the user didn't object so I'll continue."
- If the user reports issues → enter fix cycle (see below).
- Update tracking file: `- [x] User confirmed`

### Gate 6. Commit
- Stage ONLY in-scope files (never `git add -A`).
- Commit with `type(scope): description` format.
- Verify clean working tree with `git status --short`.
- Update tracking file: `- [x] Committed (hash: <sha>)`

### Gate 7. Update tracking + Next slice
- Mark the slice as complete in the tracking file with all sub-gates checked off.
- **Read the tracking file back** to confirm it's written correctly.
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

## Non-Coding Mode (if mission = non-coding)

When the mission is non-coding, the execution flow changes significantly. No git, no QA, no typecheck — but the structure remains.

### Task Management
Same as coding mode: do NOT create TaskCreate tasks for individual sections. Track in sub-task files.

Create tracking file: `muggle-ai-teams/projects/<project>/tracking/step-2-<phase>-sections.md`

### Dispatch Strategy (same principle)
- 2+ independent sections → parallel specialists
- Sequential sections → one at a time
- Single section → execute directly

### Per Section — GATE SEQUENCE

#### Gate 1. Execute — Spawn specialist agent with:
- Section brief from Step 1F
- Equipped skill content (read the skill file, inject into prompt)
- Research findings from Step 1A
- Any prior section outputs needed as input
- Output format specification

#### Gate 2. Scope check
- Verify the output covers the assigned section and nothing else
- Check that tone/style matches the requirements from Step 1B
- Update tracking: `- [x] Scope check passed`

#### Gate 3. Quality check
- Review output for: completeness, accuracy, tone, formatting
- No typecheck/lint/test — this is content quality, not code quality
- Update tracking: `- [x] Quality check passed`

#### Gate 4. User review — BLOCKING
- Present the section output to the user
- **STOP. Wait for explicit user feedback.**
- User options: approve, request changes, or reject
- If changes requested → specialist revises → re-present
- Update tracking: `- [x] User approved`

#### Gate 5. Save
- Write approved section to the output file
- For external actions (bookings, sends): confirm with user before executing
- Update tracking: `- [x] Saved / Action performed`

#### Gate 6. Next section
- Verify previous section has all gates checked
- Proceed to Gate 1 for next section

### Tracking file format (non-coding)
```
- [ ] Section 1: Cover + Problem Statement
  - [x] Execute (Investor Specialist)
  - [x] Scope check
  - [x] Quality check
  - [x] User approved
  - [x] Saved to output/pitch-deck.md
- [ ] Section 2: Solution + Product Demo
  - [ ] Execute
  ...
```

### Fix Cycle (non-coding)
Same structure as coding: if user reports issues, diagnose → revise → re-present.
No `superpowers:systematic-debugging` — instead, ask the user what's wrong and have the specialist revise.

---

## Completion Criteria

- [ ] All slices executed and committed locally
- [ ] Quality gates passed per slice (typecheck, lint, test)
- [ ] Scope check passed per slice (no out-of-scope file changes)
- [ ] QA passed per slice (automated or manual confirmation)
- [ ] Contract check passed (if cross-scope)
- [ ] User confirmed each slice

### Completion Criteria (Non-Coding)
- [ ] All sections executed and user-approved
- [ ] Scope check passed per section
- [ ] Quality check passed per section
- [ ] Output file(s) written with all sections
- [ ] External actions performed (if any) with user confirmation

## Next → Read `muggle-ai-teams/workflow/step-3-verify.md`
