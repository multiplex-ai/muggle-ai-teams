# Reference: Project Bootstrap

> Read this only when `muggle-ai-teams/projects/<project-name>/<project-name>.md` does not exist.

## 1. Detect tech stack

Scan the repository for signals:
- `package.json` → Node.js/TypeScript (check for next, react, express, fastify, etc.)
- `requirements.txt` / `pyproject.toml` → Python (check for django, flask, fastapi, etc.)
- `go.mod` → Go
- `Cargo.toml` → Rust
- `pom.xml` / `build.gradle` → Java/Kotlin
- `src/`, `lib/`, `app/`, `packages/` → source layout
- `docker-compose.yml`, `Dockerfile` → containerized services

## 2. Detect project structure

- **Monorepo**: Multiple `package.json` files, `packages/` or `apps/` directory, workspaces config
- **Single repo with multiple scopes**: Both frontend and backend code in one repo
- **Single-scope repo**: One language/framework, one entry point

## 3. Recommend project config

Present a pre-filled config with detected scopes, agents, root directories, stack, commands, and VCS. User confirms or adjusts.

## 4. Create project config

Use template at `muggle-ai-teams/projects/PROJECT-TEMPLATE.md`.
