# Procedure: Agent Dispatch

This procedure applies to EVERY agent dispatch in the workflow (Steps 1C, 1D, 1F, 2, 4).

---

## Pre-Dispatch Checklist

Before calling the Agent tool, verify ALL of these:

- [ ] **Skills table**: Re-read the Skills Found table in `projects/<name>/plans/<feature>.md`
- [ ] **Skill files read**: For each skill relevant to THIS dispatch, read the full SKILL.md file
- [ ] **Prompt includes skills**: Agent prompt has a `## Skills` section with full skill text (not just names)
- [ ] **Relevance filter**: Only skills that help THIS specific agent are included (no context overloading)
- [ ] **Completion criteria**: Agent prompt states what "done" looks like for this dispatch
- [ ] **Execution budget**: Agent prompt includes a `## Budget` section with read limit and scope cap (see below)

---

## When to Include Skills

**Always include skills** for task-executing agents:
- Frontend Engineer, Backend Engineer, General Engineer
- Architect, Planner, TDD Guide
- Reviewer, Security Reviewer, UX Reviewer

**OK to skip skills** for pure read-only agents:
- Code Explorer (just traces references)
- Docs Lookup (just fetches documentation)
- Any agent whose sole job is reading files and reporting back

---

## Dispatch Prompt Template

```markdown
## Task
[What the agent must do — specific, scoped, with acceptance criteria]

## Context
[Relevant background — plan decisions, prior agent output, constraints]

## Budget
- **Max files to read**: [N] (typically 5-8 for context, never more than 12)
- **Max files to create/modify**: [N] (typically 1-5)
- **Scope boundary**: Only read files listed in ## Files. Do NOT explore beyond these.
- **Output-first rule**: After reading the listed files, START PRODUCING OUTPUT. Do not search for additional files unless a listed file explicitly references one you need.

## Files
[Key files to read or modify — absolute paths. Be exhaustive so the agent doesn't need to explore.]

## Skills

### Skill: <skill-name>
[Full text of the skill, copied from the SKILL.md file]

### Skill: <skill-name-2>
[Full text of the second skill, if applicable]

## Completion Criteria
- [Concrete, verifiable conditions for "done"]
```

---

## Good vs Bad Dispatches

### Bad: Skills mentioned but not included

```markdown
## Task
Implement the cost tracking module.

## Skills
See /cost-aware-llm-pipeline and /agentic-engineering.
```

Problem: Agent cannot "see" skill files. It gets zero guidance.

### Bad: All skills dumped regardless of relevance

```markdown
## Skills
### Skill: cost-aware-llm-pipeline
[800 lines of cost pipeline design...]

### Skill: continuous-learning-v2
[600 lines of learning system design...]

### Skill: eval-harness
[500 lines of eval framework...]
```

Problem: Context overloading. Agent wastes tokens parsing irrelevant skills.

### Bad: Unbounded scope with no execution budget

```markdown
## Task
Design specifications for 2 subsystems across 10 files.

## Files
Read these 6 files for context, then design 4 new files.
```

Problem: Agent reads all 6 files, then explores referenced files, then explores those references... never starts writing. Ran for 48 minutes, never produced output. **Always include a Budget section with explicit read limits and the output-first rule.**

### Good: Relevant skills included in full, with budget

```markdown
## Task
Implement the cost tracking module for per-task token counting.

## Budget
- Max files to read: 5
- Max files to create/modify: 2
- Output-first rule: After reading the 3 files below, start writing immediately.

## Skills

### Skill: cost-aware-llm-pipeline
[Full text — model routing, budget tracking, token counting patterns]

### Skill: agentic-engineering
[Full text — 15-min unit rule, cost discipline section especially relevant]

## Completion Criteria
- Token counting works for all model tiers
- Budget tracking persists across session boundaries
- Unit tests cover the 3 main scenarios
```

Problem: None. Agent has exactly what it needs and knows when to stop reading.

---

## Rules

1. **No dispatch without check.** The PreToolUse hook will remind you, but the checklist is your responsibility.
2. **Read, don't reference.** Agents cannot read skill files themselves. You must paste the full text.
3. **Filter by relevance.** A frontend engineer does not need backend deployment skills. Match skills to the agent's task.
4. **One checklist per dispatch.** If dispatching 3 agents in parallel, run the checklist 3 times — once per agent with its own relevant skills.
5. **Scope cap: 5 files per agent.** If a task touches more than 5 files, split into multiple focused agents. One agent that designs 10 files will explore forever. Two agents that design 5 files each will finish in parallel.
6. **Output-first rule.** Every dispatch must include the instruction: "After reading the listed files, START PRODUCING OUTPUT." Agents without this instruction default to unbounded exploration.
7. **Foreground for critical path.** If you need the agent's output before you can continue, run it in foreground (default). Only use `run_in_background` for truly independent work you don't need immediately — and monitor it.
