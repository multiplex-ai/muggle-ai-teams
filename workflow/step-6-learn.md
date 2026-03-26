# /muggle-ai-teams → Step 6: Learn & Graduate

> Part of /muggle-ai-teams.
> **Load rules**: core.md

After every workflow run (whether successful or abandoned), the orchestrator reflects on the run and graduates learnings so the system gets smarter with every use.

---

## 6.1: Capture Run Log

Append to the plan document — template at `workflow/ref-run-log-template.md`. Sections: what went well, what went poorly, panelist performance, user feedback, bug root causes, cost.

## 6.2: Reflect

From the run log, identify learnings:
1. **What went well** — WHY it worked, which agent/skill/step contributed
2. **What went poorly** — root cause (bad step? wrong agent? missing skill? vague rule?)
3. **User feedback** — highest priority, direct signals
4. **Bug root causes** — prevention rule for this class of bug in ALL projects

---

## 6.3: Graduate — Write to the Right Place

### Scope Decision (MANDATORY — do this FIRST for every learning)

Before choosing a target file, classify each learning's scope:

| Scope | Test | Where it lives |
|-------|------|----------------|
| **Project-only** | Would this learning be wrong or irrelevant in a different project? (e.g., "use zustand not Redux", "this API returns paginated results") | Per-repo `CLAUDE.md` or project config |
| **Global** | Would this learning apply to ANY project regardless of stack/domain? (e.g., "never use floating-point for currency", "always diagnose before fixing") | `rules/*.md`, agent definitions, workflow steps |

**When in doubt, default to project-only.** It's easy to promote a project learning to global later. A wrong global rule pollutes every future project.

**Anti-pattern:** Writing a React-specific pattern to `rules/core.md` where it applies to Go projects too. Stack-specific learnings belong in the repo's `CLAUDE.md`, not in global rules.

### Target Selection

Learnings must be written where they will be **automatically loaded** in future runs. The target depends on what kind of learning it is — use judgment:

| Learning about... | Graduate to | Examples |
|-------------------|------------|---------|
| How to work with user | `rules/behavior.md` | "User wants terse responses", "Always diagnose before fixing" |
| Workflow process | Workflow step file (`workflow/step-*.md`) | "Step 1A should check for existing PRs first" |
| Agent behavior | Agent definition (`~/.claude/agents/<agent>.md`) | "Frontend engineer should always check responsive layout" |
| Agent dispatch / routing | `rules/agents-routing.md` | "CSS bugs need frontend-engineer, not general-engineer" |
| Panelist selection | `workflow/step-1d1-panel-equip.md` | "Security panelist not needed for pure UI tasks" |
| Skill usage | Skill file or step that invokes it | "TDD skill should skip for config-only changes" |
| Code quality / testing | `rules/core.md` or `rules/quality-gates.md` | "Always test error boundaries in React components" |
| Git/PR convention | `rules/git.md` | "Include migration steps in PR description" |
| Bug class prevention | Per-repo `CLAUDE.md` or `rules/core.md` | "Never use floating-point for currency calculations" |
| Project-specific pattern | Per-repo `CLAUDE.md` | "This project uses zustand, not Redux" |
| Model selection | `rules/model-selection.md` | "Sonnet can't handle X type of task" |

**Never save to memory only** — memory requires active recall and is unreliable. Rules, agents, steps, and skills are automatically loaded.

**Sensitive data check**: Before writing, verify no secrets, tokens, PII, or internal URLs. Abstract sensitive context.

**Compress when needed**: If a target file accumulates many similar rules, merge related ones into fewer general rules.

---

## Completion Criteria

- [ ] Run log captured (what went well, what went poorly, panelist performance, user feedback, bug causes)
- [ ] Learnings identified across all 4 categories
- [ ] Each learning scoped correctly (project-only vs global) — when in doubt, project-only
- [ ] Each learning graduated to the correct target (step, rule, agent, skill, or project config)
- [ ] No sensitive data in any graduated content

## Workflow Complete

This is the final step. The goal: **every run makes the next run better.**
