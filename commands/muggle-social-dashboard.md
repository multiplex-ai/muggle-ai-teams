---
description: Open muggle-social evolution dashboard showing rubric drift, scoring trends, and tool status
---

# /muggle-social dashboard

Generate the evolution dashboard HTML from template and open in browser.

1. Read `muggle-social/config/scoring.yaml` (current weights)
2. Read `muggle-social/config/scoring-baseline.yaml` (baseline weights)
3. Read `muggle-social/config/evolution-log.md` (change history)
4. Read `muggle-social/config/tools.yaml` (tool status)
5. Calculate drift percentage between current and baseline
6. Populate `muggle-social/templates/dashboard.html` template:
   - Replace {{GENERATED_DATE}} with today's date
   - Replace {{RUBRIC_VERSION}} from scoring.yaml version field
   - Replace {{DRIFT_PCT}} with calculated drift
   - Replace {{DRIFT_CLASS}} with drift-ok (<5%), drift-warn (5-10%), or drift-alert (>10%)
   - Replace {{TOTAL_CYCLES}} with count of evolution log entries
   - Replace {{FIRST_CYCLE_DATE}} with first log entry date
   - Replace {{DRIFT_DATA_JSON}} with Chart.js line chart data (weight changes over time)
   - Replace {{COMPARISON_DATA_JSON}} with Chart.js radar chart data (current vs baseline)
   - Replace {{TOOL_STATUS_ITEMS}} with HTML for tool status grid
7. Write populated HTML to `muggle-social/data/dashboard-latest.html`
8. Open in browser via Playwright MCP

Arguments: $ARGUMENTS
