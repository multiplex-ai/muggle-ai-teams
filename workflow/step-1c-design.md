# /MuggleAI-Teams → Step 1C: Design Proposal

> Part of /MuggleAI-Teams.

---

## Procedure

### 1. Architecture design

Dispatch `feature-dev:code-architect` agent to design the architecture based on existing codebase patterns. Do NOT design it yourself.

### 2. Propose 2-3 approaches

Invoke `workflow-aware-brainstorming` for each approach with concrete trade-offs covering: performance, cost, complexity, maintainability, risk.

### 3. Write design document

Add to the plan document:
- Goal (one sentence)
- Chosen approach (2-3 sentences)
- Data flow / API shapes (as needed)
- Component structure (if UI changes)
- Error states & edge cases (as needed)
- Trade-offs (why this approach over alternatives)

---

## Important

Proceed directly to Panel Review — user approval happens AFTER the panel scrutinizes the design (Step 1E).

## Completion Criteria

- [ ] Architecture designed by `feature-dev:code-architect` (not self-designed)
- [ ] 2-3 approaches proposed with concrete trade-offs
- [ ] Design document written in plan file (goal, approach, data flow, trade-offs)

## Next → Read `MuggleAI-Teams/workflow/step-1d1-panel-equip.md`
