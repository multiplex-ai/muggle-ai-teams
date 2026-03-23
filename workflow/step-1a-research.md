# /muggle-ai-teams → Step 1A: Research & Context Gathering

> Part of /muggle-ai-teams. Mindset: `muggle-ai-teams/contexts/research.md` — read widely before concluding.

> **Load rules**: core.md, context-management.md

> **Skills**: `superpowers:brainstorming`, `superpowers:writing-plans`, `frontend-design:frontend-design`
> **Tools**: `feature-dev:code-explorer`, `feature-dev:code-architect`, `WebSearch`, `Context7`, `EnterPlanMode`

All design and plan content is saved to a single document: `muggle-ai-teams/projects/<project-name>/plans/<feature-name>.md`.

---

## Step 0: Project Bootstrap (if no project config exists)

If `muggle-ai-teams/projects/<project-name>/<project-name>.md` does not exist for the target project, create one before proceeding:

### 0a. Detect tech stack

Scan the repository for signals:
- `package.json` → Node.js/TypeScript (check for next, react, express, fastify, etc.)
- `requirements.txt` / `pyproject.toml` → Python (check for django, flask, fastapi, etc.)
- `go.mod` → Go
- `Cargo.toml` → Rust
- `pom.xml` / `build.gradle` → Java/Kotlin
- `src/`, `lib/`, `app/`, `packages/` → source layout
- `docker-compose.yml`, `Dockerfile` → containerized services

### 0b. Detect project structure

- **Monorepo**: Multiple `package.json` files, `packages/` or `apps/` directory, workspaces config
- **Single repo with multiple scopes**: Both frontend and backend code in one repo (e.g., `src/app/` + `src/api/`, or `client/` + `server/`)
- **Single-scope repo**: One language/framework, one entry point

### 0c. Recommend project config

**The orchestrator provides the best recommendation** based on what was detected — do not just ask and wait. Present a pre-filled config with:
- Detected scopes (frontend, backend, etc.) with recommended agents
- Root directories per scope
- Detected stack per scope
- Detected commands (dev, build, test, lint, typecheck)
- VCS and hosting (detected from `.git/config`, CI config files)

Example recommendation:
> Based on the repository, I recommend this project config:
> - **Frontend scope**: `src/app/`, `src/components/` → frontend-engineer (Next.js, React, Tailwind)
> - **Backend scope**: `src/api/`, `src/services/` → backend-engineer (Express, PostgreSQL)
> - **Commands**: npm run dev / build / test / lint / typecheck
>
> Should I create this config, or would you like to adjust anything?

### 0d. Create project config

After user confirms (or adjusts), create `muggle-ai-teams/projects/<project-name>/<project-name>.md` using the template at `muggle-ai-teams/projects/PROJECT-TEMPLATE.md`.

---

## Phase 0: Task Classification

Before scoring complexity, classify the task type:

| Classification | Signals | Route |
|---------------|---------|-------|
| **Coding** | Changes code, config, tests, infrastructure, UI components | Continue to Phase 1 (complexity scoring for code) |
| **Non-coding** | Documents, presentations, emails, planning, research, bookings, strategy | Continue to Phase 1 (complexity scoring for non-coding) |

**How to classify**: Scan the task description for intent:
- "Build/add/fix/refactor [feature/component/API/page]" → Coding
- "Build/create/write [deck/email/plan/strategy/document/presentation]" → Non-coding
- "Plan/organize/book [trip/event/campaign]" → Non-coding
- "Research/analyze/compare [topic]" → Non-coding

Set `mission: coding` or `mission: non-coding`. This flag is read by every subsequent step to select the appropriate mode.

---

## Phase 1: Quick Scan + Triage (2 min)

Before deep research, determine how much research this task actually needs.

### 1. Read project config

Load `muggle-ai-teams/projects/<project-name>/<project-name>.md` — scopes, stack, commands, key layers.

### 2. Quick file scan

- Run `git diff --stat` (or estimate from the requirement description)
- Estimate number of affected files
- Check whether the task touches single or multiple scopes

### 3. Score complexity

Use this table to assign a complexity score:

| Signal               | Quick (+0) | Standard (+1) | Full (+2) |
|----------------------|-----------|---------------|-----------|
| Files affected       | 1-3       | 4-10          | 10+       |
| Scopes touched       | 1         | 1             | 2+        |
| Touches auth/security| No        | No            | Yes       |
| New API endpoints    | No        | Maybe         | Yes       |
| Schema/migration     | No        | No            | Yes       |
| User-facing flow     | Minor     | Moderate      | Major     |

**Score 0-2 = Quick** | **Score 3-6 = Standard** | **Score 7+ = Full**

### Non-Coding Complexity Scoring (if mission = non-coding)

| Signal | Quick (+0) | Standard (+1) | Full (+2) |
|--------|-----------|---------------|-----------|
| Deliverables | 1 document/action | 2-3 deliverables | 4+ or multi-format |
| Research needed | None / well-known | Some domain research | Deep research required |
| External actions | None | 1-2 (bookings, sends) | 3+ coordinated actions |
| Stakeholder impact | Personal/internal | Team/client-facing | Public/investor-facing |
| Dependencies | None | Sequential | Multi-party coordination |
| Domain expertise | General | 1 specialist skill | 2+ specialist skills |

Score 0-2 = Quick, 3-6 = Standard, 7+ = Full

**Quick (non-coding)**: Invoke the matching skill directly. No workflow needed.
  - Skill matching: scan task description against available skill triggers
  - "pitch deck" / "investor" → investor-materials
  - "cold email" / "outreach" → cold-email
  - "slides" / "presentation" → frontend-slides
  - "blog post" / "article" → article-writing
  - "landing page copy" → copywriting
  - "SEO audit" → seo-audit / geo-main
  - Present: "This is a quick non-coding task. I'll use [skill] to handle it. Proceed?"

**Standard / Full (non-coding)**: Continue to Phase 2 with `mission: non-coding` flag.

### 4. Present recommendation

State the tier, the score breakdown, and reasoning. User confirms or overrides.

### 5. Route

- **Quick (0-2)**: Hand off to `/muggle-do` with pre-filled context (project config, affected files, scope). **STOP here — do not continue to Phase 2.**
- **Standard (3-6)**: Continue to Phase 2 (Standard tier).
- **Full (7+)**: Continue to Phase 2 (Full tier).

### Tier Escalation

At any later step (1B, 1C, 1F), if unexpected complexity is discovered, the orchestrator can recommend upgrading the tier (e.g., Standard → Full). Document the reason and re-enter the appropriate research track.

---

## Phase 2: Tier-Appropriate Research

### Standard Tier (score 3-6)

| # | Action | Notes |
|---|--------|-------|
| 1 | Dispatch `feature-dev:code-explorer` | Trace existing code paths, map affected files/services |
| 2 | `WebSearch` — 1 targeted query | Skip if the domain is well-understood; document findings |
| 3 | SkillsMP | **SKIP** — not needed for standard complexity |
| 4 | `Context7` — only for unfamiliar libraries | Skip if all libraries are well-known to the team |
| 5 | `EnterPlanMode` | Structured reasoning on approach |

### Full Tier (score 7+)

| # | Action | Notes |
|---|--------|-------|
| 1 | Dispatch `feature-dev:code-explorer` | Trace existing code paths, map affected files/services |
| 2 | `WebSearch` — 3+ queries with findings documented | Industry practices, common pitfalls, prior art |
| 3 | Search SkillsMP | Follow `muggle-ai-teams/workflow/procedure-skillsmp-search.md` |
| 4 | `Context7` — fetch docs for all relevant libraries | Latest API docs, migration guides |
| 5 | Dispatch `feature-dev:code-architect` | Architecture design for multi-scope or complex changes |
| 6 | Check package registries | npm, PyPI, crates.io — prefer battle-tested over hand-rolled |
| 7 | Search for adaptable implementations | Open-source projects solving 80%+ of the problem |
| 8 | `EnterPlanMode` | Structured reasoning on architecture and approach |

### Non-Coding Research Adjustments

When mission = non-coding, Phase 2 research adapts:
- **Skip**: Code explorer, package registries, code-architect dispatch
- **Keep**: WebSearch (research the domain/topic), Context7 (if using specific tools/frameworks)
- **Add**: Search for relevant skills to equip specialists (scan installed skills list)
- **Add**: Web research for domain best practices (e.g., pitch deck structure, trip planning resources)

---

## Output

A context summary with:
- **Triage result**: Tier assigned (Quick/Standard/Full), score breakdown, and reasoning
- Current state of affected code/services
- Affected files/services mapped
- Relevant research findings (industry practices, library docs)
- Available packages/implementations to leverage

## Completion Criteria

- [ ] Project config exists (created or pre-existing)
- [ ] Complexity triage completed — tier assigned with score breakdown
- [ ] User confirmed (or overrode) the tier
- [ ] If Quick tier: handed off to `/muggle-do` with context — DONE
- [ ] Codebase explored — affected files/services mapped
- [ ] Research completed per tier requirements (Standard: 1 query; Full: 3+ queries)
- [ ] SkillsMP searched or skipped per tier (Standard: skip; Full: search or documented skip reason)
- [ ] Library docs fetched for relevant dependencies (if applicable per tier)
- [ ] Context summary written in plan document
- [ ] Mission type classified (coding or non-coding)

## Next → Read `muggle-ai-teams/workflow/step-1b-requirements.md`
