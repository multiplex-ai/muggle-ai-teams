# /MuggleAI-Teams — Reference

Quick reference for error recovery, agent/skill lookup, and maintenance.

---

## Error Recovery

| Situation | Action |
|-----------|--------|
| Quick question during workflow execution | Use `/aside <question>` to get an answer without losing workflow state |
| Long-running workflow | Use `/save-session` periodically to ensure recoverability |
| Quality gates fail repeatedly | Escalate to user (likely architectural issue, not a code fix) |
| Same finding persists after 2 fix attempts | Escalate to user: (A) accept risk, (B) redesign, (C) different approach |
| User issue unreproducible | Ask for screenshots/console errors; invoke `superpowers:systematic-debugging` |
| Parallel file conflict | Orchestrator resolves before committing; prevent by declaring file ownership in planning |
| No progress for 10 minutes | Checkpoint current state and alert user (stuck agent detection) |

---

## Quick Reference: Agents & Skills by Phase

| Phase | Agent / Skill | When |
|-------|--------------|------|
| Research | `feature-dev:code-explorer`, `WebSearch`, `Context7`, `EnterPlanMode` | Step 1A: understand current state + landscape |
| Design | `feature-dev:code-architect`, `frontend-design:frontend-design`, `workflow-aware-brainstorming` | Step 1C: architecture + visual design + approach exploration |
| Panel Review | `superpowers:dispatching-parallel-agents` + specialist panelists | Step 1D: multi-expert scrutiny of design |
| Plan | `superpowers:writing-plans` | Step 1F: implementation slices |
| Execute | `superpowers:executing-plans` | Running the plan sequentially |
| Execute | `superpowers:dispatching-parallel-agents` | 2+ independent slices |
| Execute | `superpowers:test-driven-development` | Every engineer agent slice |
| Debug | `superpowers:systematic-debugging` | Any bug, test failure, or unexpected behavior |
| Verify | `superpowers:verification-before-completion` | Before claiming work is done |
| Review | `superpowers:requesting-code-review` | After all slices committed locally |
| Review | `superpowers:receiving-code-review` | Processing reviewer findings |
| Push & Finish | `superpowers:finishing-a-development-branch` | Push to remote + PR after review passes |
| Learn | `claude-md-management:revise-claude-md` | Graduate learnings into persistent rules |

---

## Sync Check

After updating any agent or workflow file, run: `scripts/sync-agents.sh`
