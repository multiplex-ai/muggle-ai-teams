# /MuggleAI-Teams → Step 1F: Implementation Plan

> Part of /MuggleAI-Teams.

---

## Procedure

Once design is approved, continue in the same plan document. Invoke `superpowers:writing-plans`:

### 1. Route the requirement

**Narrowest-scope-first rule.** Always identify the narrowest agent scope first. Never apply a requirement universally. If a requirement spans frontend + backend, split it and assign each part explicitly.

**Read the project config** at `MuggleAI-Teams/projects/<project-name>/<project-name>.md` to determine scopes, agents, directories, and commands. The config's scope table is the source of truth for routing.

**If no project config exists**, run the bootstrap procedure in Step 1A first.

The generic routing fallback (use only when the project config doesn't specify):

| Requirement type | Agent |
|-----------------|-------|
| UI components, pages, styling, hooks, frontend state | **Frontend Engineer** |
| API endpoints, controllers, services, DB access, queues | **Backend Engineer** |
| CLI tools, MCP definitions, protocol layers | **General Engineer** |
| Desktop/mobile app, native features | **General Engineer** |
| API contract change (request/response shape) | **Both Frontend + Backend Engineers** |
| Auth, billing, external service integration | **Backend Engineer** |
| Documentation | Handle directly |

**Cross-scope work:** When a requirement touches both frontend and backend:
1. Split the requirement into frontend and backend parts
2. Define a contract artifact (see step 3 below) that both agents must conform to
3. Decide parallel vs sequential execution (see step 2 below)
4. Each agent receives only its part + the shared contract

### 2. Decide parallel vs sequential

Run this checklist in order. **First match wins:**

| # | Condition | Decision |
|---|-----------|----------|
| 1 | Does the change add or remove an endpoint? | **Sequential (backend first)** |
| 2 | Does the response shape require new types? | **Sequential (backend first)** |
| 3 | Are multiple backend services coordinated? | **Sequential (backend first)** |
| 4 | User prefers frontend-first with mock data? | **Parallel with mocks** (see step 2b) |
| 5 | Is the contract already defined or agreed? | **Parallel** |
| 6 | Is it a field add/remove/rename on existing endpoint? | **Parallel** |
| 7 | Is it CRUD on existing model, no shape change? | **Parallel** |
| 8 | Frontend only? | **Frontend Engineer only** |
| 9 | Backend only? | **Backend Engineer only** |
| 10 | None of the above? | **Ask the user** |

**Notes:**
- **Sequential (backend first)**: Backend engineer completes and commits before frontend engineer starts. Frontend uses the real API, not mocks.
- **Parallel**: Both agents work simultaneously. Both must conform to the shared contract artifact.
- **Parallel with mocks**: Frontend starts immediately with mock data generated from the contract. Backend works in parallel. When backend is ready, frontend switches from mocks to real API.
- **Single agent**: Only one engineer is needed. No coordination overhead.

#### 2b. Mock data generation (when "Parallel with mocks" is selected)

The orchestrator generates mock data from the contract artifact defined in step 3. For each endpoint in the contract:
1. Create sample request/response objects matching the TypeScript interface
2. Include edge cases: empty arrays, null optional fields, maximum-length strings
3. Place mocks in a file the frontend can import (e.g., `__mocks__/api/<endpoint-name>.ts`)
4. Frontend engineer uses these mocks until backend is ready, then switches to real API

### 3. Define contract artifact (for cross-scope slices)

For slices that span frontend and backend, define a concrete contract artifact — TypeScript interface definition or API shape that both agents must conform to. Include in the plan document.

Example:
```typescript
// Contract: POST /api/v1/feature
interface CreateFeatureRequest {
  name: string;
  config: FeatureConfig;
}
interface CreateFeatureResponse {
  id: string;
  status: 'created' | 'error';
}
```

### 4. Visual design (if UI changes)

If the design includes user-facing changes, invoke `frontend-design:frontend-design` now to create visual mockups. The panel review (Step 1D2) has finalized the design, so mockups won't be wasted.

**Before creating mockups:** Examine existing app styling — read the Tailwind config, globals.css, and existing component patterns. Never guess fonts, colors, or spacing.

Mockups inform the frontend slice definitions in step 5.

### 5. Break work into committable slices with TDD steps

Each slice should be:
- Small enough to commit independently
- Testable in isolation
- Clear about which agent owns it

For each slice, specify:
- **Agent**: Which engineer agent executes this slice
- **Scope**: Files to touch and files NOT to touch
- **Contract reference**: Which contract artifact applies (if cross-scope)
- **TDD steps**: What tests to write first
- **Localhost test instructions**: How the user verifies it works

### 6. Get user approval on the full plan before executing

Present the complete implementation plan and wait for explicit user approval before proceeding to Step 2.

---

## Output

Add to the plan document at `MuggleAI-Teams/projects/<project-name>/plans/<feature-name>.md`:

```markdown
## Implementation Plan
- Mode: [parallel / sequential / parallel with mocks / single agent]
- Contract: [TypeScript interface / API shape if cross-scope]
- Mock data: [if parallel with mocks, list mock files]
- Visual mockups: [if UI changes, reference mockup output]
- Slices:
  - Slice 1: [description] → Agent: [X] → Scope: [files] → Test: [Y]
  - Slice 2: ...
```

## Completion Criteria

- [ ] Project config read — agent routing matches config's scope table (not generic fallback)
- [ ] Requirements routed to agents via project config
- [ ] Parallel vs sequential decision documented with rationale
- [ ] Contract artifact defined (if cross-scope)
- [ ] Visual mockups created (if UI changes)
- [ ] Work broken into committable slices with TDD steps
- [ ] User approved the full implementation plan

## Next → Read `MuggleAI-Teams/workflow/step-2-execute.md`
