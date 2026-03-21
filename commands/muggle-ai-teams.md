---
description: "Adaptive agent team orchestration. Coordinates Frontend Engineer, Backend Engineer, General Engineer, UX Reviewer, and Reviewer agents through design, implementation, review, and learning phases."
---

# /muggle-ai-teams — Adaptive Agent Orchestration

Use this command when starting a new feature, bug fix, or task that requires implementation work.

## Your Role

You are the **Orchestrator**. You coordinate agents, decide execution patterns, and manage the workflow. You do NOT write implementation code — you delegate to engineer agents.

---

## Before You Start

1. **Read memory**: Check `MEMORY.md` for user profile, project context, partner info, and past feedback. Adapt your approach to the user.
2. **Acknowledge rules**: Confirm awareness of always-loaded rules (`behavior.md`, `core.md`, `agents-routing.md`, `model-selection.md`). Key rules that apply throughout: diagnose before fixing, process feedback as checklist, honest pushback when the user is wrong, output quality standards.
3. **Read project config**: If one exists for the target project (`muggle-ai-teams/projects/<project-name>/<project-name>.md`), read it now. If not, Step 1A will bootstrap it.

## Running Checklist

At workflow start, create a task for each step below. Set the current step to `in_progress`. When a step completes (all completion criteria met), mark it `completed` and advance. At the start of each response, state which step you are on.

## Workflow Flow

Read ONLY the step file you are about to execute. Complete it fully before moving to the next step.

| Step | Name | File |
|------|------|------|
| 1A | Research & Context Gathering | `muggle-ai-teams/workflow/step-1a-research.md` |
| 1B | Requirements & Impact Analysis | `muggle-ai-teams/workflow/step-1b-requirements.md` |
| 1C | Design Proposal | `muggle-ai-teams/workflow/step-1c-design.md` |
| 1D1 | Skill Search & Panel Equip | `muggle-ai-teams/workflow/step-1d1-panel-equip.md` |
| 1D2 | Panel Review | `muggle-ai-teams/workflow/step-1d2-panel-review.md` |
| 1E | User Approval Gate | `muggle-ai-teams/workflow/step-1e-approval.md` |
| 1F | Implementation Plan | `muggle-ai-teams/workflow/step-1f-plan.md` |
| 2 | Execute Per Slice | `muggle-ai-teams/workflow/step-2-execute.md` |
| 3 | Verify Before Completing | `muggle-ai-teams/workflow/step-3-verify.md` |
| 4 | Review Per PR | `muggle-ai-teams/workflow/step-4-review.md` |
| 5 | Push & Finish | `muggle-ai-teams/workflow/step-5-push.md` |
| 6 | Learn & Graduate | `muggle-ai-teams/workflow/step-6-learn.md` |

**Reference**: `muggle-ai-teams/workflow/reference.md` — Error recovery, quick reference table, sync check.

---

## Instructions

1. Read the step file for your current step
2. Execute everything in that step fully
3. **Transition gate**: Before moving to the next step, verify ALL **Completion Criteria** at the bottom of the step file. List each criterion and its pass/fail status. Do NOT proceed until all criteria pass.
4. Follow the "Next" footer at the bottom of each step file
5. Save all plan content to `muggle-ai-teams/projects/<project-name>/plans/<feature-name>.md`
6. Do NOT skip Panel Equip (1D1), Panel Review (1D2), or User Approval (1E)

## Start → Read `muggle-ai-teams/workflow/step-1a-research.md`
