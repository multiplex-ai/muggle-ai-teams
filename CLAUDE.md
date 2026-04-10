# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

muggle-ai-teams is a Claude Code plugin — an agent orchestration framework composed of markdown definitions (agents, skills, commands, rules, workflow steps) and JavaScript hooks. There is no application code, no build step, and no test suite. The deliverable is the markdown and JS files themselves.

Published as `@muggleai/teams` on npm. Part of the Muggle AI open-source ecosystem alongside `muggle-ai-works` (QA testing MCP server).

## Installation & Setup

```bash
# Option A: npm (copies files to ~/.claude/)
npm install @muggleai/teams

# Option B: git clone (symlinks to ~/.claude/)
git clone https://github.com/multiplex-ai/muggle-ai-teams.git
chmod +x muggle-ai-teams/setup.sh
./muggle-ai-teams/setup.sh
```

Both methods install `agents/`, `commands/`, `skills/`, `rules/` into `~/.claude/`. The npm path copies files; the git clone path creates symlinks so edits are reflected immediately.

After install, start with `/muggle-ai-teams` in Claude Code.

## Architecture

### Symlink System

```
muggle-ai-teams/          ← source of truth
  agents/                 ← 29 agent definitions (.md)
  commands/               ← 54 slash command definitions (.md)
  skills/                 ← 207 skill directories
  rules/                  ← 16 domain rule files (.md)
  workflow/               ← step files, procedures, references
  hooks/                  ← JS hooks + hooks.json manifest
  contexts/               ← mindset contexts for workflow steps
  projects/               ← per-project configs

~/.claude/                ← Claude Code reads from here
  agents/ → symlink       ← global
  commands/ → symlink
  skills/ → symlink
  rules/ → symlink
```

### Workflow Pipeline

The main workflow (`/muggle-ai-teams` command → `commands/muggle-ai-teams.md`) orchestrates through sequential steps, each defined in `workflow/step-*.md`:

```
1A Research → 1B Requirements → 1C Design → 1D Panel Review → 1E Approval → 1F Plan → 2 Execute → 3 Verify → 4 Review → 5 Push → 6 Learn
```

Tasks auto-triage into three tiers: **Quick** (direct execution), **Standard** (skip panel review), **Full** (all steps). The orchestrator reads only the current step file at a time.

### Project Configs

Each project declares its scopes, agents, directories, and commands in `projects/<project-name>/<project-name>.md`. Template at `projects/PROJECT-TEMPLATE.md`. The orchestrator reads this to route work to the correct specialist agent.

### Hooks System

`hooks/hooks.json` is the manifest. Hooks are JavaScript files in `hooks/` that run on Claude Code events:
- **PostToolUse**: Auto-format after JS/TS edits, typecheck after TS edits, progress reminders after agent dispatch
- **PreToolUse**: Batch completion check before git commit, doc file warnings, dispatch skill reminders
- **Stop**: Console.log detection, compact suggestions, cost tracking, session save
- **SessionStart**: Session context loading

### Rules Loading

Rules in `rules/` split into always-loaded (core.md, behavior.md, agents-routing.md, model-selection.md) and on-demand (coding.md, testing.md, git.md, etc.). This reduces base context usage.

### Agent → Model Routing

- **Opus**: Orchestrator, diagnosis, planning, architecture, code review
- **Sonnet**: Implementation (frontend/backend/general engineers), build fixes, E2E, security review, TDD
- **Haiku**: Docs lookup (Context7), doc updates

## Key Conventions

- Agent definitions are markdown files with frontmatter (`model`, `description`, `tools`). The filename minus `.md` is the agent name.
- Command definitions are markdown files where the filename minus `.md` becomes the `/slash-command` name.
- Skills are directories containing markdown files. They load on demand — zero tokens at rest.
- Workflow step files follow the naming pattern `step-{number}-{name}.md`. Reference files use `ref-*.md` and procedures use `procedure-*.md`.
- The orchestrator never writes implementation code directly — it delegates everything to sub-agents.
- Learning system: user corrections during sessions graduate to the appropriate `rules/` file, not just memory.

## Working With This Repo

When editing agent/command/skill/rule files:
- Changes are immediately reflected if installed via git clone (symlinks).
- For npm installs, users must run `npm update @muggleai/teams` to pick up changes.
- `scripts/postinstall.mjs` handles the npm install flow (copy + marker files + backups).
- `setup.sh` handles the git clone flow (symlinks + permission fixes).
- `scripts/migrate-to-new-workflow.sh` migrates users from old workflow structure.
