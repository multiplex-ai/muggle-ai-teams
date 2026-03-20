# muggle-ai-teaching-service

Desktop Electron app and local MCP server for Muggle AI.

## Stack

- **Framework**: Electron
- **Runtime**: Node 22+
- **Package management**: npm workspaces (monorepo)
- **Language**: TypeScript (strict mode)

## Commands

```bash
npm run build           # Clean + build types + compile all packages
npm run build:types     # Build shared types package only
npm run build:electron  # Build Electron app (staging)
npm run clean           # Remove dist folders
```

## Architecture

- Desktop application that performs browser automation for local test execution
- Acts as a local MCP server that muggle-ai-mcp can proxy tool calls to
- Monorepo structure using npm workspaces with shared types package

## Code Standards

- Files/folders: `kebab-case`
- Classes/interfaces: `PascalCase` (interfaces prefixed with `I`)
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Avoid `any`. Use `interface` for object contracts, `type` for unions/intersections.
- Annotate all function parameters and return types.
