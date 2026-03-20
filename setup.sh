#!/bin/bash
set -e

TEAM_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJ_DIR="$(dirname "$TEAM_DIR")"
CLAUDE_HOME="${HOME}/.claude"

echo "MuggleAI-Teams Setup"
echo "===================="
echo "Team dir: $TEAM_DIR"
echo "Project dir: $PROJ_DIR"
echo ""

# Ensure ~/.claude exists
mkdir -p "$CLAUDE_HOME"

# Global symlinks
for dir in agents commands skills rules; do
  target="$CLAUDE_HOME/$dir"
  if [ -L "$target" ]; then
    echo "Updating symlink: ~/.claude/$dir"
    rm "$target"
  elif [ -d "$target" ]; then
    echo "Backing up ~/.claude/$dir → ~/.claude/${dir}.bak"
    mv "$target" "${target}.bak"
  fi
  ln -s "$TEAM_DIR/$dir" "$target"
  echo "  ~/.claude/$dir → MuggleAI-Teams/$dir ✅"
done

echo ""

# Project-level symlinks
mkdir -p "$PROJ_DIR/.claude"
for dir in agents skills; do
  target="$PROJ_DIR/.claude/$dir"
  if [ -L "$target" ]; then
    rm "$target"
  elif [ -d "$target" ]; then
    mv "$target" "${target}.bak"
  fi
  ln -s "$TEAM_DIR/$dir" "$target"
  echo "  .claude/$dir → MuggleAI-Teams/$dir ✅"
done

# Memory symlink
MEMORY_DIR="$CLAUDE_HOME/projects/-Users-$(whoami)-muggleai/memory"
if [ -d "$MEMORY_DIR" ] && [ ! -L "$TEAM_DIR/memory" ]; then
  ln -s "$MEMORY_DIR" "$TEAM_DIR/memory"
  echo "  MuggleAI-Teams/memory → $MEMORY_DIR ✅"
fi

echo ""
echo "Setup complete! MuggleAI-Teams is now active."
echo ""
echo "Usage:"
echo "  New conversations: /MuggleAI-Teams"
echo "  Old conversations: /compact then /MuggleAI-Teams"
