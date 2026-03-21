# /muggle-ai-teams → Step 1D2: Panel Review

> Part of /muggle-ai-teams.
> **Skill**: `superpowers:dispatching-parallel-agents`
> **PREREQUISITE**: Step 1D1 must be completed first. If no augmented panel was confirmed in 1D1, go back and complete it.

Two-round panel review. Round 1 runs core + domain panelists. The Blind Spot Reviewer's findings determine which gap panelists are needed in Round 2.

---

## Adaptive Selection

The orchestrator selects only panelists relevant to this specific design — not all of them. Before dispatch, present the selected panel to the user for confirmation. Over time, the orchestrator learns from past run logs which panelists produce valuable findings for this codebase and makes smarter selections.

## Escalation Rule

No hard cap on revision cycles. Continue until MUST ADDRESS = 0. If the **same finding** persists after **2 fix attempts**, escalate to user with options:
- (A) Accept the risk
- (B) Redesign this part
- (C) Try a different approach

---

## Round 1: Core + Domain Panelists (parallel)

### Core panelists (always run)

| Panelist | Focus |
|----------|-------|
| **Architecture Expert** | Scalability, design patterns, over-engineering risk, system boundaries, data consistency |
| **Security Reviewer** | Auth flows, data exposure, injection vectors, OWASP top 10, secrets handling |
| **Stress Test Reviewer** | Unhappy paths, edge cases, race conditions, abuse scenarios. For every feature in the design, asks: What if the input is wrong? What if it's malicious? What if the service is down? What if the user does things out of order? What if two users act simultaneously? What are the boundary conditions (empty, max, special characters)? |
| **Blind Spot Reviewer** | What is this design MISSING that it should address? Researches online for what similar products/features typically include. Returns a list of gaps with recommended gap panelists for Round 2. |

### Domain panelists (auto-selected based on what the design touches)

| Panelist | Triggers when | Focus |
|----------|--------------|-------|
| **Frontend Architect** | Design touches UI components or state | Component structure, state management, rendering performance, bundle impact, code splitting |
| **Backend Architect** | Design touches APIs or data layer | API design, data modeling, query performance, caching strategy, error handling |
| **UI/UX/UE Expert** | Design has user-facing changes | User flows, visual hierarchy, interaction patterns, loading/error/empty states, micro-interactions |
| **Mobile/Responsive Expert** | Design has visual/layout changes | Cross-platform compatibility, responsive breakpoints, touch targets, mobile performance |
| **Database/Data Expert** | Design changes data models or queries | Schema design, migration strategy, indexing, data integrity, backup/rollback |

---

## Panelist Output Formats

Each panelist subagent receives its output format from `muggle-ai-teams/workflow/procedure-panelist-formats.md`. Include the relevant format in each panelist's dispatch prompt. All panelists use the MUST ADDRESS / SHOULD ADDRESS / CONSIDER structure. Stress Test and Blind Spot Reviewers have additional specialized sections.

---

## Between Rounds

The orchestrator:

1. Reads the Blind Spot Reviewer's GAPS FOUND
2. Maps each gap to the appropriate gap panelist
3. Presents to user: "Blind Spot Reviewer found N gaps. Recommending these gap panelists for Round 2: [list]. Want to add or remove any?"
4. User confirms → dispatch Round 2
5. If no gaps found → skip Round 2

---

## Round 2: Gap Panelists (parallel, only if gaps found)

### Gap panelist roster (dispatched only when recommended by Blind Spot Reviewer)

| Panelist | Typical gap trigger | Focus |
|----------|-------------------|-------|
| **SEO/GEO/AEO Specialist** | Discoverability, meta tags, structured data | Search engine optimization, generative engine optimization, AI engine optimization, sitemaps, canonical URLs, Open Graph, schema.org markup |
| **Analytics/Growth Expert** | Tracking, metrics, user behavior | Event tracking, conversion funnels, A/B testing hooks, user behavior analytics, KPI instrumentation |
| **Web Performance Expert** | Performance budget, load times | Core Web Vitals, Lighthouse scores, lazy loading, image optimization, caching headers, CDN strategy |
| **Accessibility Expert** | a11y beyond basic WCAG | Screen reader testing, keyboard navigation, color contrast, ARIA patterns, focus management, reduced motion |
| **i18n/Localization Expert** | Multi-language, locale handling | String externalization, RTL support, date/number formatting, locale-aware content, translation workflow |
| **Privacy/Compliance Reviewer** | Data handling, privacy, legal | GDPR, CCPA, cookie consent, data retention, PII handling, terms of service implications |
| **DevOps/Infrastructure Expert** | Deployment, scaling, monitoring | CI/CD impact, environment variables, feature flags, rollback strategy, monitoring/alerting |

Gap panelists use the same output format as Round 1 (MUST ADDRESS / SHOULD ADDRESS / CONSIDER / APPROVED ASPECTS).

---

## After Both Rounds Complete

1. **Synthesize**: Orchestrator consolidates ALL panelist feedback (both rounds) into a single report, grouped by theme (not by panelist) to eliminate duplication
2. **Prioritize**: Rank all MUST ADDRESS items. If panelists contradict each other, flag the conflict for user decision.
3. **Revise design**: Address all MUST ADDRESS items and all UNHAPPY PATHS flagged by Stress Test Reviewer. Present SHOULD ADDRESS items to user for decision.
4. **Optional re-review**: If design changed significantly, re-run affected panelists only (not the full panel)

---

## Output

Add to the plan document:

```markdown
## Panel Review Report
- Panel composition: [which panelists were selected and why]
- MUST ADDRESS: [consolidated findings, grouped by theme]
- SHOULD ADDRESS: [consolidated, with user decisions]
- Blind spots surfaced: [what the team hadn't considered]
- Design revisions made: [how the design changed in response]
```

## Completion Criteria

- [ ] Round 1 panelists dispatched and reports collected
- [ ] Round 2 dispatched if Blind Spot Reviewer found gaps (or skipped with reason)
- [ ] All MUST ADDRESS items = 0 (resolved or user-accepted)
- [ ] Consolidated panel report written in plan document
- [ ] Design revised based on panel feedback

## Next → Read `muggle-ai-teams/workflow/step-1e-approval.md`
