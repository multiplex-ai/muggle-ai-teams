# Planning

## Documentation and Phase Plans

- **Repo docs**: Keep in repo (e.g. `doc/`) — ADRs, runbooks, API contracts, phase plans. Version with code; review in PRs.
- **Phase plans** (e.g. `doc/detail-modal-redesign-phase-plan.md`):
  - Before each phase: plan and To-Do list are written/updated. Do not start implementation before review/confirmation.
  - One phase = one PR: new branch from previous phase branch; implement phase; open PR comparing to previous phase branch so diff is only that phase.
  - When a phase or subtask is completed: update the phase plan — check off the corresponding To-Do items so the plan reflects current state.

## Task Priority and Definition of Done

- Explicit priorities (P0/P1/P2) with acceptance criteria; unstated priority = P0 unless agreed.
- **Done** = code written, tests added/updated, PR opened, reviewed, merged; user-facing changes verified in staging when applicable.

## Observability and Operations

- Structured logging; correlation/request IDs; no passwords/tokens/PII in logs. Exceptions to one place (error aggregation).
- Health checks, metrics, alerts for critical paths; SLOs and alert rules defined.
- Env config (e.g. `.env.staging`) without committing secrets; rollback policy stated.
