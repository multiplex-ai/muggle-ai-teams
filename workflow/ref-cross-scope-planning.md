# Reference: Cross-Scope Planning

> Read when a requirement spans multiple scopes (frontend + backend).

## Parallel vs Sequential Decision

First match wins:

| # | Condition | Decision |
|---|-----------|----------|
| 1 | Adds/removes an endpoint? | Sequential (backend first) |
| 2 | Response shape requires new types? | Sequential (backend first) |
| 3 | Multiple backend services coordinated? | Sequential (backend first) |
| 4 | User prefers frontend-first with mocks? | Parallel with mocks |
| 5 | Contract already defined/agreed? | Parallel |
| 6 | Field add/remove/rename on existing endpoint? | Parallel |
| 7 | CRUD on existing model, no shape change? | Parallel |
| 8 | Frontend only? | Frontend Engineer only |
| 9 | Backend only? | Backend Engineer only |
| 10 | None of above? | Ask user |

## Contract Artifact

Define a TypeScript interface or API shape both agents conform to:

```typescript
// Contract: POST /api/v1/feature
interface CreateFeatureRequest { name: string; config: FeatureConfig; }
interface CreateFeatureResponse { id: string; status: 'created' | 'error'; }
```

## Mock Data (parallel with mocks only)

For each endpoint: create sample request/response objects, include edge cases (empty arrays, null optionals, max-length strings). Place in `__mocks__/api/<endpoint>.ts`.
