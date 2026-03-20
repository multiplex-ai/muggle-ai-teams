---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "**/__tests__/**"
---
# Testing

## TDD-First (mandatory for ALL work)

- **RED**: Write failing tests first — define expected behavior before implementation.
- **GREEN**: Implement minimal code to pass tests.
- **IMPROVE**: Refactor while keeping tests green.
- Verify **80%+ coverage**.
- Use **tdd-guide** agent for implementation with tests.

## Bug Fixes

- Write a test that reproduces the bug first, then fix. No exceptions.

## Test Conventions

- Use repo convention (e.g. `__tests__/*.test.ts` or `*.test.ts` next to source).
- Per PR: unit tests for non-trivial logic and changed behavior; integration tests for critical paths; E2E as defined for key flows.
- When a PR changes behavior, add or update unit tests.

## Quality Gates (pre-commit)

- `npm run typecheck` — must pass
- `npm run lint` — must pass
- `npm test` — must pass
- Test in localhost: open the app, trigger the changed flow, verify behavior. Do not commit without this check.
