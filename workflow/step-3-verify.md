# /muggle-ai-teams → Step 3: Verify Before Completing

> Part of /muggle-ai-teams.
> **Skill**: `superpowers:verification-before-completion`
> **Load rules**: quality-gates.md, context-management.md

After all slices are committed locally, before spawning the Reviewer:

---

## Procedure

1. Invoke `superpowers:verification-before-completion`
2. Run ALL quality gates across every project touched, using commands from the project config (`muggle-ai-teams/projects/<project-name>/<project-name>.md`):
   - Typecheck (e.g., `npm run typecheck`, `mypy`, `go vet`)
   - Lint (e.g., `npm run lint`, `ruff`, `golangci-lint`)
   - Test (e.g., `npm test`, `pytest`, `go test ./...`)
   - Secret scanning
3. Confirm all tests pass with **actual output** (not assumptions)
4. Verify no untracked files or uncommitted changes (`git status`)
5. Verify no sensitive data (API keys, passwords, connection strings) in any committed file
6. Only proceed to review when verification passes

---

## Optional: Final Regression Sweep (FULL TIER ONLY)

If tier = full AND Muggle MCP server is available:
1. List all existing test scripts for the project: `muggle-remote-test-script-list`
2. Replay ALL scripts (not just slice-specific ones) to catch cross-slice interaction bugs:
   - For each script: `muggle-remote-test-script-get` → `muggle-local-execute-replay`
3. If regression found → fix cycle (diagnose with `superpowers:systematic-debugging`)
4. Record regression sweep results for Step 5 publishing

**STANDARD TIER**: Skip regression sweep — each slice was already QA'd individually in Step 2.

**If Muggle MCP not available**: Skip regression sweep regardless of tier.

## Non-Coding Mode (if mission = non-coding)

When the mission is non-coding, verification checks completeness against requirements — not code quality.

### Procedure
1. **Completeness check**: Read the final output and compare against requirements from Step 1B:
   - Every deliverable listed in scope analysis → produced?
   - Every section from Step 1F → written and user-approved?
   - All acceptance criteria from Step 1B → met?
2. **Consistency check**: Read the full output end-to-end:
   - Consistent tone/style throughout?
   - No contradictions between sections?
   - Formatting consistent (headers, lists, structure)?
3. **External actions check** (if applicable):
   - All bookings/sends/actions from the plan → completed?
   - Confirmations received?
4. **Missing information check**:
   - Any placeholder text remaining? (e.g., "[TODO]", "[INSERT]", "TBD")
   - Any sections marked as draft?

### Skip
- No typecheck, lint, test, or secret scan
- No regression sweep

## If Verification Fails

- Quality gate failures → **diagnose before fixing** (per `rules/behavior.md`): identify root cause + blast radius, then fix and re-verify. Do not blindly patch to make the gate pass.
- After 3 consecutive failures on the same gate → escalate to user (likely architectural issue, not a code fix)

## Completion Criteria

- [ ] All quality gates pass across every project touched
- [ ] All tests pass with actual output verified
- [ ] No untracked files or uncommitted changes
- [ ] No sensitive data in committed files
- [ ] Regression sweep passed (full tier) or skipped with documented reason

### Completion Criteria (Non-Coding)
- [ ] All deliverables complete against Step 1B requirements
- [ ] Consistency check passed (tone, style, formatting)
- [ ] No placeholder text or draft sections remaining
- [ ] External actions confirmed (if applicable)

## Next → Read `muggle-ai-teams/workflow/step-4-review.md`
