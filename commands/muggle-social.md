---
description: Goal-driven social content workflow — PILLAR/SHORT/ENGAGE/RESPOND/PITCH modes, 12-angle opportunity analysis, Discovery+Conversion scoring, convergence loop, self-evolving rubric.
---

# /muggle-social

Parse `$ARGUMENTS` as `<subcommand> [flags]`.

## Subcommand routing

| Subcommand | Action |
|---|---|
| `pillar` | PILLAR mode — long-form COPE content. Read and follow `muggle-social/SKILL.md`, mode = PILLAR |
| `short` | SHORT mode — single-platform daily content. Read and follow `muggle-social/SKILL.md`, mode = SHORT |
| `short --from-pillar <id>` | SHORT mode seeded from a PILLAR recast. Read and follow `muggle-social/SKILL.md`, mode = SHORT, from-pillar flag active |
| `engage` | ENGAGE mode — replies and comments. Read and follow `muggle-social/SKILL.md`, mode = ENGAGE |
| `respond` | RESPOND mode — inbound replies/DMs. Read and follow `muggle-social/SKILL.md`, mode = RESPOND |
| `pitch` | PITCH mode — cold outreach. Read and follow `muggle-social/SKILL.md`, mode = PITCH |
| `dashboard` | Open evolution dashboard — run steps in `muggle-social/schedules/performance-validation.md` dashboard section |
| `history` | Show content history — read `muggle-social/data/content-history.yaml`, render per-post scores and performance |
| `metrics` | Run local metrics sweep — execute `muggle-social/bin/run-metrics-local.sh $FLAGS` and report tallies |
| `score` | Show score report for most recent content run |
| `evolve` | Manually trigger evolution loops — read and follow `muggle-social/phases/evolution.md` |
| *(no subcommand)* | Read and follow `muggle-social/SKILL.md`; mode inferred from session context or prompted |

## Dashboard

1. Read `muggle-social/config/scoring.yaml` (current weights)
2. Read `muggle-social/config/scoring-baseline.yaml` (baseline weights)
3. Read `muggle-social/config/evolution-log.md` (change history)
4. Read `muggle-social/config/tools.yaml` (tool status)
5. Calculate drift between current and baseline
6. Populate `muggle-social/templates/dashboard.html`:
   - `{{GENERATED_DATE}}` → today's date
   - `{{RUBRIC_VERSION}}` → from scoring.yaml
   - `{{DRIFT_PCT}}` / `{{DRIFT_CLASS}}` → drift-ok (<5%), drift-warn (5-10%), drift-alert (>10%)
   - `{{TOTAL_CYCLES}}` → count of evolution log entries
   - `{{FIRST_CYCLE_DATE}}` → first log entry date
   - `{{DRIFT_DATA_JSON}}` → Chart.js line data
   - `{{COMPARISON_DATA_JSON}}` → Chart.js radar data
   - `{{TOOL_STATUS_ITEMS}}` → tool status grid HTML
7. Write to `muggle-social/data/dashboard-latest.html`
8. Open in browser via Playwright MCP

## History

1. Read all `summary.md` files from `muggle-social/contents/*/`
2. Parse scoring data from each summary
3. Populate `muggle-social/templates/history.html`
4. Write to `muggle-social/data/history-latest.html`
5. Open in browser via Playwright MCP

## Metrics

Single-purpose wrapper — runs `muggle-social/bin/run-metrics-local.sh` with any flags passed.

Supported flags:
- `--dry-run` — write to `data/content-history.yaml.candidate`, don't touch the real file
- `--roundtrip-test` — no-op merge sanity check
- `--verbose` / `-v` — per-post status line

Report: platform= / gsc= / ga4= / no-data= / errors= tallies and Merge count.

## Score

1. Find the most recent directory in `muggle-social/contents/` (latest YYMMDD)
2. Read `summary.md` for scoring data
3. Read individual post files for detailed content
4. Populate `muggle-social/templates/score-report.html`
5. Write to `muggle-social/data/score-latest.html`
6. Open in browser via Playwright MCP

## Evolve

1. Read `muggle-social/config/evolution-log.md` for pending TODO items
2. Evaluate each pending item against evolution triage criteria (`muggle-social/phases/evolution.md`)
3. Apply approved changes to `muggle-social/config/scoring.yaml` (respect +/-2% cap per cycle)
4. Run all 4 daily loops (performance, competitive, AI engines, platforms)
5. Log all changes to `muggle-social/config/evolution-log.md`
6. Report summary of changes made

Safety rails: max +/-2% per criteria per cycle; 7-day rolling average; >10% total drift → pause and notify; never modify `config/scoring-baseline.yaml`.

Arguments: $ARGUMENTS
