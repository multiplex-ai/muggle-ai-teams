# /muggle-ai-teams → Step 4: Review Per PR

> Mindset: `muggle-ai-teams/contexts/review.md`
> **Load rules**: core.md, quality-gates.md
> **Skills**: `superpowers:requesting-code-review`, `superpowers:receiving-code-review`

**Non-coding?** Replace 3-pass code review with content review: audience fit, clarity, completeness, polish.

---

## Request Review

Invoke `superpowers:requesting-code-review`. Spawn Reviewer agent on full diff:
- **Pass 1**: Code quality — bugs, edge cases, security, performance
- **Pass 2**: Compliance — CLAUDE.md rules, naming, types, tests
- **Pass 3**: Contract consistency (cross-repo only)

Returns: **MUST FIX** / **SHOULD FIX** / **NITPICK**

## Receive Review

Create tracking file: `projects/<project>/tracking/step-4-<phase>-fixes.md`

Process with `superpowers:receiving-code-review`:
- **Do NOT blindly implement** — verify each finding is correct
- **MUST FIX**: Diagnose root cause + blast radius → engineer fixes with TDD → quality gates → commit
- **SHOULD FIX**: Same flow, lower priority
- **NITPICK**: Fix if trivial, skip if not

**Batch cap**: Max 5 findings per fix batch. Verify all fixed before next batch.

**Escalation**: Same finding after 2 attempts → escalate to user. Re-run reviewer if MUST FIX items existed.

## Completion Criteria

- [ ] 3-pass review completed
- [ ] All MUST FIX resolved
- [ ] Re-review passed (if MUST FIX items existed)

## Next → Read `muggle-ai-teams/workflow/step-5-push.md`
