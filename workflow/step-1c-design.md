# /MuggleAI-Teams → Step 1C: Design Proposal

> Part of /MuggleAI-Teams.

---

## Procedure

### 1. Architecture design

Dispatch `feature-dev:code-architect` agent to design the architecture based on existing codebase patterns. Do NOT design it yourself.

### 2. Visual design (if UI changes)

**Do NOT invoke `frontend-design:frontend-design` yet.** Visual mockups happen AFTER panel review (Step 1D), because the panel may change the design significantly, making early mockups wasted work.

### 3. Propose 2-3 approaches

Invoke brainstorming for each approach with concrete trade-offs covering: performance, cost, complexity, maintainability, risk.

#### Skill Routing for Brainstorming (CRITICAL)

| Context | Skill to use |
|---------|-------------|
| Inside `/MuggleAI-Teams` workflow (you are here) | `workflow-aware-brainstorming` — recognizes parent workflow, stops before writing-plans, returns control to orchestrator for Step 1D |
| Standalone (no `/MuggleAI-Teams` active) | `superpowers:brainstorming` — follows its own full flow including transition to writing-plans |

**NEVER use `superpowers:brainstorming` directly inside `/MuggleAI-Teams`.** It will hijack the control flow and skip Panel Review (1D) and User Approval (1E).

### 4. Write design document

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

## Next → Read `MuggleAI-Teams/workflow/step-1d-panel-review.md`
