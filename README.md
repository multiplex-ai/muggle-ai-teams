# muggle-ai-teams

**Centralized AI Agent Team Management for Claude Code**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Agents](https://img.shields.io/badge/agents-29-green)]()
[![Skills](https://img.shields.io/badge/skills-186-orange)]()
[![Commands](https://img.shields.io/badge/commands-52-purple)]()

A single, portable folder that organizes your entire Claude Code agent team — agents, skills, commands, rules, workflows, hooks, and contexts — and evolves through usage.

Built by the team behind [MuggleTest](https://www.muggle-ai.com) (AI-powered QA testing platform). muggle-ai-teams was battle-tested building MuggleTest across 6 sub-projects with multi-agent orchestration, and is now open-sourced for the Claude Code community.

---

## How Is This Different?

There are several excellent projects in the Claude Code ecosystem. Here's how muggle-ai-teams compares:

| | **muggle-ai-teams** | **[Superpowers](https://github.com/obra/superpowers)** | **[Everything Claude Code](https://github.com/affaan-m/everything-claude-code)** | **[Get Shit Done](https://github.com/gsd-build/get-shit-done)** |
|---|---|---|---|---|
| **Focus** | Team management + organization | Development workflow skills | Agent harness optimization | Context engineering |
| **Core idea** | One folder, symlinked everywhere, version-controlled | Composable skills that enforce a systematic dev process | Performance system with instincts, learning, and security | Fresh-context-per-task to prevent quality degradation |
| **Agents** | 29 specialized roles with scope-first routing | Skill-based (no standalone agents) | 28 subagents | Multi-agent orchestration via waves |
| **Skills** | 186 (merged + deduplicated) | ~15 core workflow skills | 116+ | Embedded in prompts |
| **Rules** | 16 domain-split files, loaded on demand | Via skill enforcement | Multi-language rule sets | XML-structured prompts |
| **Learning system** | Behavioral rules graduate to always-loaded files | N/A | Instinct-based with confidence scoring | N/A |
| **Portability** | `setup.sh` symlinks to any machine | Plugin install | Plugin + manual setup | Drop-in folder |
| **Multi-tool** | Claude Code + Cursor | Claude Code | Claude Code, Cursor, Codex, OpenCode | Claude Code, Gemini CLI, Codex, Copilot |

**muggle-ai-teams doesn't replace these projects — it builds on them.** We merged the best parts of Superpowers (workflow discipline) and ECC (agents, skills, hooks) into a unified, deduplicated system, then added:

- **Project-config-driven routing** — each project declares its scopes, agents, and directories; the orchestrator bootstraps new projects automatically
- **Multi-perspective panel review** — 2-round design review with core + domain + gap panelists, SkillsMP-equipped
- **Behavioral learning system** — user corrections graduate to always-loaded rules files, not unreliable memory
- **Domain-based rule loading** — 80% reduction in always-loaded context (562 → 115 lines)
- **Hierarchical workflow** — index + on-demand step files = 100% step compliance with minimal context cost
- **Symlink architecture** — edit once in muggle-ai-teams, available at both global and project level instantly

---

## Quick Start

```bash
# Clone into your project root
cd ~/your-project
git clone https://github.com/multiplex-ai/muggle-ai-teams.git

# Run setup (creates symlinks, backs up existing configs)
chmod +x muggle-ai-teams/setup.sh
./muggle-ai-teams/setup.sh

# Start using it
# In Claude Code, type: /muggle-ai-teams
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

### Full workflow (`/muggle-ai-teams`)

For larger features, type `/muggle-ai-teams`. You describe what you want. The orchestrator handles the rest.

**Here's what happens when you say "Add Stripe billing to my app":**

```mermaid
flowchart LR
    You["You: describe\nwhat you want"] --> Design
    Design["1A-1F: Research\nDesign → Panel Review\nYou approve"] --> Build
    Build["Step 2-5: TDD per slice\nQuality gates\nCode review → PR"] --> Learn
    Learn["Step 6: Graduate\nlearnings to rules"]

    style You fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
    style Design fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
    style Build fill:#fff3e0,stroke:#ef6c00,color:#e65100
    style Learn fill:#f3e5f5,stroke:#7b1fa2,color:#4a148c
```

**What happens inside each phase:**

| Phase | Steps | What the orchestrator does | What you do |
|-------|-------|---------------------------|-------------|
| **Design** | 1A-1F | Scans repo, detects stack, researches industry practices, proposes architecture, searches SkillsMP for panelist skills, dispatches 6+ expert reviewers in parallel, resolves all findings, defines implementation slices | Answer 2-3 questions, confirm reviewers, approve design |
| **Build** | 2-5 | TDD per slice (tests first → implement → quality gates), scope checks, contract checks, 3-pass code review, push + PR | Test each slice locally, confirm PR |
| **Learn** | 6 | Extracts what worked, graduates corrections to rules files so they apply to ALL future sessions | Nothing — automatic |

Each step loads on demand — only ~50 lines in your context at any time, not the full 1500-line workflow.

### Key slash commands

| Command | What it does |
|---------|-------------|
| `/muggle-ai-teams` | Full orchestrated workflow |
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

### `/workflow` — 12 step files + 3 shared procedures

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
muggle-ai-teams/
  agents/         <- single source of truth
  commands/
  skills/
  rules/
  ...

~/.claude/
  agents/ -> muggle-ai-teams/agents/     (global)
  commands/ -> muggle-ai-teams/commands/
  skills/ -> muggle-ai-teams/skills/
  rules/ -> muggle-ai-teams/rules/

your-project/.claude/
  agents/ -> muggle-ai-teams/agents/     (project)
  skills/ -> muggle-ai-teams/skills/
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

### "I already have files in `~/.claude/`. Will this blow them away?"

No. `setup.sh` backs up your existing `agents/`, `commands/`, `skills/`, and `rules/` to `.bak` directories before creating symlinks. To undo: remove the symlinks, rename the backups. Your original setup is preserved.

### "186 skills sounds like it'll eat my entire context window."

Skills load on demand — Claude Code reads them only when a matching task triggers them. At rest, zero skill tokens are in your context. During a workflow run, only the current step file (~50 lines) is loaded.

### "I already use Superpowers / Everything Claude Code. Do I install both?"

No. muggle-ai-teams already includes merged, deduplicated versions of both. Installing them separately creates conflicts. If those projects release new skills you want, drop the files into the muggle-ai-teams directories — they'll be picked up automatically.

### "Can I add my own agents and skills?"

Yes. Add files directly to `muggle-ai-teams/agents/` or `muggle-ai-teams/skills/`. Since they're symlinked to `~/.claude/`, Claude Code picks them up immediately. Your additions are version-controlled alongside everything else.

### "Does the full workflow run every time, even for a small bug fix?"

No. The workflow is for larger features. For quick tasks, just use Claude Code normally — the agents, rules, and slash commands (`/plan`, `/tdd`, `/code-review`, `/build-fix`) work without invoking the full workflow.

### "Does this work with Cursor?"

The agents and skills are Markdown files compatible with both Claude Code and Cursor. The `.mdc` rule files at the repo root are Cursor-native.

### "What if I'm mid-project on the old workflow and want to switch?"

Run `scripts/migrate-to-new-workflow.sh`. It detects your existing plans, maps them to the new step numbers, and moves them to the new project-scoped paths. You resume where you left off.

---

## Credits & Acknowledgments

muggle-ai-teams stands on the shoulders of excellent open-source work:

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

Built by the team behind **[MuggleTest](https://www.muggle-ai.com)** — an AI-powered QA testing platform that makes software testing accessible to everyone, no coding required. muggle-ai-teams was created and refined while building MuggleTest, a multi-service platform spanning 6 sub-projects with frontend, backend, MCP servers, Electron apps, and documentation — all orchestrated by Claude Code agents.

---

## License

[MIT](LICENSE) — Use it, fork it, make it yours.

---

If this helps your Claude Code workflow, consider giving it a star. It helps others find it.
