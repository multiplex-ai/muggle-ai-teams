# Agent Routing: Scope First, Then Task Type

## Step 1: Route by Sub-Project Scope

Always identify the narrowest agent scope first:

| Requirement type | Agent |
|-----------------|-------|
| UI components, pages, styling, React hooks, frontend state | **frontend-engineer** (muggle-ai-ui) |
| REST API endpoints, controllers, services, DB access, queues | **backend-engineer** (muggle-ai-prompt-service) |
| MCP tool definitions, protocol proxying | **general-engineer** (muggle-ai-mcp) |
| Electron app, browser automation, local test execution | **general-engineer** (muggle-ai-teaching-service) |
| API contract change (request/response shape) | Both frontend + backend engineers |
| Auth, billing, external service integration | **backend-engineer** (muggle-ai-prompt-service) |
| Documentation visible to end users | **general-engineer** (muggle-ai-docs) |

If a requirement spans frontend + backend, split it and assign each part explicitly. Never apply a requirement universally.

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
