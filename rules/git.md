# Git Workflow

## Branches

- **main**: Integration branch; only merged code via PR; no direct push.
- One branch per task or related group.
- Naming: short, descriptive, kebab-case. `feature/detail-modal-steps-tab`, `fix/login-timeout`. Bad: `feature/update`, `feature/phase1-shell`.
- Before each new phase: pull from `main` (or integration branch) to get latest state.

## Commit Message Format

```
type(scope): Short description

<optional body>
```

- **Scope is required** — module or area (e.g. `auth`, `dashboard`, `mcp`, `ui`).
- **Subject**: ~72 chars, present tense.
- **No internal jargon** (e.g. "Phase 1") in commits, branches, or PRs.
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

## When to Commit

- One commit per subtask (one concrete, reviewable slice). Multiple commits per task are expected.
- Before each commit: test in localhost; verify changed behavior; then commit.

## Pull Requests

- Open a PR when a task is completed (one coherent, reviewable unit). Keep PRs small and reviewable; deployable slices, not arbitrary splits.
- One PR does one thing on its own branch. Do not reuse a branch/PR for multiple changes.
- Analyze full commit history (not just latest commit). Use `git diff [base-branch]...HEAD` to see all changes.
- PR title: one line — what the PR does and why; action or outcome; `[BREAKING]` + migration note if needed.
- PR description: **What** (files/areas touched), **How** (approach taken), **Why** (intent/outcome). Optional: issue link, testing steps.
- Include test plan with TODOs.
- Push with `-u` flag if new branch.
- Add **Backend / Frontend impact** subsection for cross-service work.
- A reviewer with only branch name, title, and description should understand what, how, and why.

## Merge

- At least one approval; rebase/merge from `main` before final review; resolve conflicts in the branch that owns the area.
