# Reference: Per-Slice Gate Details

> Read this when executing a slice. Each gate's full procedure is below.

## Gate 1: Execute — Spawn engineer agent with:
- Slice details + applicable stack rules
- **Skills section** (REQUIRED — read the **Skills Found** table from the plan document and assign relevant skills. Multi-skill per agent OK, but no overlapping/duplicate skills. If no skills apply, state why.)
- TDD instruction: write failing test → implement → pass → refactor
- Scope (files to touch, files NOT to touch)
- Contract (if cross-repo)

## Gate 2: Scope check
- Run `git diff --name-only` — verify all modified files are within declared scope
- If agent touched files outside scope → flag and revert
- **Contract check** (parallel cross-repo slices only): verify implementation matches contract artifact
- Update tracking: `- [x] Scope check`

## Gate 3: Quality gates
- Run typecheck, lint, test for affected project(s) using commands from project config
- If fail → fix cycle (see below)
- Update tracking: `- [x] Quality gates`

## Gate 4: QA via muggle-ai-works — SMART TRIGGER

**Trigger conditions** (ALL must be true):
1. Slice has QA test instruction (from Step 1F)
2. Muggle MCP server is available (`muggle-remote-auth-status`)
3. Slice touches app code (not docs/config only)
4. Slice has **user-facing changes** (UI components, pages, forms, navigation)

**If triggered (user-facing):**
1. Check auth → find/create project → create test case from QA instruction
2. `muggle-local-execute-test-generation` (localUrl from project config)
3. `muggle-local-run-result-get` → present results + screenshots
4. Pass → Gate 5. Fail → fix cycle.

**If NOT triggered:** Skip with documented reason. Backend-only → verified by unit tests.
- Update tracking: `- [x] QA: PASS/skipped`

## Gate 5: User confirmation — BLOCKING
- Present results + screenshots (if QA ran) or manual test steps
- **Do not proceed until user explicitly confirms.** No implicit confirmation.
- Update tracking: `- [x] User confirmed`

## Gate 6: Commit
- Stage ONLY in-scope files (never `git add -A`)
- Commit with `type(scope): description` format
- Verify clean working tree
- Update tracking: `- [x] Committed (hash: <sha>)`

## Gate 7: Next slice
- Mark slice complete. Read tracking file back to verify.
- Confirm previous slice has ALL gates checked before starting next.

---

## Fix Cycle

> **Rule**: `rules/behavior.md` — Diagnose Before Fixing

1. **Orchestrator diagnoses** (Opus): root cause with `file:line`, blast radius, fix spec
2. **Dispatch fix** to engineer (Sonnet) with specific fix instructions
3. Quality gates → user re-tests → commit
4. **If same issue after 2 attempts** → escalate: (A) accept risk, (B) redesign, (C) different approach
