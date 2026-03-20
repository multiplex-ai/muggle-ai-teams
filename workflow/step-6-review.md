# /MuggleAI-Teams → Step 6: Review Per PR

> Part of /MuggleAI-Teams. Mindset: `MuggleAI-Teams/contexts/review.md` — check logic, security, performance, tests.

> **Skills**: `superpowers:requesting-code-review`, `superpowers:receiving-code-review`

---

## Request Review

Invoke `superpowers:requesting-code-review`:

1. Spawn the Reviewer agent on the full diff
   - **Pass 1: Code quality** — bugs, edge cases, security, performance
   - **Pass 2: Compliance** — CLAUDE.md rules, naming conventions, types, tests
   - **Pass 3: Contract consistency** — cross-repo PRs only: verify both sides match the contract artifact
2. Reviewer returns findings categorized as: **MUST FIX** / **SHOULD FIX** / **NITPICK**

---

## Receive Review

Invoke `superpowers:receiving-code-review` to process findings:

### Processing rules

- **Do NOT blindly implement all suggestions** — verify each finding is technically correct
- If a finding is wrong, explain why and skip it

### By severity

| Severity | Action |
|----------|--------|
| **MUST FIX** | Engineer fixes with TDD → quality gates → user re-tests → commit locally |
| **SHOULD FIX** | Engineer fixes → quality gates → commit locally |
| **NITPICK** | Fix if trivial, skip if not |

### Escalation

- If same finding persists after 2 fix attempts → escalate to user
- Re-run Reviewer after fixes if there were MUST FIX items

## Next → Read `MuggleAI-Teams/workflow/step-7-push.md`
