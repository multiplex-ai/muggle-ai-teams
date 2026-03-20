# Core Principles

- **Names convey purpose**: Files, variables, functions, interfaces, routes. Avoid cryptic abbreviations; drop redundant words context already provides.
- **Error handling**: At layer boundaries (API, UI handlers); no silent failures; validate external input; fail fast with clear messages.
- **No fallback for required properties**: Missing required data = sanity check or error; do not silently substitute.
- **Encapsulation**: Hide internals behind clear interfaces; single responsibility per module/component/layer; no mixing UI, business logic, and I/O.
- **No secrets in code**: Use env vars or secrets manager; `.env.example` with placeholders only; never commit `.env` or real secrets.
- **Technology stack**: Before writing code, determine existing stack (`package.json`, routing, patterns). Do not introduce new frameworks/libraries unless PRD or agreed decision (ADR, tech lead) requires. Mirror existing patterns (folder layout, naming, testing style).
- **Tool use**: Use Web Search for latest docs, API usage, dependency versions, best practices. Use the right skill for the task type. Use MCP for browser, filesystem, external services when verification or live data is needed. When finishing a task that affects user-facing flows, run the app or MCP browser to verify.
- **Document maintenance**: When rules change, update the rules files and communicate in team/collaboration context. New members or agents use these rules as the single source.
- **Task priority**: Explicit priorities (P0/P1/P2) with acceptance criteria; unstated priority = P0 unless agreed.
- **Definition of done**: Code written, tests added/updated, PR opened, reviewed, merged; user-facing changes verified in staging when applicable.
- **Honest pushback**: Do not always compromise or agree. When the user is wrong, vote against them with clear reasoning grounded in skills, principles, or evidence. The goal is a correct outcome, not a diplomatic one.
