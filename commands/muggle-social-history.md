---
description: Open muggle-social content history showing all past posts with scores and performance data
---

# /muggle-social history

Generate content history HTML and open in browser.

1. Read all summary.md files from `muggle-social/contents/*/`
2. Parse scoring data from each summary
3. Populate `muggle-social/templates/history.html` template
4. Write to `muggle-social/data/history-latest.html`
5. Open in browser via Playwright MCP

Arguments: $ARGUMENTS
