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

Compress the entire design phase (Steps 1A-1E) into the final approved plan document. Only the plan document carries forward into Step 1F execution — not the raw research, panelist reports, or revision history.

**Compression procedure:**
1. Open the plan document at `MuggleAI-Teams/projects/<project-name>/plans/<feature-name>.md`
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
- [ ] `/compact` run to free context

## Next → Read `MuggleAI-Teams/workflow/step-1f-plan.md`
