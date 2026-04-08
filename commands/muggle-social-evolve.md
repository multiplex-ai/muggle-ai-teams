---
description: Manually trigger all 3 muggle-social evolution loops and apply pending rubric changes from the evolution log
---

# /muggle-social evolve

## Process

1. Read `muggle-social/config/evolution-log.md` for any pending TODO items from post-run feedback
2. For each pending item, evaluate whether it should become a rubric change
3. Apply approved changes to `muggle-social/config/scoring.yaml` (respect +/-2% cap per cycle)
4. Run Loop 1 (performance correlation) — see `muggle-social/schedules/loop-1-performance.md`
5. Run Loop 2 (competitive scan) — see `muggle-social/schedules/loop-2-competitive.md`
6. Run Loop 3 (AI answer tracking) — see `muggle-social/schedules/loop-3-ai-answers.md`
7. Log all changes to `muggle-social/config/evolution-log.md`
8. Report summary of changes made

## Safety Rails

- Max +/-2% weight change per criteria per cycle
- Use 7-day rolling average for data-driven changes
- If total drift >10% from baseline, pause and notify user
- Never modify `config/scoring-baseline.yaml`

Arguments: $ARGUMENTS
