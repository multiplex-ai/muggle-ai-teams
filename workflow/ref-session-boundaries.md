# Reference: Session Boundaries

> Read when context pressure builds or at natural phase transitions.

## Natural Boundaries (proactively suggest save + new session)

- After Step 1E approval (design phase complete → `/save-session` + `/compact`)
- After completing a batch of slices in Step 2 (every 3-5 slices)
- Between phases in multi-phase projects
- After Step 5 push (before Step 6 learn)

## Context Pressure (reactive)

- If the suggest-compact hook fires twice → save session and recommend fresh start
- If the AI starts skipping steps or losing items → context is degraded, save immediately

## How to Save

Run `/save-session`. The session file captures current step, what's done, what's left, and the exact next action. Plan document + tracking files persist on disk.

## How to Resume

Next session runs `/muggle-ai-teams` → resume detection (Step 0) finds tracking files → offers to resume → runs `/resume-session` → continues from the saved step.
