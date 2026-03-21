# MuggleAI-Teams

**Centralized AI Agent Team Management for Claude Code**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Agents](https://img.shields.io/badge/agents-29-green)]()
[![Skills](https://img.shields.io/badge/skills-186-orange)]()
[![Commands](https://img.shields.io/badge/commands-52-purple)]()

A single, portable folder that organizes your entire Claude Code agent team — agents, skills, commands, rules, workflows, hooks, and contexts — and evolves through usage.

Built by the team behind [MuggleTest](https://www.muggle-ai.com) (AI-powered QA testing platform). MuggleAI-Teams was battle-tested building MuggleTest across 6 sub-projects with multi-agent orchestration, and is now open-sourced for the Claude Code community.

---

## How Is This Different?

There are several excellent projects in the Claude Code ecosystem. Here's how MuggleAI-Teams compares:

| | **MuggleAI-Teams** | **[Superpowers](https://github.com/obra/superpowers)** | **[Everything Claude Code](https://github.com/affaan-m/everything-claude-code)** | **[Get Shit Done](https://github.com/gsd-build/get-shit-done)** |
|---|---|---|---|---|
| **Focus** | Team management + organization | Development workflow skills | Agent harness optimization | Context engineering |
| **Core idea** | One folder, symlinked everywhere, version-controlled | Composable skills that enforce a systematic dev process | Performance system with instincts, learning, and security | Fresh-context-per-task to prevent quality degradation |
| **Agents** | 29 specialized roles with scope-first routing | Skill-based (no standalone agents) | 28 subagents | Multi-agent orchestration via waves |
| **Skills** | 186 (merged + deduplicated) | ~15 core workflow skills | 116+ | Embedded in prompts |
| **Rules** | 16 domain-split files, loaded on demand | Via skill enforcement | Multi-language rule sets | XML-structured prompts |
| **Learning system** | Behavioral rules graduate to always-loaded files | N/A | Instinct-based with confidence scoring | N/A |
| **Portability** | `setup.sh` symlinks to any machine | Plugin install | Plugin + manual setup | Drop-in folder |
| **Multi-tool** | Claude Code + Cursor | Claude Code | Claude Code, Cursor, Codex, OpenCode | Claude Code, Gemini CLI, Codex, Copilot |

**MuggleAI-Teams doesn't replace these projects — it builds on them.** We merged the best parts of Superpowers (workflow discipline) and ECC (agents, skills, hooks) into a unified, deduplicated system, then added:

- **Project-config-driven routing** — each project declares its scopes, agents, and directories; the orchestrator bootstraps new projects automatically
- **Multi-perspective panel review** — 2-round design review with core + domain + gap panelists, SkillsMP-equipped
- **Behavioral learning system** — user corrections graduate to always-loaded rules files, not unreliable memory
- **Domain-based rule loading** — 80% reduction in always-loaded context (562 → 115 lines)
- **Hierarchical workflow** — index + on-demand step files = 100% step compliance with minimal context cost
- **Symlink architecture** — edit once in MuggleAI-Teams, available at both global and project level instantly

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

## How to Use It

### Everyday usage (no workflow needed)

After running `setup.sh`, your Claude Code sessions automatically get:

- **29 agents** dispatched based on task type (coding, review, debugging, etc.)
- **52 slash commands** — type `/plan`, `/tdd`, `/code-review`, `/build-fix` anytime
- **186 skills** loaded on demand when relevant
- **16 rules** enforcing code quality, behavioral standards, and routing decisions
- **12 hooks** running automatically (typecheck on edit, formatting, session tracking)

Just use Claude Code normally. The agents, rules, and hooks work in the background.

### Full workflow (`/MuggleAI-Teams`)

For larger features, type `/MuggleAI-Teams` to activate the 12-step orchestrated workflow:

```
Phase 1: Design (7 sub-steps)
  1A Research     → Bootstrap project config, explore codebase, search SkillsMP, pull docs
  1B Requirements → Gather requirements, map impact, identify risks
  1C Design       → Architecture proposal with brainstorming
  1D1 Panel Equip → Search SkillsMP for panelist skills, equip or create panelists
  1D2 Panel Review → 2-round multi-expert review (architecture, security, stress test, blind spots)
  1E Approval     → User sign-off + context compression
  1F Plan         → Route to agents, decide parallel/sequential, define slices + contracts

Phase 2-3: Execute & Verify
  TDD-first per slice → quality gates → local verification → full verification pass

Phase 4-5: Review & Push
  3-pass code review (quality, compliance, contract) → PR

Phase 6: Learn
  Extract learnings → graduate to rules files or CLAUDE.md (not just memory)
```

Each phase loads only its step file on demand — the full workflow is 12 step files + 3 shared procedures, but only ~50 lines sit in your context at any time.

### Key slash commands

| Command | What it does |
|---------|-------------|
| `/MuggleAI-Teams` | Full orchestrated workflow |
| `/plan` | Research + requirements + implementation plan |
| `/tdd` | Test-driven development (RED → GREEN → IMPROVE) |
| `/code-review` | 3-pass review of uncommitted changes |
| `/build-fix` | Fix build/typecheck errors incrementally |
| `/e2e` | Generate and run Playwright E2E tests |
| `/learn-eval` | Extract patterns from session → save to skills or rules |
| `/save-session` | Save session state for resumption later |
| `/docs` | Look up library docs via Context7 |

### Behavioral rules (always active)

These rules enforce how Claude works with you, loaded in every conversation:

- **Diagnose before fixing** — systematic debugging, never guess at root causes
- **Process feedback as checklist** — extract every comment into a numbered table before evaluating
- **Honest pushback** — challenge you when you're wrong, with reasoning
- **Output quality** — readable mockups, sufficient detail, no cramming

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

Organized into directories covering: AI/ML patterns, backend frameworks (Django, FastAPI, Express, Spring Boot, Laravel), frontend patterns, SEO/GEO optimization, cloud infrastructure, database migrations, testing strategies, content writing, deployment patterns, and more.

### `/rules` — 16 domain-based rule files

```
Always loaded (every conversation):
  core.md              # Universal principles, honest pushback
  behavior.md          # Debugging discipline, communication, output quality
  agents-routing.md    # Scope-first agent dispatch
  model-selection.md   # Opus/Sonnet/Haiku routing

Loaded on demand:
  coding.md            # TypeScript/React standards (when editing code)
  testing.md           # TDD, coverage gates (when editing tests)
  git.md               # Commit, branch, PR conventions
  quality-gates.md     # Pre-commit checks
  planning.md          # Research-first workflow
  context-management.md # Context window strategy
  agents-advanced.md   # Multi-agent orchestration
  security-php.md      # PHP-specific security rules
  coding-style-php.md  # PHP coding conventions
  patterns-php.md      # PHP design patterns
  hooks-php.md         # PHP hooks
  testing-php.md       # PHP testing
```

### `/workflow` — 12-step hierarchical workflow + 3 shared procedures

Only `reference.md` loads by default (~20 lines). Step files load on demand when the workflow reaches them. Shared procedures (`procedure-skillsmp-search.md`, `procedure-panelist-formats.md`) are loaded by subagents, not the orchestrator — keeping context lean.

### `/hooks` — 12 automated guards

- **PostToolUse**: Auto-format + typecheck after every file edit
- **PreToolUse**: Warn before creating documentation files
- **Stop**: Check for console.log, suggest compaction, track costs, save session
- **SessionStart**: Load session context

### `/contexts` — 3 behavioral modes

- **`dev`** — Write code first, ask questions later
- **`research`** — Read widely before concluding
- **`review`** — Check logic, security, and correctness

---

## Architecture

### Symlink system — edit once, available everywhere

```
MuggleAI-Teams/
  agents/         <- single source of truth
  commands/
  skills/
  rules/
  ...

~/.claude/
  agents/ -> MuggleAI-Teams/agents/     (global)
  commands/ -> MuggleAI-Teams/commands/
  skills/ -> MuggleAI-Teams/skills/
  rules/ -> MuggleAI-Teams/rules/

your-project/.claude/
  agents/ -> MuggleAI-Teams/agents/     (project)
  skills/ -> MuggleAI-Teams/skills/
```

### Domain-based rule loading

Instead of one massive rules file that consumes context on every conversation, rules are split by domain. Four core files (~120 lines total) load always. Everything else loads when the task requires it.

### Learning system

When you correct Claude's behavior during a project, the learning system (`/learn-eval`, Step 8) extracts the correction and graduates it to the appropriate rules file — not just memory. This means the correction is enforced in every future session automatically, without requiring Claude to actively recall it.

| Correction type | Graduates to |
|----------------|-------------|
| How to debug/fix | `rules/behavior.md` (always loaded) |
| Communication preferences | `rules/behavior.md` (always loaded) |
| Code quality expectations | `rules/core.md` (always loaded) |
| Testing/CI expectations | `rules/quality-gates.md` |
| Git conventions | `rules/git.md` |
| Technical patterns | Rules files or project `CLAUDE.md` |

### Portability

Clone on a new machine, run `setup.sh`, and your full agent team is operational.

---

## FAQ

### How is this different from just putting files in `~/.claude/`?

MuggleAI-Teams adds structure, portability, and version control. Instead of loose files accumulating in `~/.claude/`, you get an organized, git-tracked system that you can clone to any machine. The symlink architecture means you edit in one place and it works everywhere.

### Do I need to use all 186 skills?

No. Skills are loaded on demand based on what you're working on. Claude Code reads them when relevant slash commands or agent workflows reference them. Your context window stays clean.

### Will this conflict with my existing Claude Code setup?

`setup.sh` backs up your existing `~/.claude/agents/`, `~/.claude/commands/`, `~/.claude/skills/`, and `~/.claude/rules/` to `.bak` directories before creating symlinks. You can restore them by removing the symlinks and renaming the backups.

### Can I use this with Superpowers or ECC?

MuggleAI-Teams already includes merged versions of Superpowers workflow skills and ECC agents/commands. Installing them separately would create duplicates. If you want to add new skills from those projects, drop them into the MuggleAI-Teams directories and they'll be picked up automatically.

### Can I add my own agents and skills?

Yes. Add files directly to the MuggleAI-Teams directories. Since they're symlinked, Claude Code picks them up immediately. Your additions are version-controlled alongside everything else.

### Does this work with Cursor IDE too?

The agents and skills are written in Markdown and follow patterns compatible with both Claude Code and Cursor.

---

## Credits & Acknowledgments

MuggleAI-Teams stands on the shoulders of excellent open-source work:

### Core foundations

- **[everything-claude-code](https://github.com/affaan-m/everything-claude-code)** by [@affaan-m](https://github.com/affaan-m) — Source of many agents, commands, skills, and hooks that form the foundation of this collection. Anthropic hackathon winner with 28 subagents, 116+ skills, and the continuous learning system. A massive contribution to the Claude Code ecosystem.

- **[superpowers](https://github.com/obra/superpowers)** by [Jesse Vincent](https://github.com/obra) / [Prime Radiant](https://primeradiant.com) — Workflow skills including brainstorming, writing-plans, executing-plans, TDD, verification, systematic debugging, code review, and parallel dispatch patterns. The discipline backbone of our workflow.

- **[Get Shit Done](https://github.com/gsd-build/get-shit-done)** by TACHES — Context engineering and multi-agent orchestration patterns. Inspired our fresh-context-per-step approach and research-driven planning.

### Skills & integrations

- **[claude-seo](https://github.com/AgriciDaniel/claude-seo)** by [@AgriciDaniel](https://github.com/AgriciDaniel) — 12 SEO audit, planning, and optimization skills.

- **[geo-seo-claude](https://github.com/zubair-trabzada/geo-seo-claude)** by [@zubair-trabzada](https://github.com/zubair-trabzada) — 14 Generative Engine Optimization skills for AI-age search visibility.

- **[ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)** by [@nextlevelbuilder](https://github.com/nextlevelbuilder) — UI/UX design intelligence with 50+ styles, 161 color palettes, 57 font pairings, and 99 UX guidelines.

- **[SkillsMP](https://skillsmp.com/)** — Skills marketplace for discovering and sharing Claude Code skills. Used in our research workflow (Step 1A) for finding community skills relevant to each feature.

### Platform & tools

- **[Claude Code](https://claude.ai/code)** by [Anthropic](https://www.anthropic.com) — The platform that makes all of this possible.

- **[Context7](https://context7.com)** — Live documentation lookup integration used by our `docs-lookup` agent and `/docs` command.

---

## About

Built by the team behind **[MuggleTest](https://www.muggle-ai.com)** — an AI-powered QA testing platform that makes software testing accessible to everyone, no coding required. MuggleAI-Teams was created and refined while building MuggleTest, a multi-service platform spanning 6 sub-projects with frontend, backend, MCP servers, Electron apps, and documentation — all orchestrated by Claude Code agents.

---

## License

[MIT](LICENSE) — Use it, fork it, make it yours.

---

If this helps your Claude Code workflow, consider giving it a star. It helps others find it.
