# /muggle-ai-teams → Step 4: Review Per PR

> Part of /muggle-ai-teams. Mindset: `muggle-ai-teams/contexts/review.md` — check logic, security, performance, tests.

> **Load rules**: core.md, quality-gates.md

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

**Create a sub-task tracking file** before processing fixes: `muggle-ai-teams/projects/<project>/tracking/step-4-<phase>-fixes.md` with a checkbox per finding. Check off each fix as it's committed. Do NOT track fixes mentally.

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

## Non-Coding Mode (if mission = non-coding)

When the mission is non-coding, review focuses on content quality — not code quality.

### Review Procedure
Instead of the 3-pass code review (quality, compliance, contract), perform a content review:

1. **Audience fit**: Does the content speak to the intended audience? Right level of detail, right tone, right assumptions about reader knowledge?
2. **Persuasion/clarity**: Is the message clear? For persuasive content (pitch decks, emails): is the ask obvious? For informational content (itineraries, plans): is it actionable?
3. **Completeness**: Any gaps the user hasn't noticed? Missing sections, weak transitions, unsupported claims?
4. **Polish**: Grammar, spelling, formatting, visual consistency.

### Optional: Dispatch review specialist
For high-stakes deliverables (investor-facing, client-facing), dispatch a review specialist:
- Investor materials → Investor Specialist reviews for fundraising best practices
- Marketing content → Marketing Specialist reviews for conversion effectiveness
- Outreach emails → Outreach Specialist reviews for deliverability and response rate

### Output
Present review findings to user grouped as:
- **Must fix**: Issues that undermine the deliverable's purpose
- **Should fix**: Improvements that would strengthen it
- **Polish**: Minor tweaks

If must-fix items exist → revise and re-review.

## Completion Criteria

- [ ] 3-pass review completed (quality, compliance, contract)
- [ ] All MUST FIX items resolved
- [ ] Re-review passed (if MUST FIX items existed)

### Completion Criteria (Non-Coding)
- [ ] Content review completed (audience fit, clarity, completeness, polish)
- [ ] All must-fix items addressed
- [ ] User confirmed final version

## Next → Read `muggle-ai-teams/workflow/step-5-push.md`
