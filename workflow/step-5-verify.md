# /MuggleAI-Teams → Step 5: Verify Before Completing

> Part of /MuggleAI-Teams.
> **Skill**: `superpowers:verification-before-completion`

After all slices are committed locally, before spawning the Reviewer:

---

## Procedure

1. Invoke `superpowers:verification-before-completion`
2. Run ALL quality gates across every repo touched:
   - `npm run typecheck` (tsc --noEmit)
   - `npm run lint` (ESLint + any other linters)
   - `npm test` (full test suite)
   - Secret scanning
3. Confirm all tests pass with **actual output** (not assumptions)
4. Verify no untracked files or uncommitted changes (`git status`)
5. Verify no sensitive data (API keys, passwords, connection strings) in any committed file
6. Only proceed to review when verification passes

---

## If Verification Fails

- Quality gate failures → fix and re-verify
- After 3 consecutive failures on the same gate → escalate to user (likely architectural issue, not a code fix)

## Next → Read `MuggleAI-Teams/workflow/step-6-review.md`
