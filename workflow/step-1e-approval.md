# /muggle-ai-teams → Step 1E: User Approval Gate

> Part of /muggle-ai-teams.
> **Load rules**: core.md, git.md, context-management.md

---

## Procedure

### 0. Generate visual mockups (if frontend changes)

IF the design includes user-facing changes:
  a. Read Tailwind config, globals.css, and existing component patterns — never guess fonts, colors, or spacing
  b. Invoke `frontend-design:frontend-design` to generate visual mockups
  c. These mockups will be presented alongside the design doc for approval

IF no user-facing changes: skip this step.

Present the user with:

1. **Final design document** (revised after panel review)
2. **Consolidated panel report** (what was found, what was addressed, what was deferred)
3. **Risk assessment** (remaining risks after addressing panel feedback)
4. **Visual mockups** (if generated above)
5. **Detailed cost-quality estimate** (see below)

### Cost-Quality Contract (present before asking for approval)

Now that design is done and slices are known, provide a detailed estimate:

```
## Cost-Quality Estimate

Spent so far (design phase): $X (from /cost)

Estimated remaining:
- N slices × ~$Y per slice (Sonnet engineer + quality gates) = $Z
- Code review (Opus reviewer, 3-pass) = ~$A
- QA per user-facing slice = ~$B each
- Total estimated: $TOTAL

Quality contract:
✅ Guaranteed: typecheck + lint + test pass, TDD enforced, code review done
✅ Guaranteed: per-slice QA for user-facing changes
✅ Guaranteed: all acceptance criteria have corresponding slices
⚠️ Not guaranteed: requirements are correct (that's what Steps 1A-1E tried to ensure)

Acceptance criteria coverage:
- [criterion 1] → covered by Slice X ✓
- [criterion 2] → covered by Slice Y ✓
- [criterion 3] → NOT covered (gap) ⚠️

Proceed with implementation? (yes / adjust scope / stop)
```

**This is the commit decision.** The user sees exactly what they're paying for and what quality they'll get. If there are coverage gaps, address them before proceeding.

### Decision

- **User approves** → proceed to Step 1F (Implementation Plan)
- **User requests changes** → revise scope, re-estimate, re-present
- **User stops** → save session, no further cost incurred

---

## Context Checkpoint (after approval)

After the user approves, perform these three actions in order:

### 1. Save session state
Run `/save-session` to persist full session state (recoverable if context limits are hit later).

### 2. Create git checkpoint
Run `/checkpoint create "design-approved"` to create a git-backed snapshot.

### 3. Compress design phase

Compress the entire design phase (Steps 1A-1E) into the final approved plan document. Only the plan document carries forward into Step 1F execution — not the raw research, panelist reports, or revision history.

**Compression procedure:**
1. Open the plan document at `muggle-ai-teams/projects/<project-name>/plans/<feature-name>.md`
2. Ensure all sections below are filled with synthesized content (not raw notes):
   - Research & Context (from 1A)
   - Requirements (from 1B)
   - Design (from 1C, revised after panel)
   - Panel Review Report (from 1D2, consolidated by theme)
3. **Remove** from the conversation context:
   - Raw research notes and web search results
   - Individual panelist reports (keep only the consolidated report)
   - Rejected design alternatives and revision history
   - Intermediate brainstorming output
4. The plan document must be **self-contained** — a fresh agent reading only this document should have enough context to execute Step 1F
5. Run `/compact` to free conversation context for the implementation phase

---

## Plan Document Verification

Before compressing, verify the plan document has these sections (each written by its respective step):
- **Research & Context** (from 1A)
- **Requirements** (from 1B)
- **Design** (from 1C, revised after panel)
- **Panel Review Report** (from 1D2)
- **Implementation Plan** (filled in Step 1F, after this step)

## Completion Criteria

- [ ] User explicitly approved the design
- [ ] Session state saved (`/save-session`)
- [ ] Git checkpoint created (`/checkpoint create "design-approved"`)
- [ ] Design phase compressed — plan document is self-contained
- [ ] Visual mockups generated (if frontend changes)
- [ ] `/compact` run to free context

## Next → Read `muggle-ai-teams/workflow/step-1f-plan.md`
