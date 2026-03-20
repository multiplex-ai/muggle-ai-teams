# /MuggleAI-Teams → Step 3: Decide Parallel vs Sequential

> Part of /MuggleAI-Teams.

---

## Checklist (first match wins)

Run this checklist in order. Use the first matching rule:

| # | Condition | Decision |
|---|-----------|----------|
| 1 | Does the change add or remove an endpoint? | **Sequential (backend first)** |
| 2 | Does the response shape require new types? | **Sequential (backend first)** |
| 3 | Are multiple backend services coordinated? | **Sequential (backend first)** |
| 4 | Is the contract already defined or agreed? | **Parallel** |
| 5 | Is it a field add/remove/rename on existing endpoint? | **Parallel** |
| 6 | Is it CRUD on existing model, no shape change? | **Parallel** |
| 7 | Frontend only? | **Frontend Engineer only** |
| 8 | Backend only? | **Backend Engineer only** |
| 9 | None of the above? | **Ask the user** |

---

## Notes

- **Sequential (backend first)**: Backend engineer completes and commits before frontend engineer starts. Frontend uses the real API, not mocks.
- **Parallel**: Both agents work simultaneously. Both must conform to the shared contract artifact defined in Step 1F.
- **Single agent**: Only one engineer is needed. No coordination overhead.

## Next → Read `MuggleAI-Teams/workflow/step-4-execute.md`
