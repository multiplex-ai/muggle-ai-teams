# /muggle-ai-teams → Step 3: Verify Before Completing

> Part of /muggle-ai-teams.
> **Skill**: `superpowers:verification-before-completion`

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

## If Verification Fails

- Quality gate failures → fix and re-verify
- After 3 consecutive failures on the same gate → escalate to user (likely architectural issue, not a code fix)

## Completion Criteria

- [ ] All quality gates pass across every project touched
- [ ] All tests pass with actual output verified
- [ ] No untracked files or uncommitted changes
- [ ] No sensitive data in committed files

## Next → Read `muggle-ai-teams/workflow/step-4-review.md`
