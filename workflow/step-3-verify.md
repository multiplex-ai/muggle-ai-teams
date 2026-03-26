# /muggle-ai-teams → Step 3: Verify Before Completing

> **Skill**: `superpowers:verification-before-completion`
> **Load rules**: quality-gates.md

**Non-coding?** Check: all deliverables complete, consistent tone, no placeholders, external actions done.

---

## Standard Tier (lightweight)

Quality gates already passed per-slice in Step 2. Just verify:
1. No untracked files or uncommitted changes (`git status`)
2. No sensitive data in committed files
3. All slices in tracking file have all gates checked

## Full Tier (comprehensive)

1. Run ALL quality gates across every project: typecheck, lint, test, secret scan
2. Confirm with **actual output** (not assumptions)
3. No untracked files or uncommitted changes
4. **Regression sweep** (if Muggle MCP available): replay ALL test scripts via `muggle-local-execute-replay`
5. If regression found → fix cycle (diagnose first)

## If Verification Fails

Diagnose before fixing (per `rules/behavior.md`). After 3 failures on same gate → escalate to user.

## Completion Criteria

- [ ] Git clean (no untracked/uncommitted)
- [ ] No sensitive data
- [ ] Quality gates pass (full tier: comprehensive; standard: per-slice already done)
- [ ] Regression sweep passed or skipped (full tier only)

## Next → Read `muggle-ai-teams/workflow/step-4-review.md`
