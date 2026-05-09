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

## Real-Data Testing Default

When verifying routines, scheduled jobs, or anything that fetches/produces real data: **run them with REAL data, not stubs/dry-runs/synthetic fixtures.** Dry-runs only validate spec syntax. Real fires expose:
- Schema drift between what the spec says and what platforms actually return
- Self-disable gates triggering unexpectedly
- Cross-routine race conditions on shared yaml files
- Data-freshness recycling (same items returned run-after-run)

If a routine produces output others depend on, run it real, observe the real output, classify the result strictly.

## PASS Criterion Strict

PASS = "ran completely fine with no observations worth noting." Any small issue = WARN, not PASS. Examples that are WARN, not PASS:
- Routine completed but recycled results from prior run (data freshness)
- Real-world data gap surfaced (zero high-fit candidates in a category)
- Search-strategy fallback fired (e.g., `site:x.com` empty, broader search worked)
- Spec drift surfaced and self-corrected during execution
- Routing inconsistency (output points to wrong target file but the file resolves)

WARN doesn't mean broken — it means worth surfacing for follow-up. Strict classification prevents "looks good" creep.

## If Verification Fails

Diagnose before fixing (per `rules/behavior.md`). After 3 failures on same gate → escalate to user.

## Completion Criteria

- [ ] Git clean (no untracked/uncommitted)
- [ ] No sensitive data
- [ ] Quality gates pass (full tier: comprehensive; standard: per-slice already done)
- [ ] Regression sweep passed or skipped (full tier only)
- [ ] Routines verified with REAL data (not dry-runs)
- [ ] Every WARN classified — fix or document; do NOT label as PASS

## Next → Read `muggle-ai-teams/workflow/step-4-review.md`
