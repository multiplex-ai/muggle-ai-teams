# muggle-ai-prompt-service

Core backend API for the Muggle AI platform.

## Stack

- **Runtime**: Node 18+
- **Framework**: Express.js
- **Ports**: REST API on 5050, Socket.io WebSocket on 8000, mcp-gateway on 6000
- **Language**: TypeScript (strict mode)
- **Test runner**: Jest (with coverage)

## Commands

```bash
npm run dev          # Watch mode with tsx
npm run build        # Compile TypeScript
npm start            # Production
npm test             # Jest with coverage
npm run lint         # ESLint auto-fix
npm run lint:check   # ESLint check only
npm run typecheck    # tsc --noEmit
```

## Key Layers

| Directory | Purpose |
|-----------|---------|
| `src/routers/v1/` | Express route definitions |
| `src/controllers/` | Request handlers (thin, delegate to services) |
| `src/data_access/` | Repository pattern for DB access (Firebase + Mongo) |
| `src/models/` | Mongoose schemas |
| `src/agent/` | AI agent orchestration logic |
| `src/llm/` | LLM integrations (OpenAI, Claude) |
| `src/routine_task/` | Redis-backed async workflow execution |
| `src/products/` | Product-specific business logic |
| `mcp-gateway/src/` | Separate Express app bridging MCP to prompt-service (port 6000) |

## Architecture

- Orchestrates AI agents for QA testing workflows
- **Primary database**: Firebase/Firestore
- **Secondary database**: MongoDB (Mongoose schemas)
- **Task queuing**: Redis
- **Async messaging**: Azure Service Bus
- **mcp-gateway** (port 6000) bridges MCP clients (AI assistants) to Cloud QA tools via authenticated API calls

## Design Patterns

- Repository (data access layer)
- Dependency Injection (constructors)
- Strategy/Command (behaviors)
- Factory/Builder (complex objects)

## Code Standards

- Files/folders: `kebab-case`
- Classes/interfaces: `PascalCase` (interfaces prefixed with `I`, e.g. `IUserRepository`)
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Avoid `any`. Use `interface` for object contracts, `type` for unions/intersections.
- Annotate all function parameters and return types.

## Environment Variables

Requires `.env` file with: Firebase credentials, Auth0, Stripe, Azure, MongoDB/Redis connection strings. See README or `.env.example`.
