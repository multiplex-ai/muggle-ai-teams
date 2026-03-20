# Quality Gates

## Before Every Commit

Run locally and ensure all pass before committing; do not commit if any fail:

1. `npm run typecheck`
2. `npm run lint`
3. `npm test`
4. **Local verification**: Run app locally; trigger the changed flow; verify behavior.

## CI Enforcement

- Lint, typecheck, and tests must run in CI.
- Branch protection on `main`.
- Pre-commit hooks or equivalent for trivial issues.
- **Typecheck is global**: `tsc --noEmit` must produce ZERO errors across the entire project, not just changed files. Pre-existing errors in unchanged files still block CI. If pre-existing errors exist, fix them or flag to user — never silently ignore.

## Enforcement Checklist

- [ ] `npm run typecheck`, `npm run lint`, `npm test` — all pass.
- [ ] Local verification: run app locally; verify changed flow.
- [ ] Commits: one commit per subtask; message `type(scope): Short description`; no "phase N" jargon.
- [ ] Branch name: descriptive, no internal jargon.
- [ ] Tests: for PRs that change behavior, add or update unit tests.
- [ ] Phase plan: when a phase/subtask is done, check off the To-Do in the phase plan doc.
