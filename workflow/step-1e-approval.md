# /MuggleAI-Teams → Step 1E: User Approval Gate

> Part of /MuggleAI-Teams.

---

## Procedure

Present the user with:

1. **Final design document** (revised after panel review)
2. **Consolidated panel report** (what was found, what was addressed, what was deferred)
3. **Risk assessment** (remaining risks after addressing panel feedback)

### Decision

- **User approves** → proceed to Step 1F (Implementation Plan)
- **User requests changes** → revise and optionally re-run affected panelists, then return here

---

## Context Checkpoint (after approval)

After the user approves, perform these three actions in order:

### 1. Save session state
Run `/save-session` to persist full session state (recoverable if context limits are hit later).

### 2. Create git checkpoint
Run `/checkpoint create "design-approved"` to create a git-backed snapshot.

### 3. Compress design phase
Compress the entire design phase (Steps 1A-1E) into the final approved plan document. Only the plan document carries forward into Step 4 execution — not the raw research, panelist reports, or revision history.

---

## Plan Document Template Structure

The plan document at `docs/superpowers/plans/YYYY-MM-DD-<feature>.md` should follow this structure:

```markdown
# [Feature Name]

## Research & Context
- Current state: [what exists, affected files/services]
- Industry research: [how others solve this, best practices found]
- Library docs: [relevant API references]

## Requirements
- [Clarified requirements]
- Impact analysis: [files, services, flows affected]
- Dependencies: [what must exist first]
- Risks: [what could go wrong]

## Design
- Goal: [one sentence]
- Approach: [2-3 sentences]
- Data flow / API shapes: [as needed]
- Component structure: [if UI changes]
- Error states & edge cases: [as needed]
- Trade-offs: [why this approach over alternatives]

## Panel Review Report
- Panel composition: [which panelists were selected and why]
- MUST ADDRESS: [consolidated findings, grouped by theme]
- SHOULD ADDRESS: [consolidated, with user decisions]
- Blind spots surfaced: [what the team hadn't considered]
- Design revisions made: [how the design changed in response]

## Implementation Plan
- Mode: [parallel / sequential / single agent]
- Slices:
  - Slice 1: [description] → Agent: [X] → Test: [Y]
  - Slice 2: ...
```

## Next → Read `MuggleAI-Teams/workflow/step-1f-plan.md`
