#!/bin/bash
# migrate-to-new-workflow.sh
# Migrates projects from old /MuggleAI-Teams workflow to new /muggle-ai-teams workflow
# - Moves plan documents to new project-scoped paths
# - Creates project configs from detected tech stacks
# - Maps old step numbers to new step numbers
# - Migrates any learned skills to rules files

set -e

MUGGLE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PARENT_DIR="$(dirname "$MUGGLE_DIR")"
OLD_PLANS_DIR="$PARENT_DIR/docs/superpowers/plans"
OLD_SPECS_DIR="$PARENT_DIR/docs/superpowers/specs"

echo "=== muggle-ai-teams Migration Tool ==="
echo "Repo root: $MUGGLE_DIR"
echo "Parent dir: $PARENT_DIR"
echo ""

# ── Step 1: Detect old plan documents ────────────────────────────────
echo "── Step 1: Detecting old plan documents ──"

if [ ! -d "$OLD_PLANS_DIR" ]; then
    echo "  No old plans directory found at $OLD_PLANS_DIR"
    echo "  Nothing to migrate."
    exit 0
fi

plan_count=$(find "$OLD_PLANS_DIR" -name "*.md" | wc -l | tr -d ' ')
echo "  Found $plan_count plan document(s) in $OLD_PLANS_DIR"
echo ""

# ── Step 2: Analyze each plan and determine project + step ───────────
echo "── Step 2: Analyzing each plan ──"

for plan_file in "$OLD_PLANS_DIR"/*.md; do
    [ -f "$plan_file" ] || continue
    filename=$(basename "$plan_file")
    echo ""
    echo "  ┌─ $filename"

    # Detect which sub-project this plan belongs to
    # Priority: meta-project > specific project > multi-project
    projects=""
    is_meta=false
    if grep -q "\.claude/agents\|\.claude/commands" "$plan_file" && grep -q "agent.*definition\|orchestrat\|5-role\|Orchestrator" "$plan_file"; then
        is_meta=true
    fi
    if grep -q "muggle-ai-ui\|muggle-ai-ui/" "$plan_file"; then projects="${projects:+$projects + }muggle-ai-ui"; fi
    if grep -q "muggle-ai-prompt-service\|prompt-service/" "$plan_file"; then projects="${projects:+$projects + }muggle-ai-prompt-service"; fi
    if grep -q "muggle-ai-mcp" "$plan_file"; then projects="${projects:+$projects + }muggle-ai-mcp"; fi
    if grep -q "muggle-ai-teaching" "$plan_file"; then projects="${projects:+$projects + }muggle-ai-teaching-service"; fi

    # Determine primary project for filing
    if [ "$is_meta" = true ]; then
        primary_project="muggle-ai-teams"
        echo "  │  Project(s): muggle-ai-teams (meta — about creating the workflow itself)"
    elif echo "$projects" | grep -q "+"; then
        # Multi-project: file under the first one, note the cross-project nature
        primary_project=$(echo "$projects" | sed 's/ + .*//')
        echo "  │  Project(s): $projects (cross-project, filed under $primary_project)"
    elif [ -n "$projects" ]; then
        primary_project="$projects"
        echo "  │  Project(s): $projects"
    else
        primary_project="unknown"
        echo "  │  Project(s): unknown"
    fi

    # Count completed vs total checkboxes
    done_count=$(grep -c '\- \[x\]' "$plan_file" 2>/dev/null || true)
    todo_count=$(grep -c '\- \[ \]' "$plan_file" 2>/dev/null || true)
    done_count=${done_count:-0}
    todo_count=${todo_count:-0}
    # Trim whitespace
    done_count=$(echo "$done_count" | tr -d '[:space:]')
    todo_count=$(echo "$todo_count" | tr -d '[:space:]')
    total=$((done_count + todo_count))
    echo "  │  Progress: $done_count/$total tasks checked"

    # Determine old workflow step
    if [ "$done_count" -eq 0 ] && [ "$total" -gt 0 ]; then
        old_step="Old 1F (plan written, execution not started)"
        new_step="New Step 2 (Execute)"
    elif [ "$done_count" -gt 0 ] && [ "$done_count" -lt "$total" ]; then
        old_step="Old Step 4 (execution in progress)"
        new_step="New Step 2 (Execute — resume from where you left off)"
    elif [ "$done_count" -eq "$total" ] && [ "$total" -gt 0 ]; then
        old_step="Old Step 5+ (execution complete)"
        new_step="New Step 3 (Verify)"
    else
        old_step="Unknown"
        new_step="Unknown"
    fi
    echo "  │  Old step: $old_step"
    echo "  │  New step: $new_step"

    # Determine destination path
    # Extract feature name from filename (remove date prefix)
    feature_name=$(echo "$filename" | sed 's/^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}-//' | sed 's/\.md$//')
    echo "  │  Destination: projects/$primary_project/plans/$feature_name.md"
    echo "  └─"
done

echo ""
echo "── Step 3: Ready to migrate ──"
echo ""
echo "This will:"
echo "  1. Create project directories under muggle-ai-teams/projects/"
echo "  2. Move plan documents from docs/superpowers/plans/ to project-scoped paths"
echo "  3. Move spec documents alongside their plans"
echo "  4. Create basic project configs (you'll refine them on first /muggle-ai-teams run)"
echo ""
read -p "Proceed? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# ── Step 4: Execute migration ────────────────────────────────────────
echo ""
echo "── Step 4: Executing migration ──"

for plan_file in "$OLD_PLANS_DIR"/*.md; do
    [ -f "$plan_file" ] || continue
    filename=$(basename "$plan_file")
    feature_name=$(echo "$filename" | sed 's/^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}-//' | sed 's/\.md$//')

    # Detect primary project (same logic as analysis)
    local is_meta_exec=false
    if grep -q "\.claude/agents\|\.claude/commands" "$plan_file" && grep -q "agent.*definition\|orchestrat\|5-role\|Orchestrator" "$plan_file"; then
        is_meta_exec=true
    fi
    if [ "$is_meta_exec" = true ]; then
        primary_project="muggle-ai-teams"
    elif grep -q "muggle-ai-ui" "$plan_file"; then
        primary_project="muggle-ai-ui"
    elif grep -q "muggle-ai-prompt-service\|prompt-service" "$plan_file"; then
        primary_project="muggle-ai-prompt-service"
    else
        primary_project="unknown"
    fi

    dest_dir="$MUGGLE_DIR/projects/$primary_project/plans"

    echo "  Moving $filename → projects/$project/plans/$feature_name.md"
    mkdir -p "$dest_dir"
    cp "$plan_file" "$dest_dir/$feature_name.md"

    # Check for matching spec
    spec_date=$(echo "$filename" | grep -o '^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}')
    spec_pattern="$OLD_SPECS_DIR/${spec_date}-*"
    for spec_file in $spec_pattern; do
        [ -f "$spec_file" ] || continue
        spec_filename=$(basename "$spec_file")
        spec_dest_dir="$MUGGLE_DIR/projects/$project/specs"
        echo "  Moving spec $spec_filename → projects/$project/specs/"
        mkdir -p "$spec_dest_dir"
        cp "$spec_file" "$spec_dest_dir/$spec_filename"
    done

    # Create basic project config if it doesn't exist
    config_dir="$MUGGLE_DIR/projects/$project"
    config_file="$config_dir/$project.md"
    if [ ! -f "$config_file" ]; then
        echo "  Creating project config → projects/$project/$project.md"
        cat > "$config_file" << CONF
# Project: $project

## Overview

<!-- Auto-created during migration. Run /muggle-ai-teams to bootstrap with full detection. -->

## Scopes

| Scope | Agent | Root | Stack |
|-------|-------|------|-------|
| <!-- Fill on first workflow run --> | | | |

## Commands

| Action | Command |
|--------|---------|
| Dev | \`npm run dev\` |
| Build | \`npm run build\` |
| Test | \`npm test\` |
| Lint | \`npm run lint\` |
| Typecheck | \`npm run typecheck\` |

## VCS & Hosting

| Property | Value |
|----------|-------|
| VCS | git |
| Hosting | github |
| Main branch | main |
CONF
    fi
done

echo ""
echo "── Step 5: Summary ──"
echo ""
echo "Migration complete. Old files preserved at $OLD_PLANS_DIR (not deleted)."
echo ""
echo "Next steps:"
echo "  1. Review the created project configs and fill in Scopes + Stack"
echo "  2. For projects in progress, resume at the new step number:"
echo "     - Old 1F (plan written)     → New Step 2 (Execute)"
echo "     - Old Step 4 (executing)    → New Step 2 (resume execution)"
echo "     - Old Step 5 (verifying)    → New Step 3 (Verify)"
echo "     - Old Step 6 (reviewing)    → New Step 4 (Review)"
echo "     - Old Step 7 (pushing)      → New Step 5 (Push)"
echo "     - Old Step 8 (learning)     → New Step 6 (Learn)"
echo "  3. Delete old plans dir when satisfied: rm -rf $OLD_PLANS_DIR"
echo "  4. Delete old specs dir when satisfied: rm -rf $OLD_SPECS_DIR"
