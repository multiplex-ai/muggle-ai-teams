---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# Coding Standards

## File Structure

- One feature = one "router" or framework file as entry; that file only composes and routes, no concrete business UI or logic.
- Subtasks split as finely as possible; one file serves one purpose only (e.g. parent imports and composes; `header.tsx`, `main.tsx` are independent).
- Split by responsibility, not line count. Avoid over-splitting; cohesion and readability first.
- **~200 lines per file** (including blanks and comments). If larger, split by responsibility or logical subcomponents. Do not split by line count alone. Exception: one cohesive algorithm or form may exceed 200 lines if splitting hurts readability — add a one-line comment at top explaining why. Test files may exceed 200 lines when covering a large surface.

## File Naming

- **Feature-based folder structure**; folder path conveys scope. Names like `types.ts`, `utils.ts`, `index.ts`, `constants.ts` OK when scoped by folder.
- Disambiguate only when same filename in different folders causes confusion: use folder/module prefix (e.g. `auth/auth-utils.ts`, `dashboard/dashboard-utils.ts`).
- Do not rename framework-required files (e.g. `page.tsx`, `layout.tsx` in Next.js App Router).

## Naming Conventions

- Files/folders: `kebab-case`
- Classes/interfaces: `PascalCase` (interfaces prefixed with `I`, e.g. `IUserRepository`)
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

## TypeScript

- Always `"strict": true`. Avoid `any`.
- Use `interface` for object contracts, `type` for unions/intersections.
- Annotate all function parameters and return types.
- Explicit return types for public APIs.
- Prefer schema-driven validation for APIs (e.g. OpenAPI); consistent error format (e.g. `{ code, message, details }`).

## Design Patterns

- **Repository** for data access
- **Dependency Injection** via constructors
- **Strategy/Command** for behaviors
- **Factory/Builder** for complex objects

## Backend Structure

- One file per route module; business logic in separate service/layer files; one responsibility per file.

## Frontend Structure

- Entry/page files = layout and composition only; sub-areas in components under a dedicated folder; API calls centralized or by module.

## Code Quality

- Simple and direct: clear logic; comments so anyone can see what and why.
- Accessibility: user-facing UI keyboard-accessible and screen-reader friendly (WCAG 2.x AA if required).
- Security: validate/sanitize input at boundary; no PII/secrets in logs; run `npm audit`; fix or document risks.
