# Shared Procedure: Panelist Output Formats

> Referenced by Step 1D2. Each panelist subagent receives the relevant format in its dispatch prompt.

---

## Standard Format (all panelists)

```
## MUST ADDRESS (blocks implementation)
- [finding] — [why this blocks, what goes wrong if ignored]

## SHOULD ADDRESS (improves quality significantly)
- [finding] — [concrete improvement and effort estimate]

## CONSIDER (worth thinking about, not blocking)
- [finding] — [potential benefit]

## APPROVED ASPECTS (what's strong about this design)
- [what works well and why]

## RECOMMENDED GAP PANELISTS (optional — any panelist can suggest)
- [panelist name] — [why this expertise is missing from the current review]
```

## Stress Test Reviewer Format

```
## UNHAPPY PATHS NOT COVERED
- Feature: [feature name]
  - [scenario] → [what should happen? not defined in design]
  - [scenario] → [not mentioned]

## RACE CONDITIONS
- [description of concurrent scenario]

## BOUNDARY CONDITIONS
- [empty state / max items / special characters / etc.]

## ABUSE SCENARIOS
- [rate limiting / bot attacks / credential stuffing / etc.]
```

## Blind Spot Reviewer Format

```
## GAPS FOUND
- [gap] — [why it matters] — RECOMMENDED PANELIST: [panelist name from gap roster]

## MUST ADDRESS (findings that don't need a specialist)
- [finding] — [what to fix]

## NO GAP PANELIST NEEDED
- [areas that are adequately covered]
```
