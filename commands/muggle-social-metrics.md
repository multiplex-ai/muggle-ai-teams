---
description: Run the muggle-social local metrics sweep — fetches engagement numbers from X, Reddit, HN, DEV.to, LinkedIn, Substack (+ GSC/GA4 when configured), parses CSV drops from data/metrics-inbox/, and writes performance keys into data/content-history.yaml.
---

# /muggle-social-metrics

Single-purpose wrapper. Runs `muggle-social/bin/run-metrics-local.sh` with any flags passed as arguments.

## Process

1. Run the script from the repo root:
   ```bash
   ./muggle-social/bin/run-metrics-local.sh $ARGUMENTS
   ```
2. Relay the output summary (platform= / gsc= / ga4= / no-data= / errors= tallies and the Merge count).
3. If no flags were passed (real writeback): report the commit candidate — fresh `data/content-history.yaml` + `data/metrics-inbox/last-run.txt` are now staged locally, ready for the next commit.
4. If `--dry-run` was passed: point to the `.candidate` file and the diff command.
5. If `--roundtrip-test` was passed: just report PASS/FAIL.

## Supported flags

- `--dry-run` — write to `data/content-history.yaml.candidate`, don't touch the real file.
- `--roundtrip-test` — no-op merge sanity check, verifies the YAML text patcher isn't corrupting anything.
- `--verbose` / `-v` — per-post status line.

## Notes

- The runner uses `.env` credentials from `muggle-social/.env`. Remote trigger environments cannot run this (they 403 on every platform API) — that is by design.
- First-time use requires `npm install` inside `muggle-social/`. The wrapper fails early if `node_modules/yaml` is missing.
- Full fetcher list and setup: see `muggle-social/bin/metrics-runner/README.md`.

Arguments: $ARGUMENTS
