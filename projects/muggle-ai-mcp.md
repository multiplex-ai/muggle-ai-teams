# muggle-ai-mcp

Unified MCP (Model Context Protocol) server for Muggle AI.

## Stack

- **Runtime**: Node 22+
- **Language**: TypeScript (strict mode)
- **Build**: tsup + tsc
- **Test runner**: Vitest

## Commands

```bash
npm run dev          # tsx watch
npm run build        # tsup + tsc
npm test             # Vitest
npm run lint         # ESLint auto-fix
npm run lint:check   # ESLint check only
```

## Architecture

- npm-published MCP server installed by end users
- Proxies tool calls to either:
  - **mcp-gateway** (cloud mode) -- hosted inside prompt-service on port 6000
  - **Local Electron app** (local testing mode) -- muggle-ai-teaching-service
- Uses Auth0 device code flow for CLI login

## Code Standards

- Files/folders: `kebab-case`
- Classes/interfaces: `PascalCase` (interfaces prefixed with `I`)
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Avoid `any`. Use `interface` for object contracts, `type` for unions/intersections.
- Annotate all function parameters and return types.

## Environment Variables

Requires `.env` file with: API endpoint URLs, Auth0 config. See README or `.env.example`.
