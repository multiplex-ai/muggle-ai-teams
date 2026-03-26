#!/bin/bash
set -e

TEAM_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJ_DIR="$(dirname "$TEAM_DIR")"
CLAUDE_HOME="${HOME}/.claude"

echo "muggle-ai-teams Setup"
echo "===================="
echo "Team dir: $TEAM_DIR"
echo "Project dir: $PROJ_DIR"
echo ""

# Ensure ~/.claude exists
mkdir -p "$CLAUDE_HOME"

# ── Step 1: Rules symlink (not supported by plugin system) ───────────
# Plugins don't have a rules/ directory, so we symlink to ~/.claude/rules/
target="$CLAUDE_HOME/rules"
if [ -L "$target" ]; then
  echo "Updating symlink: ~/.claude/rules"
  rm "$target"
elif [ -d "$target" ]; then
  echo "Backing up ~/.claude/rules → ~/.claude/rules.bak"
  mv "$target" "${target}.bak"
fi
ln -s "$TEAM_DIR/rules" "$target"
echo "  ~/.claude/rules → muggle-ai-teams/rules ✅"

# Also symlink at project level for repos that need it
mkdir -p "$PROJ_DIR/.claude"
target="$PROJ_DIR/.claude/rules"
if [ -L "$target" ]; then
  rm "$target"
elif [ -d "$target" ]; then
  mv "$target" "${target}.bak"
fi
ln -s "$TEAM_DIR/rules" "$target"
echo "  .claude/rules → muggle-ai-teams/rules ✅"

echo ""

# ── Step 2: Memory symlink ───────────────────────────────────────────
MEMORY_DIR="$CLAUDE_HOME/projects/-Users-$(whoami)-muggleai/memory"
if [ -d "$MEMORY_DIR" ] && [ ! -L "$TEAM_DIR/memory" ]; then
  ln -s "$MEMORY_DIR" "$TEAM_DIR/memory"
  echo "  muggle-ai-teams/memory → $MEMORY_DIR ✅"
fi

# ── Step 3: Fix execute permissions ──────────────────────────────────
find "$CLAUDE_HOME/plugins" -name "*.sh" -type f ! -perm -u+x -exec chmod +x {} + 2>/dev/null || true
find "$TEAM_DIR/hooks" -name "*.sh" -type f ! -perm -u+x -exec chmod +x {} + 2>/dev/null || true
find "$TEAM_DIR/scripts" -name "*.sh" -type f ! -perm -u+x -exec chmod +x {} + 2>/dev/null || true
echo "  Fixed execute permissions on .sh scripts ✅"

echo ""
echo "Setup complete!"
echo ""
echo "Next: install the plugin inside Claude Code:"
echo ""
echo "  # Option A: Add as marketplace (permanent)"
echo "  /plugin marketplace add $TEAM_DIR"
echo "  /plugin install muggle-ai-teams@muggle-ai-teams"
echo ""
echo "  # Option B: Load directly (this session only)"
echo "  claude --plugin-dir $TEAM_DIR"
echo ""
echo "  # Option C: Add from GitHub (for teammates)"
echo "  /plugin marketplace add multiplex-ai/muggle-ai-teams"
echo "  /plugin install muggle-ai-teams@muggle-ai-teams"
echo ""
