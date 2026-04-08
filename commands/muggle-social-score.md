---
description: Open muggle-social score report showing the last run's per-post scoring breakdown
---

# /muggle-social score

Generate score report HTML for the most recent content run and open in browser.

1. Find the most recent directory in `muggle-social/contents/` (latest YYMMDD)
2. Read summary.md for scoring data
3. Read individual post files for detailed content
4. Populate `muggle-social/templates/score-report.html` template
5. Write to `muggle-social/data/score-latest.html`
6. Open in browser via Playwright MCP

Arguments: $ARGUMENTS
