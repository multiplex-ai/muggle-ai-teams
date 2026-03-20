# MuggleAI-Teams

**Centralized AI Agent Team Management for Claude Code**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Agents](https://img.shields.io/badge/agents-29-green)]()
[![Skills](https://img.shields.io/badge/skills-186-orange)]()
[![Commands](https://img.shields.io/badge/commands-52-purple)]()

A single, portable folder that organizes your entire Claude Code agent team — agents, skills, commands, rules, workflows, hooks, and contexts — and evolves through usage.

Built by the team behind [MuggleTest](https://www.muggle-ai.com) (AI-powered QA testing platform). MuggleAI-Teams was battle-tested building MuggleTest across 6 sub-projects with multi-agent orchestration, and is now open-sourced for the Claude Code community.

---

## What Is MuggleAI-Teams?

MuggleAI-Teams is a centralized management system for Claude Code agents, skills, and workflows. Instead of scattering configuration across `~/.claude/`, project `.claude/` folders, and random dotfiles, everything lives in one directory with symlinks connecting it all.

**The problem:** Claude Code's agent ecosystem grows fast. You end up with dozens of agents, hundreds of skills, project-specific rules, and no way to keep them organized or portable across machines.

**The solution:** One folder. One `setup.sh`. Everything symlinked, version-controlled, and structured so Claude Code loads only what it needs.

### Key numbers

| Component | Count | Description |
|-----------|-------|-------------|
| Agents | 29 | Specialized roles from architect to security-reviewer |
| Commands | 52 | Slash commands for every workflow (`/tdd`, `/plan`, `/e2e`, `/code-review`) |
| Skills | 186 | Domain expertise from SEO to Django to Rust testing |
| Rules | 15 | Domain-based rule files loaded on demand |
| Workflow steps | 14 | Hierarchical workflow from research to learning |
| Context modes | 3 | `dev`, `research`, `review` — switch what Claude knows |
| Hooks | 12 | Automated guards (typecheck on edit, doc-file warnings) |

---

## Quick Start

```bash
# Clone into your project root
cd ~/your-project
git clone https://github.com/multiplex-ai/MuggleAI-Teams.git

# Run setup (creates symlinks, backs up existing configs)
chmod +x MuggleAI-Teams/setup.sh
./MuggleAI-Teams/setup.sh

# Start using it
# In Claude Code, type: /MuggleAI-Teams
```

**What `setup.sh` does:**

1. Symlinks `agents/`, `commands/`, `skills/`, `rules/` into `~/.claude/` (global)
2. Symlinks `agents/`, `skills/` into `.claude/` (project-level)
3. Links memory to Claude's persistent memory directory
4. Backs up any existing directories before overwriting

No dependencies. No build step. Works on macOS and Linux.

---

## What's Inside

### `/agents` — 29 specialized roles

| Category | Agents |
|----------|--------|
| **Core engineering** | `frontend-engineer`, `backend-engineer`, `general-engineer` |
| **Planning & design** | `planner`, `architect`, `chief-of-staff` |
| **Quality** | `reviewer`, `ux-reviewer`, `security-reviewer`, `tdd-guide`, `e2e-runner` |
| **Build & maintenance** | `build-error-resolver`, `refactor-cleaner`, `doc-updater`, `docs-lookup` |
| **Language-specific** | `cpp-reviewer`, `go-reviewer`, `java-reviewer`, `kotlin-reviewer`, `python-reviewer`, `rust-reviewer` + matching build-resolvers |
| **Operations** | `loop-operator`, `harness-optimizer`, `database-reviewer` |

### `/commands` — 52 slash commands

Development: `/plan`, `/tdd`, `/code-review`, `/build-fix`, `/e2e`, `/verify`, `/quality-gate`

Language-specific: `/cpp-build`, `/go-test`, `/rust-review`, `/kotlin-build`, `/python-review`

Session management: `/save-session`, `/resume-session`, `/sessions`, `/checkpoint`

Skills & learning: `/learn`, `/learn-eval`, `/evolve`, `/skill-create`, `/skill-health`

Operations: `/loop-start`, `/loop-status`, `/devfleet`, `/multi-execute`, `/model-route`

### `/skills` — 186 domain skills

Organized into directories covering: AI/ML patterns, backend frameworks (Django, FastAPI, Express), frontend patterns, SEO/GEO optimization, cloud infrastructure, database migrations, testing strategies, content writing, deployment patterns, and more.

### `/rules` — 15 domain-based rule files

```
core.md                 # Always loaded — minimal footprint
coding.md               # Coding standards
git.md                  # Commit, branch, PR conventions
planning.md             # Research-first workflow
testing.md              # TDD, coverage gates
quality-gates.md        # Pre-commit checks
agents-routing.md       # Which agent handles what
agents-advanced.md      # Multi-agent orchestration
model-selection.md      # Opus/Sonnet/Haiku routing
context-management.md   # Context window strategy
security-php.md         # PHP-specific security rules
coding-style-php.md     # PHP coding conventions
patterns-php.md         # PHP design patterns
hooks-php.md            # PHP hooks
testing-php.md          # PHP testing
```

**Why domain-based rules?** Claude Code loads `~/.claude/rules/` on every conversation start. Splitting from one monolithic file into 15 domain files achieved an **80% reduction in always-loaded context** (562 to 115 lines in `core.md`). Rules are loaded on demand based on the task.

### `/workflow` — 14-step hierarchical workflow

```
reference.md            # Index file — always loaded, routes to steps
step-1a-research.md     # Research & reuse (mandatory)
step-1b-requirements.md # Requirements gathering
step-1c-design.md       # Design & architecture
step-1d-panel-review.md # Multi-perspective panel review
step-1e-approval.md     # User approval gate
step-1f-plan.md         # Implementation plan
step-2-routing.md       # Agent routing & dispatch
step-3-parallel.md      # Parallel task execution
step-4-execute.md       # Implementation
step-5-verify.md        # Verification & testing
step-6-review.md        # Code review
step-7-push.md          # Git operations
step-8-learn.md         # Retrospective & learning
```

Only `reference.md` loads by default. Step files load on demand, keeping the context window clean.

### `/contexts` — 3 modes

- **`dev`** — Full development context (agents, skills, commands active)
- **`research`** — Research-focused (documentation, web search, analysis)
- **`review`** — Code review context (reviewer agents, quality gates)

### `/hooks` — 12 automated guards

Post-edit typechecking, documentation file warnings, and utility libraries for package management, formatting, and hook state.

### `/projects` — 7 project configurations

Pre-configured contexts for specific sub-projects: `muggle-ai-ui`, `muggle-ai-prompt-service`, `muggle-ai-mcp`, `muggle-ai-teaching-service`, `muggle-ai-docs`, plus shared `environment.md` and `external-services.md`.

---

## Architecture

### Symlink system — edit once, available everywhere

```
MuggleAI-Teams/
  agents/         ← single source of truth
  commands/
  skills/
  rules/
  ...

~/.claude/
  agents/ → MuggleAI-Teams/agents/     (global)
  commands/ → MuggleAI-Teams/commands/
  skills/ → MuggleAI-Teams/skills/
  rules/ → MuggleAI-Teams/rules/

your-project/.claude/
  agents/ → MuggleAI-Teams/agents/     (project)
  skills/ → MuggleAI-Teams/skills/
```

Edit a file in `MuggleAI-Teams/` and it's instantly available at both global and project level. No copying, no syncing.

### Domain-based rule loading

Instead of one massive rules file that consumes context on every conversation, rules are split by domain. `core.md` (115 lines) loads always. Everything else loads when the task requires it — coding rules load when you code, git rules load when you commit, testing rules load when you test.

### Hierarchical workflow

The workflow uses an index + on-demand pattern. `reference.md` is a lightweight routing file that tells Claude which step file to load next. This achieved **100% workflow compliance** — no steps get skipped because the index enforces the sequence.

### Portability

The entire `MuggleAI-Teams/` folder is self-contained and version-controlled. Clone it on a new machine, run `setup.sh`, and your full agent team is operational. Memory links to Claude's persistent storage, so context carries over.

---

## FAQ

### How is this different from just putting files in `~/.claude/`?

MuggleAI-Teams adds structure, portability, and version control. Instead of loose files accumulating in `~/.claude/`, you get an organized, git-tracked system that you can clone to any machine. The symlink architecture means you edit in one place and it works everywhere.

### Do I need to use all 186 skills?

No. Skills are loaded on demand based on what you're working on. Claude Code reads them when relevant slash commands or agent workflows reference them. Your context window stays clean.

### Will this conflict with my existing Claude Code setup?

`setup.sh` backs up your existing `~/.claude/agents/`, `~/.claude/commands/`, `~/.claude/skills/`, and `~/.claude/rules/` to `.bak` directories before creating symlinks. You can restore them by removing the symlinks and renaming the backups.

### What version of Claude Code does this work with?

MuggleAI-Teams works with Claude Code's current agent, command, and skill system. The file structure follows Claude Code's conventions — `.md` files in the expected directories with the expected naming patterns.

### Can I add my own agents and skills?

Yes. Add files directly to the MuggleAI-Teams directories. Since they're symlinked, Claude Code picks them up immediately. Your additions are version-controlled alongside everything else.

### Does this work with Cursor IDE too?

The agents and skills are written in Markdown and follow patterns compatible with both Claude Code and Cursor. The `scripts/sync-agents.sh` script helps synchronize agent definitions between both environments.

---

## Credits & Acknowledgments

MuggleAI-Teams stands on the shoulders of excellent open-source work:

- **[everything-claude-code](https://github.com/affaan-m/everything-claude-code)** by [@affaanmustafa](https://github.com/affaan-m) — Source of many agents, commands, skills, and hooks that form the foundation of this collection. A massive contribution to the Claude Code ecosystem.

- **[superpowers](https://github.com/obra/superpowers)** by [@obra](https://github.com/obra) — Workflow skills including brainstorming, writing-plans, executing-plans, TDD, verification, debugging, code review, and parallel dispatch patterns.

- **[claude-seo](https://github.com/search?q=claude-seo) & [geo-seo-claude](https://github.com/search?q=geo-seo-claude)** — SEO and GEO optimization skills for AI-age search visibility.

- **[Claude Code](https://claude.ai/code)** by [Anthropic](https://www.anthropic.com) — The platform that makes all of this possible.

- **[Context7](https://context7.com)** — Live documentation lookup integration.

---

## About

Built by the team behind **[MuggleTest](https://www.muggle-ai.com)** — an AI-powered QA testing platform. MuggleAI-Teams was created and refined while building MuggleTest, a multi-service platform spanning 6 sub-projects with frontend, backend, MCP servers, Electron apps, and documentation — all orchestrated by Claude Code agents.

---

## License

[MIT](LICENSE) — Use it, fork it, make it yours.

---

If this helps your Claude Code workflow, consider giving it a star. It helps others find it.
