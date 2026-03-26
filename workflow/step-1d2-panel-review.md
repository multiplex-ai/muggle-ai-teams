# /muggle-ai-teams → Step 1D2: Panel Review

> **Tier guard**: Standard tier → dispatch 1 architect for quick review (obvious issues? security? edge cases?), then proceed to Step 1E.
> **Skill**: `superpowers:dispatching-parallel-agents`
> **PREREQUISITE**: Step 1D1 completed.

---

## Roster

Full panelist roster and formats → `workflow/ref-panel-roster.md`
Output format per panelist → `workflow/procedure-panelist-formats.md`

## Round 1: Core + Domain Panelists (parallel)

Select only relevant panelists. Present selection to user for confirmation. Dispatch in parallel.

## Between Rounds

1. Read Blind Spot Reviewer's GAPS FOUND
2. Map gaps to gap panelists
3. Present to user: "Found N gaps. Recommending: [list]. Adjust?"
4. No gaps → skip Round 2

## Round 2: Gap Panelists (parallel, if gaps found)

Dispatch recommended gap panelists.

## After Both Rounds

1. **Synthesize**: Consolidate ALL findings by theme (not by panelist)
2. **Prioritize**: Rank MUST ADDRESS items. Flag contradictions for user.
3. **Revise design**: Address all MUST ADDRESS + UNHAPPY PATHS. Present SHOULD ADDRESS to user.
4. **Re-review**: If design changed significantly, re-run affected panelists only.

**Escalation**: Same finding persists after 2 fixes → escalate: (A) accept risk, (B) redesign, (C) different approach.

## Completion Criteria

- [ ] Round 1 dispatched and collected
- [ ] Round 2 dispatched if gaps found (or skipped)
- [ ] All MUST ADDRESS items resolved (0 remaining)
- [ ] Consolidated report in plan document
- [ ] Design revised based on feedback

## Next → Read `muggle-ai-teams/workflow/step-1e-approval.md`
