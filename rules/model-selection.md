# Model Selection Strategy

**Opus** — Reasoning, diagnosis, and evaluation:
- Bug diagnosis (root cause analysis, blast radius mapping)
- Architectural decisions and system design (architect agent)
- Code review — 3-pass reviewer
- Planning and research phases (planner agent)
- UX review (ux-reviewer agent)
- Orchestrator context (always Opus — coordinates workflow)

**Sonnet** — Implementation and execution:
- Feature implementation (frontend-engineer, backend-engineer, general-engineer)
- Bug fix execution (AFTER Opus diagnosis provides root cause + fix spec)
- Build error resolution (build-error-resolver)
- E2E test generation (e2e-runner)
- Security review (security-reviewer)
- TDD guidance (tdd-guide)
- Refactoring (refactor-cleaner)

**Haiku** — Lightweight, high-frequency tasks:
- Documentation lookups (docs-lookup via Context7)
- Documentation updates (doc-updater)
- Simple code generation and formatting

## Debugging: Diagnosis vs Execution

Bug work is split across two model tiers:
1. **Diagnosis (Opus)**: Orchestrator traces root cause, maps blast radius, writes fix spec with `file:line` evidence
2. **Execution (Sonnet)**: Engineer agent receives the fix spec and implements the change

Engineers MUST NOT receive vague bug descriptions. If they do, they return immediately and ask for diagnosis.
