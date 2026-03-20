# muggle-ai-ui

Frontend React application for the Muggle AI platform.

## Stack

- **Framework**: React (Create React App)
- **Port**: 3000
- **Language**: TypeScript (strict mode)
- **Test runner**: Jest
- **API client**: Axios
- **State management**: React Context

## Commands

```bash
npm start            # Dev server
npm run build        # Production build
npm test             # Jest
npm run lint         # ESLint + Stylelint + Prettier check
npm run lint:fix     # Auto-fix all
npm run typecheck    # tsc --noEmit
npm run check        # typecheck + lint
```

## Key Layers

| Directory | Purpose |
|-----------|---------|
| `src/pages/` | Route-level components |
| `src/components/` | Feature components (agent, auth, chat, discovery, workbench) |
| `src/services/` | Axios-based API client layer |
| `src/hooks/` | Custom React hooks |
| `src/context/` | React Context for global state (auth, subscriptions, etc.) |

## Architecture

- Calls the prompt-service REST API on port 5050
- Connects via Socket.io WebSocket on port 8000 for real-time updates
- Fetches documentation from muggle-ai-docs via raw GitHub URLs

## Code Standards

- Files/folders: `kebab-case`
- Classes/interfaces: `PascalCase` (interfaces prefixed with `I`)
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Avoid `any`. Use `interface` for object contracts, `type` for unions/intersections.
- Annotate all function parameters and return types.

## Environment Variables

Requires `.env` file with:
- `REACT_APP_API_URL`
- `REACT_APP_AUTH0_DOMAIN`
- `REACT_APP_AUTH0_CLIENT_ID`

See README or `.env.example` for full list.
