# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

muggle-ai-teams is a Claude Code and Codex plugin — an agent orchestration framework composed of markdown definitions (agents, skills, commands, rules, workflow steps) and JavaScript hooks. There is no application code and no build step. The deliverable is the markdown and JS files themselves, plus the Codex files generated from them (see [Codex](#codex)); `npm test` holds both hosts to them.

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

Codex installs it as a plugin instead: `codex plugin marketplace add multiplex-ai/muggle-ai-teams`, then `codex plugin add muggle-ai-teams@muggle-ai-teams`, and starts with `$muggle-ai-teams:muggle-ai-teams`.

## Architecture

### Symlink System

```
muggle-ai-teams/          ← source of truth
  agents/                 ← 29 agent definitions (.md)
  commands/               ← 55 slash command definitions (.md)
  skills/                 ← 174 skill directories
  rules/                  ← 17 domain rule files (.md)
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

`hooks/hooks.json` is the manifest. Hooks are JavaScript files in `hooks/` that run on Claude Code and Codex events:
- **PostToolUse**: Auto-format after JS/TS edits, typecheck after TS edits, progress reminders after agent dispatch
- **PreToolUse**: Batch completion check before git commit, doc file warnings, dispatch skill reminders
- **Stop**: Console.log detection, compact suggestions, cost tracking, session save
- **SessionStart**: Session context loading — under Codex, also the always-on rules

Write every hook for both hosts, through `hooks/lib/host-compat.js`:
- Matchers are tool names (`Edit|Write|MultiEdit`, `Bash`); a script filters by file or command itself. Neither host reads an expression matcher.
- Read the files a call writes with `writtenFilePaths`, which knows Codex's `apply_patch`, and what a read names with `readTarget`, since Codex reads files through the shell.
- Give the model text with `emitContext` (PreToolUse/PostToolUse) and the user with `emitSystemMessage`. Neither host gives stderr to the model, and Codex rejects any other JSON — never echo the payload back.
- Timeouts are in seconds.

### Rules & Model Routing

User-facing rules live in `rules/*.md`, symlinked to `~/.claude/rules/` so they load globally on every session. Topics are sharded by file (behavior, core, git, planning, etc.) — see `rules/` for the current set.

Agent → model routing (Opus / Sonnet / Haiku assignments per role) lives in `rules/model-selection.md` — that file is authoritative; do not duplicate the table here.

## Key Conventions

- Agent definitions are markdown files with frontmatter (`model`, `description`, `tools`). The filename minus `.md` is the agent name.
- Command definitions are markdown files where the filename minus `.md` becomes the `/slash-command` name.
- Skills are directories containing markdown files. They load on demand — zero tokens at rest in Claude Code; Codex lists each one's name and a shortened description.
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
- Run `npm test` before pushing. The live Codex tests run when `CODEX_BIN` points at a Codex CLI (`@openai/codex`'s `bin/codex.js`); CI runs them on Linux, Windows and macOS.

## Codex

The Codex plugin is the same tree, described by `.codex-plugin/plugin.json` and listed by `.agents/plugins/marketplace.json`. Two parts of it are generated by `scripts/build-codex-plugin.mjs` and committed — never edit them by hand:
- `codex/command-skills/<command>/` — one user-typed skill per command, since Codex has no plugin slash commands.
- `hooks/codex-hooks.json` — `hooks/hooks.json` with each matcher renamed to the Codex tools that play its part.

After changing `commands/` or `hooks/hooks.json`, run `npm run build:codex` and commit the result; `npm test` fails until you do. `codex/host-tool-equivalents.md` maps the Claude Code tools the instructions name to Codex's — add a row when the instructions come to depend on another.
