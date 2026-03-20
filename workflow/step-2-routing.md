# /MuggleAI-Teams → Step 2: Route the Requirement

> Part of /MuggleAI-Teams.

---

## Narrowest-Scope-First Rule

Always identify the narrowest agent scope first. Never apply a requirement universally. If a requirement spans frontend + backend, split it and assign each part explicitly.

**Before dispatching any agent**, read the project info at `MuggleAI-Teams/projects/<sub-project>.md` to understand the sub-project's structure, commands, and conventions.

---

## Agent Routing Table

| Requirement type | Agent |
|-----------------|-------|
| UI components, pages, styling, React hooks, frontend state | **Frontend Engineer** (muggle-ai-ui) |
| REST API endpoints, controllers, services, DB access, queues | **Backend Engineer** (muggle-ai-prompt-service) |
| MCP tool definitions, protocol proxying | **General Engineer** (muggle-ai-mcp) |
| Electron app, browser automation, local test execution | **General Engineer** (muggle-ai-teaching-service) |
| API contract change (request/response shape) | **Both Frontend + Backend Engineers** |
| Auth, billing, external service integration | **Backend Engineer** (muggle-ai-prompt-service) |
| Documentation (muggle-ai-docs, muggle-ai-skills) | Handle directly |

---

## Cross-Repo Work

When a requirement touches both frontend and backend:
1. Split the requirement into frontend and backend parts
2. Define a contract artifact (TypeScript interface or API shape) that both agents must conform to
3. Decide parallel vs sequential execution (see Step 3)
4. Each agent receives only its part + the shared contract

## Next → Read `MuggleAI-Teams/workflow/step-3-parallel.md`
