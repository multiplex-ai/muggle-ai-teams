#!/usr/bin/env bash
# sync-agents.sh — Verify Claude Code agents and Cursor .mdc files are in sync.
# Strips frontmatter from both files, diffs the remaining markdown body.
# Exit code 0 = all in sync, 1 = divergence found.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

PAIRS=(
  ".claude/agents/frontend-engineer.md:frontend-engineer.mdc"
  ".claude/agents/backend-engineer.md:backend-engineer.mdc"
  ".claude/agents/general-engineer.md:general-engineer.mdc"
  ".claude/agents/reviewer.md:reviewer.mdc"
  ".claude/agents/ux-reviewer.md:ux-reviewer.mdc"
  ".claude/commands/workflow.md:agent-workflow.mdc"
)

strip_frontmatter() {
  # Remove everything between the first --- and second --- (YAML/Cursor frontmatter)
  awk 'BEGIN{skip=0} /^---$/{skip++; next} skip>=2{print}' "$1"
}

diverged=0

for pair in "${PAIRS[@]}"; do
  IFS=':' read -r claude_file cursor_file <<< "$pair"

  if [[ ! -f "$claude_file" ]]; then
    echo -e "${RED}MISSING${NC}: $claude_file"
    diverged=1
    continue
  fi

  if [[ ! -f "$cursor_file" ]]; then
    echo -e "${RED}MISSING${NC}: $cursor_file"
    diverged=1
    continue
  fi

  body_diff=$(diff <(strip_frontmatter "$claude_file") <(strip_frontmatter "$cursor_file") || true)

  if [[ -n "$body_diff" ]]; then
    echo -e "${RED}DIVERGED${NC}: $claude_file <-> $cursor_file"
    echo "$body_diff" | head -20
    echo ""
    diverged=1
  else
    echo -e "${GREEN}IN SYNC${NC}: $claude_file <-> $cursor_file"
  fi
done

if [[ $diverged -eq 1 ]]; then
  echo ""
  echo -e "${RED}Some agent files are out of sync. Update the diverged files.${NC}"
  exit 1
else
  echo ""
  echo -e "${GREEN}All agent files are in sync.${NC}"
  exit 0
fi
