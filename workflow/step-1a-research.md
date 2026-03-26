# /muggle-ai-teams → Step 1A: Research & Context Gathering

> Mindset: `muggle-ai-teams/contexts/research.md` — read widely before concluding.
> **Skills**: `superpowers:brainstorming`, `superpowers:writing-plans`, `frontend-design:frontend-design`
> **Tools**: `feature-dev:code-explorer`, `feature-dev:code-architect`, `WebSearch`, `Context7`, `EnterPlanMode`

Save all content to: `muggle-ai-teams/projects/<project-name>/plans/<feature-name>.md`

---

## 1. Project Bootstrap

If no project config exists → read `workflow/ref-project-bootstrap.md` and create one.

## 2. Classify Mission

- **Coding**: Changes code, config, tests, infrastructure, UI → continue below
- **Non-coding**: Documents, presentations, emails, planning → read `workflow/ref-non-coding-triage.md`

## 3. Triage — Score Complexity

| Signal               | Quick (+0) | Standard (+1) | Full (+2) |
|----------------------|-----------|---------------|-----------|
| Files affected       | 1-3       | 4-10          | 10+       |
| Scopes touched       | 1         | 1             | 2+        |
| Touches auth/security| No        | No            | Yes       |
| New API endpoints    | No        | Maybe         | Yes       |
| Schema/migration     | No        | No            | Yes       |
| User-facing flow     | Minor     | Moderate      | Major     |

**0-2 = Quick** | **3-6 = Standard** | **7+ = Full**

Present score breakdown to user. User confirms or overrides.

## 3b. Cost-Quality Estimate (present with triage)

After scoring, present the cost-quality contract:

| Tier | Est. Cost | What You Get | What You Don't Get |
|------|----------|-------------|-------------------|
| Quick ($0.5-2) | Sonnet engineer only | Working code, tests pass | No design review, no QA, no panel |
| Standard ($5-20) | Opus orchestrator + Sonnet engineers | Design + TDD + per-slice QA + code review | No panel review, no regression sweep |
| Full ($50-100+) | Full team | Everything above + panel + regression sweep | Requirements correctness not guaranteed |

Tell the user: "Based on [tier], estimated cost is $X-Y. You'll get [quality level]. Proceed?"

**Cost warning for Full tier**: Full tier involves Opus orchestrator through 12 steps, specialist design agents, 6-panelist Opus review, per-slice execution, 3-pass code review, and learning. **Expect $50 minimum for Full tier, potentially $100+ for complex multi-phase projects.** The design phase alone (Steps 1A-1E) typically costs $30-50 before any code is written.

**This is a go/no-go decision point.** If the user says the cost is too high, discuss scope reduction or tier downgrade before continuing.

## 4. Route

- **Quick (0-2)**: Hand off to `/muggle-do` with context. **STOP.**
- **Standard / Full**: Continue to Phase 5.

Tier can be escalated later (1B, 1C, 1F) if unexpected complexity is discovered.

## 5. Research — Complete ALL items for your tier

### Standard (3-6)

| # | Action | Done? |
|---|--------|-------|
| 1 | Dispatch `feature-dev:code-explorer` — trace code paths, map affected files | [ ] |
| 2 | `WebSearch` — 1 targeted query (skip if domain well-understood) | [ ] |
| 3 | Skill search — local skills + SkillsMP (assign to agents, not orchestrator) | [ ] |
| 4 | `Context7` — docs for unfamiliar libraries only | [ ] |
| 5 | `EnterPlanMode` — structured reasoning on approach | [ ] |

### Full (7+)

| # | Action | Done? |
|---|--------|-------|
| 1 | Dispatch `feature-dev:code-explorer` — trace code paths, map affected files | [ ] |
| 2 | `WebSearch` — 3+ queries, document findings | [ ] |
| 3 | Skill search — local + SkillsMP (follow `workflow/procedure-skillsmp-search.md`) | [ ] |
| 4 | `Context7` — docs for all relevant libraries | [ ] |
| 5 | Dispatch `feature-dev:code-architect` — architecture design | [ ] |
| 6 | Check package registries — prefer battle-tested over hand-rolled | [ ] |
| 7 | Search for adaptable open-source implementations | [ ] |
| 8 | `EnterPlanMode` — structured reasoning on architecture | [ ] |

**Do NOT skip items. Check each off as completed. If skipping, document why.**

## Output — Write to plan document

Context summary must include a **Skills Found** section:

```
## Skills Found (Step 1A)
| Skill | Source | Assign to | Purpose |
|-------|--------|-----------|---------|
| /ui-ux-pro-max | local | Design specialist (1C) + Frontend engineer (2) | UI/UX patterns |
| /pricing-strategy | local | GTM specialist (1C) | Pricing page design |
| /payment-security | SkillsMP | Security panelist (1D1) | Stripe PCI compliance |
```

This table is read by Steps 1C, 1D1, 1F, and 2 for skill assignment. Without it, skills are forgotten.

## Completion Criteria

- [ ] Project config exists
- [ ] Mission classified (coding / non-coding)
- [ ] Triage completed — tier assigned with score breakdown, user confirmed
- [ ] ALL research items for tier completed (or skip documented)
- [ ] **Skills Found table written in plan document**
- [ ] Context summary written in plan document

## Next → Read `muggle-ai-teams/workflow/step-1b-requirements.md`
