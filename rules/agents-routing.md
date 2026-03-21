# Agent Routing: Scope First, Then Task Type

## Step 1: Route by Project Config

Every project has a config at `MuggleAI-Teams/projects/<project-name>/<project-name>.md` that declares its scopes (frontend, backend, etc.), agents, directories, and commands.

**Routing algorithm:**

1. Read the project config for the affected project
2. Match the requirement to a scope using the config's scope table
3. Dispatch the agent listed for that scope
4. If no project config exists, run the bootstrap procedure in Step 1A

**If a requirement spans multiple scopes**, split it and assign each part to its scope's agent. Define a contract artifact that both agents conform to.

### Scope-to-agent mapping (generic)

| Requirement type | Typical agent | Notes |
|-----------------|---------------|-------|
| UI components, pages, styling, hooks, frontend state | **frontend-engineer** | Read project config for root dirs |
| API endpoints, controllers, services, DB access, queues | **backend-engineer** | Read project config for root dirs |
| CLI tools, MCP definitions, protocol layers | **general-engineer** | |
| Desktop/mobile app, native features | **general-engineer** | |
| API contract change (request/response shape) | **Both frontend + backend** | Split the requirement |
| Auth, billing, external service integration | **backend-engineer** | Unless purely frontend-side |
| Documentation | Handle directly or **general-engineer** | |

This table is a fallback. The project config is the source of truth — it may override these defaults (e.g., a Python project might use general-engineer for its API layer).

### Repo structures supported

- **Monorepo** (multiple sub-projects): One config per sub-project. Route to the narrowest scope.
- **Single repo** (frontend + backend in same repo): One config with multiple scopes. Each scope has its own root directory.
- **Single-scope repo** (e.g., pure frontend): One config with one scope.
- **Polyrepo** (separate repos): One config per repo.

## Step 2: Dispatch by Task Type Within Scope

After identifying the scope, dispatch specialist agents as needed:

| Task type | Agent | When |
|-----------|-------|------|
| Complex features, refactoring | **planner** | Planning phase before implementation |
| System design, architectural decisions | **architect** | When design impacts multiple services or modules |
| Implementation with tests | **tdd-guide** | All feature work (TDD-first mandatory) |
| Security analysis | **security-reviewer** | Before commits touching auth, input handling, secrets, APIs |
| Build failures | **build-error-resolver** | When build/typecheck fails |
| E2E testing | **e2e-runner** | Critical user flows |
| Dead code cleanup | **refactor-cleaner** | Code maintenance |
| Documentation sync | **doc-updater** | When code changes affect docs |
