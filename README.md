# muggle-ai-teams

**AI workflow for Claude Code — describe what you want, get production-grade results.**

Code, content, design, planning — the workflow researches, designs, builds, tests, reviews, and ships. You describe and approve.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Part of the [Muggle AI](https://www.muggletest.com) open-source ecosystem. Built while developing [MuggleTest](https://www.muggletest.com) — an AI-powered QA testing platform.

---

## Why use muggle-ai-teams?

muggle-ai-teams is an AI agent orchestration workflow for Claude Code. You describe your task in plain English, approve the design, and the workflow handles everything else — research, implementation, testing, and review.

**Low effort.** Describe your task in plain English. Approve the design. That's it. The workflow handles research, implementation, testing, and code review without additional input from you.

**High quality.** Every output goes through research, specialist design, test-driven development, automated QA, and 3-pass code review. The same process that catches bugs in production code runs on every task.

**Transparent cost.** You see the estimate before work begins.

| Task type | Estimated cost |
|-----------|---------------|
| Quick fix, config change, typo | $0.50 – $2 |
| Standard feature, refactor, content | $5 – $20 |
| Complex project, architecture, multi-service | $50 – $100+ |

Works for any task:

- "Optimize my README for SEO" — content
- "Add a logout button to the header" — code
- "Build an investor pitch deck" — non-coding
- "Plan a product launch" — strategy

Battle-tested building [MuggleTest](https://www.muggletest.com) — an [AI-powered QA testing platform](https://www.muggletest.com) — across 6 production services.

---

## Quick Start

### Option A: npm install (recommended)

```bash
npm install @muggleai/teams
```

Update to latest: `npm update @muggleai/teams`

### Option B: Git clone (for contributors)

```bash
git clone https://github.com/multiplex-ai/muggle-ai-teams.git
chmod +x muggle-ai-teams/setup.sh
./muggle-ai-teams/setup.sh
```

After installing, open Claude Code and type `/muggle-ai-teams`. Describe what you want.

<details>
<summary>What does install actually do?</summary>

Both methods install `agents/`, `commands/`, `skills/`, and `rules/` into `~/.claude/` (global) and back up any existing directories before overwriting.

- npm install copies files; update with `npm update @muggleai/teams`
- git clone creates symlinks so edits in the repo are reflected immediately

No build step required. Works on macOS and Linux.
</details>

---

## How does it work?

muggle-ai-teams is a `claude code agents` workflow that routes each task to the right tier, dispatches specialist agents, and enforces quality gates at every step.

**The workflow adapts to task complexity automatically:**

| Tier | Cost | What happens |
|------|------|-------------|
| Quick | $0.50 – $2 | Direct execution — done in minutes |
| Standard | $5 – $20 | Research → design → build → test → review → ship |
| Full | $50 – $100+ | Everything above, plus expert panel review and regression sweep |

```
You describe what you want
       ↓
Quick? → Done in minutes.
       ↓
Research → Design → Build → Test → Review → Ship
```

The workflow triages complexity, recommends a tier, and waits for your confirmation before writing any code.

**Works for non-coding tasks too.** Say "build me an investor pitch deck" and the same workflow runs — specialists design the structure, execute section by section, review for quality, and deliver the final output. This is a genuine differentiator: most `claude code workflow` tools are built exclusively for code.

<details>
<summary>What happens inside each step?</summary>

**Research** — finds relevant code, docs, and community patterns. Reads your project config, scans affected code areas, and searches for skills relevant to the task.

**Requirements** — restates what "done" looks like. Extracts acceptance criteria from your description and produces explicit scope boundaries (what's in, what's out).

**Design** — specialist agents draft the approach. Routes to the right specialist (frontend, backend, architect) based on your project config. Includes mockups for UI work.

**Expert panel review** (Full tier only) — multiple specialists review the design in parallel and synthesize findings into a verdict.

**Approval** — you confirm before any code is written. No implementation starts until this gate passes.

**Plan** — breaks the work into slices, each with files to touch, test instructions, and completion criteria. Independent slices run in parallel.

**Build** — test-driven development with per-slice QA. Each slice follows TDD (test first, then implement). After each slice passes locally, it's tested against your running app via [muggle-ai-works](https://github.com/multiplex-ai/muggle-ai-works).

**Verify + Review** — quality gates and 3-pass code review. Typecheck, lint, full test suite, then code review covering quality, compliance, and contracts. Findings are fixed before proceeding.

**Ship** — PR created with description and test plan. QA results are published and linked in the PR.

**Learn** — extracts behavioral corrections from the session and writes them to the appropriate rules file so the same issue does not recur.
</details>

**Real examples:**

- "Add dark mode" → Standard → PR with tests, $8
- "Optimize this README" → Standard → rewritten file, $6
- "Investor pitch deck" → Standard → polished deck, $12
- "Migrate auth to OAuth 2.0" → Full → multi-file refactor with regression sweep, $65

### Key slash commands

| Command | What it does |
|---------|-------------|
| `/muggle-ai-teams` | Full orchestrated workflow |
| `/plan` | Research + requirements + implementation plan |
| `/tdd` | Test-driven development (RED → GREEN → IMPROVE) |
| `/code-review` | 3-pass review of uncommitted changes |
| `/build-fix` | Fix build/typecheck errors incrementally |
| `/e2e` | Generate and run Playwright E2E tests |
| `/learn-eval` | Extract patterns from session and save to skills or rules |
| `/save-session` | Save session state for resumption later |
| `/docs` | Look up library docs via Context7 |

---

## How is muggle-ai-teams different?

<details>
<summary>How muggle-ai-teams compares to Superpowers, Everything Claude Code, and Get Shit Done</summary>

| | **muggle-ai-teams** | **[Superpowers](https://github.com/obra/superpowers)** | **[Everything Claude Code](https://github.com/affaan-m/everything-claude-code)** | **[Get Shit Done](https://github.com/gsd-build/get-shit-done)** |
|---|---|---|---|---|
| **Focus** | End-to-end workflow with cost tiers | Development workflow skills | Agent harness optimization | Context engineering |
| **Core idea** | Describe task → approved design → autonomous delivery | Composable skills enforcing systematic dev process | Performance system with instincts, learning, and security | Fresh context per task to prevent quality degradation |
| **Agents** | 29 specialized roles with scope-first routing | Skill-based (no standalone agents) | 28 subagents | Multi-agent orchestration via waves |
| **Skills** | 207 (merged + deduplicated) | ~15 core workflow skills | 116+ | Embedded in prompts |
| **Rules** | 16 domain-split files, loaded on demand | Via skill enforcement | Multi-language rule sets | XML-structured prompts |
| **Learning system** | Behavioral corrections graduate to always-loaded rules | N/A | Instinct-based with confidence scoring | N/A |
| **Portability** | `setup.sh` symlinks to any machine | Plugin install | Plugin + manual setup | Drop-in folder |
| **Multi-tool** | Claude Code (full), Cursor (partial) | Claude Code | Claude Code, Cursor, Codex, OpenCode | Claude Code, Gemini CLI, Codex, Copilot |
| **Non-coding tasks** | Yes — same workflow for content, strategy, decks | No | No | Partial |

</details>

muggle-ai-teams does not replace these projects — it builds on them. We merged the best parts of Superpowers (workflow discipline) and Everything Claude Code (agents, skills, hooks) into a unified, deduplicated system, then added:

- **Project-config-driven routing** — each project declares its scopes, agents, and directories; the workflow bootstraps new projects automatically
- **Cost tiers with upfront estimates** — Quick/Standard/Full with realistic dollar ranges you see before work starts
- **Behavioral learning system** — your corrections graduate to always-loaded rules files, not unreliable memory
- **Domain-based rule loading** — 80% reduction in always-loaded context
- **Non-coding task support** — content, strategy, and design tasks use the same orchestrated workflow

---

## Under the hood

The workflow coordinates specialist `claude code agents`, enforces quality gates automatically, and learns from your corrections over time. Every session improves the next one.

<details>
<summary>Agents (29 specialized roles)</summary>

| Category | Agents |
|----------|--------|
| **Core engineering** | `frontend-engineer`, `backend-engineer`, `general-engineer` |
| **Planning & design** | `planner`, `architect`, `chief-of-staff` |
| **Quality** | `reviewer`, `ux-reviewer`, `security-reviewer`, `tdd-guide`, `e2e-runner` |
| **Build & maintenance** | `build-error-resolver`, `refactor-cleaner`, `doc-updater`, `docs-lookup` |
| **Language-specific** | `cpp-reviewer`, `go-reviewer`, `java-reviewer`, `kotlin-reviewer`, `python-reviewer`, `rust-reviewer` + matching build-resolvers |
| **Operations** | `loop-operator`, `harness-optimizer`, `database-reviewer` |

</details>

<details>
<summary>Commands (54 slash commands)</summary>

Development: `/plan`, `/tdd`, `/code-review`, `/build-fix`, `/e2e`, `/verify`, `/quality-gate`

Language-specific: `/cpp-build`, `/go-test`, `/rust-review`, `/kotlin-build`, `/python-review`

Session management: `/save-session`, `/resume-session`, `/sessions`, `/checkpoint`

Skills & learning: `/learn`, `/learn-eval`, `/evolve`, `/skill-create`, `/skill-health`

Operations: `/loop-start`, `/loop-status`, `/devfleet`, `/multi-execute`, `/model-route`

</details>

<details>
<summary>Skills (207 domain skills)</summary>

Organized into directories covering: AI/ML patterns, backend frameworks (Django, FastAPI, Express, Spring Boot, Laravel), frontend patterns, SEO/GEO optimization, cloud infrastructure, database migrations, testing strategies, content writing, deployment patterns, and more.

Skills load on demand — zero skill tokens in context at rest. Only the current step file (~50 lines) loads during a workflow run.

</details>

<details>
<summary>Rules (16 domain files)</summary>

```
Always loaded (every conversation):
  core.md              # Universal principles, honest pushback
  behavior.md          # Debugging discipline, communication, output quality
  agents-routing.md    # Scope-first agent dispatch
  model-selection.md   # Opus/Sonnet/Haiku routing

Loaded on demand:
  coding.md            # TypeScript/React standards
  testing.md           # TDD, coverage gates
  git.md               # Commit, branch, PR conventions
  quality-gates.md     # Pre-commit checks
  planning.md          # Research-first workflow
  context-management.md
  agents-advanced.md   # Multi-agent orchestration
  security-php.md, coding-style-php.md, patterns-php.md, hooks-php.md, testing-php.md
```

</details>

<details>
<summary>Hooks (16 automated guards)</summary>

- **PostToolUse**: Auto-format and typecheck after every file edit
- **PreToolUse**: Warn before creating documentation files; enforce dispatch procedures
- **Stop**: Check for console.log, suggest compaction, track costs, save session, quality gates
- **SessionStart**: Load session context, check hook enablement

</details>

<details>
<summary>Architecture — symlinks and learning system</summary>

**Symlink system — edit once, available everywhere**

```
muggle-ai-teams/
  agents/         <- single source of truth
  commands/
  skills/
  rules/

~/.claude/
  agents/ -> muggle-ai-teams/agents/     (global)
  commands/ -> muggle-ai-teams/commands/
  skills/ -> muggle-ai-teams/skills/
  rules/ -> muggle-ai-teams/rules/

your-project/.claude/
  agents/ -> muggle-ai-teams/agents/     (project)
  skills/ -> muggle-ai-teams/skills/
```

Clone on a new machine, run `setup.sh`, and your full agent team is operational.

**Learning system**

When you correct behavior during a session, the learning system extracts the correction and writes it to the appropriate rules file — not just memory. The correction is enforced in every future session automatically.

| Correction type | Graduates to |
|----------------|-------------|
| How to debug/fix | `rules/behavior.md` (always loaded) |
| Communication preferences | `rules/behavior.md` (always loaded) |
| Code quality expectations | `rules/core.md` (always loaded) |
| Testing/CI expectations | `rules/quality-gates.md` |
| Git conventions | `rules/git.md` |
| Technical patterns | Rules files or project `CLAUDE.md` |

</details>

---

## QA integration and ecosystem

When [muggle-ai-works](https://github.com/multiplex-ai/muggle-ai-works) is installed, the workflow integrates automated QA testing at every stage:

- **Per-slice QA** — each implementation slice is tested against your running app before committing
- **Regression sweep** (Full tier) — after all slices, replay all project test scripts to catch cross-slice interaction bugs
- **Publish results** — QA results are published to Muggle AI cloud and linked in the PR description

Install: `npm install @muggleai/works`

**Muggle AI open-source ecosystem:**

| Package | Purpose | Install |
|---------|---------|---------|
| **muggle-ai-teams** (this repo) | AI agent orchestration, workflow, skills, rules | `npm install @muggleai/teams` |
| **[muggle-ai-works](https://github.com/multiplex-ai/muggle-ai-works)** | QA testing MCP server and autonomous dev pipeline | `npm install @muggleai/works` |

muggle-ai-teams handles *how work gets done* (design → implement → review → deliver). muggle-ai-works handles *QA verification* (test generation, browser replay, cloud results). Together, they form a complete `ai agent orchestration` workflow with built-in quality assurance.

Want QA testing without managing any of this? Try [MuggleTest](https://www.muggletest.com) — no setup, no agents, no configuration required.

---

## FAQ

### Which platforms does this work with?

**Full support: Claude Code.** The orchestrated workflow — parallel `autonomous coding agent` dispatch, per-slice QA, task tracking, hooks, MCP integration — requires Claude Code's Agent tool, Skill tool, TaskCreate, and hook system.

**Partial support: Cursor.** Reads the agent and skill files and supports MCP (so muggle-ai-works tools work). Cannot spawn subagent specialists in parallel, run hooks, or track workflow tasks. Use the step files as manual guidance rather than automated orchestration.

**Not supported: Codex, Trae, and others.** The workflow files are readable markdown — any AI assistant can follow them as instructions — but automated orchestration won't work without the tools above. Contributions to port the orchestration layer are welcome.

<details>
<summary>Platform compatibility table</summary>

| Capability | Claude Code | Cursor | Others |
|-----------|------------|--------|--------|
| Read workflow step files | Yes | Yes | Yes |
| Agent tool (parallel specialists) | Yes | No | No |
| MCP (muggle-ai-works QA) | Yes | Yes | Varies |
| Skills / Commands | Yes | Partial | No |
| Task tracking | Yes | No | No |
| Hooks (auto-format, typecheck) | Yes | No | No |

</details>

### How much does a typical workflow run cost?

Costs depend on task complexity and which tier the triage recommends:

- **Quick** ($0.50 – $2): Small fixes, config changes, typos. Direct execution, done in minutes.
- **Standard** ($5 – $20): Normal features, refactors, content rewrites. Full research-design-build-test-review cycle.
- **Full** ($50 – $100+): Architecture changes, security-sensitive work, multi-service features. Adds expert panel review and regression sweep.

You see the estimate and confirm the tier before any work begins.

### Will this overwrite my existing ~/.claude/ files?

No. `setup.sh` backs up your existing `agents/`, `commands/`, `skills/`, and `rules/` to `.bak` directories before creating symlinks. To undo: remove the symlinks, rename the backups. Your original setup is preserved.

### Will 207 skills eat my entire context window?

No. Skills load on demand — Claude Code reads them only when a matching task triggers them. At rest, zero skill tokens are in your context. During a workflow run, only the current step file (~50 lines) is active.

### I already use Superpowers or Everything Claude Code. Do I install both?

No. muggle-ai-teams already includes merged, deduplicated versions of both. Installing them separately creates conflicts. If those projects release new skills you want, add the files to the muggle-ai-teams directories — they are picked up automatically.

### Can I add my own agents and skills?

Yes. Add files directly to `muggle-ai-teams/agents/` or `muggle-ai-teams/skills/`. Since they are symlinked to `~/.claude/`, Claude Code picks them up immediately. Your additions are version-controlled alongside everything else.

### Does the full workflow run even for a small bug fix?

No. Quick tasks auto-route to direct execution. Standard features skip panel review and use lighter research. Only architectural or security-sensitive changes run the full workflow. The triage happens automatically — you confirm the tier before proceeding.

### What if I'm mid-project on the old workflow and want to switch?

Run `scripts/migrate-to-new-workflow.sh`. It detects your existing plans, maps them to the new step structure, and moves them to the new project-scoped paths. You resume where you left off.

---

## Credits

muggle-ai-teams builds on excellent open-source work:

**Core foundations**

- **[everything-claude-code](https://github.com/affaan-m/everything-claude-code)** by [@affaan-m](https://github.com/affaan-m) — Source of many agents, commands, skills, and hooks. Anthropic hackathon winner with 28 subagents, 116+ skills, and a continuous learning system.

- **[superpowers](https://github.com/obra/superpowers)** by [Jesse Vincent](https://github.com/obra) / [Prime Radiant](https://primeradiant.com) — Workflow skills including TDD, systematic debugging, code review, and parallel dispatch patterns. The discipline backbone of the workflow.

- **[Get Shit Done](https://github.com/gsd-build/get-shit-done)** by TACHES — Context engineering and multi-agent orchestration patterns. Inspired the fresh-context-per-step approach and research-driven planning.

**Skills and integrations**

- **[claude-seo](https://github.com/AgriciDaniel/claude-seo)** by [@AgriciDaniel](https://github.com/AgriciDaniel) — 12 SEO audit, planning, and optimization skills.
- **[geo-seo-claude](https://github.com/zubair-trabzada/geo-seo-claude)** by [@zubair-trabzada](https://github.com/zubair-trabzada) — 14 Generative Engine Optimization skills for AI-age search visibility.
- **[ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)** by [@nextlevelbuilder](https://github.com/nextlevelbuilder) — UI/UX design intelligence with 50+ styles, 161 color palettes, and 99 UX guidelines.
- **[SkillsMP](https://skillsmp.com/)** — Skills marketplace used in the research step to find community skills relevant to each feature.

**Platform and tools**

- **[Claude Code](https://claude.ai/code)** by [Anthropic](https://www.anthropic.com) — The platform that makes all of this possible.
- **[Context7](https://context7.com)** — Live documentation lookup used by the `docs-lookup` agent and `/docs` command.

---

## About

Built by the team behind [MuggleTest](https://www.muggletest.com) — an AI-powered QA testing platform that makes software testing accessible to every team, no coding required.

Both muggle-ai-teams and [muggle-ai-works](https://github.com/multiplex-ai/muggle-ai-works) were created and refined while building MuggleTest — a multi-service platform spanning 6 sub-projects with frontend, backend, MCP servers, Electron apps, and documentation.

<details>
<summary>Version history</summary>

| Version | Date | Highlights |
|---------|------|-----------|
| **1.2** | 2026-03-27 | Dispatch enforcement hooks, realistic cost estimates, agent budget caps, procedure-agent-dispatch checklist |
| **1.1** | 2026-03-26 | Workflow v2 redesign — cost/reliability/observability overhaul, plugin system, setup refactor |
| **1.0** | 2026-03-23 | Adaptive complexity tiers (Quick/Standard/Full), specialist-driven design, per-slice QA via muggle-ai-works, non-coding task support, explicit rule loading, npm plugin, platform compatibility documentation |

</details>

---

## License

[MIT](LICENSE) — Use it, fork it, make it yours.

---

If this helps your Claude Code workflow, consider giving it a star. It helps others find it.
