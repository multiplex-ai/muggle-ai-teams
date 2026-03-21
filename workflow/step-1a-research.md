# /MuggleAI-Teams → Step 1A: Research & Context Gathering

> Part of /MuggleAI-Teams. Mindset: `MuggleAI-Teams/contexts/research.md` — read widely before concluding.

> **Skills**: `superpowers:brainstorming`, `superpowers:writing-plans`, `frontend-design:frontend-design`
> **Tools**: `feature-dev:code-explorer`, `feature-dev:code-architect`, `WebSearch`, `Context7`, `EnterPlanMode`

All design and plan content is saved to a single document: `MuggleAI-Teams/projects/<project-name>/plans/<feature-name>.md`.

---

## Step 0: Project Bootstrap (if no project config exists)

If `MuggleAI-Teams/projects/<project-name>/<project-name>.md` does not exist for the target project, create one before proceeding:

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

After user confirms (or adjusts), create `MuggleAI-Teams/projects/<project-name>/<project-name>.md` using the template at `MuggleAI-Teams/projects/PROJECT-TEMPLATE.md`.

---

## Procedure

Before designing anything, understand the current state and the landscape.

### 1. Explore codebase

Dispatch `feature-dev:code-explorer` agent to trace existing code paths, map current architecture, and identify files/services that will be affected.

### 2. Research industry practices (MANDATORY)

Use `WebSearch` to find how similar features are implemented in production systems, industry standards, and common pitfalls. **At least 3 queries with findings documented.**

### 3. Search SkillsMP (diagnosis-driven)

After exploring the codebase, diagnose whether existing installed skills cover the user's request. If gaps exist, search SkillsMP for skills that fill them.

**Purpose**: Find skills we don't already have that would improve the quality of this workflow run. Examples: a Stripe skill for payment integration, a HIPAA skill for healthcare compliance, a WebSocket skill for real-time features.

**Procedure**: Follow `MuggleAI-Teams/workflow/procedure-skillsmp-search.md` (shared search procedure with 5K+ stars filter and 3-point security scan).

**Skip if**: All needed expertise is already covered by installed skills.

### 4. Pull library docs

Use `Context7` MCP to fetch latest documentation for relevant libraries being used.

### 5. Enter Plan Mode

Use `EnterPlanMode` for structured reasoning on complex architectural decisions.

### 6. Check package registries

Search npm, PyPI, crates.io before writing utility code. Prefer battle-tested libraries over hand-rolled solutions.

### 7. Search for adaptable implementations

Look for open-source projects that solve 80%+ of the problem and can be forked, ported, or wrapped. Prefer adopting or porting a proven approach over writing net-new code when it meets the requirement.

---

## Mandatory Research Protocol

These are NOT optional. Skip only if user explicitly says to. Each skipped item requires a documented reason.

1. **WebSearch** for industry practices (at least 3 queries with findings documented)
2. **Search SkillsMP** (skillsmp.com) for skills that fill diagnosed gaps (see `procedure-skillsmp-search.md`)
3. **Use Context7 MCP** to fetch latest docs for libraries being used
4. **Dispatch `feature-dev:code-architect`** for architecture design (not design it yourself)
5. **Invoke `frontend-design:frontend-design`** for visual mockups AFTER panel review (Step 1D), not during Step 1C — the panel may change the design significantly, making early mockups wasted work
6. **Examine existing app styling** before creating any visual mockups — read the Tailwind config, globals.css, and existing component patterns. Never guess fonts, colors, or spacing.

---

## Output

A context summary with:
- Current state of affected code/services
- Affected files/services mapped
- Relevant research findings (industry practices, library docs)
- Available packages/implementations to leverage

## Completion Criteria

- [ ] Project config exists (created or pre-existing)
- [ ] Codebase explored — affected files/services mapped
- [ ] At least 3 web search queries documented with findings
- [ ] SkillsMP searched (or documented skip reason)
- [ ] Library docs fetched for relevant dependencies
- [ ] Context summary written in plan document

## Next → Read `MuggleAI-Teams/workflow/step-1b-requirements.md`
