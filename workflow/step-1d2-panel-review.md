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
2. **Evaluate validity FIRST**: Do NOT auto-accept panel findings. For each finding ask:
   - Is this a real bug/gap, or is it over-engineering for this project's scale?
   - Is the panelist reasoning from a generic "best practice" that doesn't apply here?
   - Did the panelist misread something already in the plan? (Re-check plan text against finding.)
3. **Filter out human-pacing recommendations**: Panelists reason from a human-supervision perspective. Their **time-based recommendations (soak windows, ramp stages, calendar gates, "wait N days before next phase")** are human-supervision pacing — they do NOT apply to AI execution. Ignore them or compress them. Real platform constraints (rate limits, server-enforced cooldowns) DO apply.
4. **Discuss with user**: Present findings classified as STRONG VALID / DEBATABLE / INVALID with reasoning. Get user's call on borderline items. Do not implement everything panelists said just because they said it.
5. **Prioritize**: Rank user-validated MUST ADDRESS items. Flag contradictions.
6. **Revise design**: Address user-validated MUST ADDRESS + UNHAPPY PATHS. Present user-validated SHOULD ADDRESS to user separately.
7. **Re-review**: If design changed significantly, re-run affected panelists only.

**Escalation**: Same finding persists after 2 fixes → escalate: (A) accept risk, (B) redesign, (C) different approach.

## Completion Criteria

- [ ] Round 1 dispatched and collected
- [ ] Round 2 dispatched if gaps found (or skipped)
- [ ] All MUST ADDRESS items resolved (0 remaining)
- [ ] Consolidated report in plan document
- [ ] Design revised based on feedback

## Next → Read `muggle-ai-teams/workflow/step-1e-approval.md`
