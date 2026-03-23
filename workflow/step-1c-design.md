# /muggle-ai-teams → Step 1C: Design Proposal

> Part of /muggle-ai-teams.
> **Load rules**: core.md, coding.md, agents-advanced.md, model-selection.md

---

## Why Specialists

Engineer agents (frontend-engineer, backend-engineer, general-engineer) are for writing CODE in Step 2. They are not designed for design work.

The orchestrator cannot be equipped with multiple skills simultaneously. Design requires domain expertise that spans several disciplines: UI/UX, API design, SEO, security, performance, and responsive layout.

**Solution**: Spawn specialist subagents via the Agent tool, each equipped with the relevant skills for their domain. Each specialist produces a focused design section. The orchestrator then combines their outputs into a unified design document.

---

## Procedure

### Step 1: Identify design domains needed

Review the research from Step 1A and the project config to determine which domains this task touches.

| Domain | When needed | Specialist | Equipped Skills |
|--------|-------------|-----------|----------------|
| Frontend UI/UX | User-facing changes | Frontend Design Specialist | ui-ux-pro-max, frontend-patterns |
| API / Data | New endpoints, schema changes | API Design Specialist | api-design, backend-patterns, postgres-patterns |
| SEO / Content | Content pages, discoverability | SEO Specialist | ai-seo, schema-markup, seo-content |
| Security | Auth, data handling, input validation | Security Design Specialist | security-review |
| Performance | High-traffic paths, heavy queries | Performance Specialist | backend-patterns (perf sections) |
| Mobile / Responsive | Layout-sensitive changes | Mobile Specialist | frontend-patterns (responsive sections) |

### Step 2: Spawn specialists in parallel

Determine the tier and dispatch accordingly:

- **STANDARD TIER**: 1-2 specialists (only the domains the task directly touches)
- **FULL TIER**: 2-4 specialists (primary domains + supporting domains)

Each specialist receives:
- A design-focused prompt scoped to their domain
- The relevant skill content injected into their prompt
- Research output from Step 1A
- The project config for architecture and codebase context

### Step 3: Orchestrator combines into unified design

After all specialists return:
1. Resolve conflicts between specialist outputs (e.g., performance vs. UX trade-offs)
2. Ensure consistency across domain boundaries (e.g., API shapes match what frontend expects)
3. Write a unified design document incorporating all specialist sections
4. Present 1-2 approaches with concrete trade-offs covering: performance, cost, complexity, maintainability, risk

### Step 4: Specialist output format

Each specialist subagent must structure its output as:

- **Goal**: One sentence describing what the design achieves in this domain
- **Proposed design**: Concrete design details (components, API shapes, schema, etc.)
- **Constraints**: Technical or business constraints that shaped the design
- **Edge cases**: Failure modes, boundary conditions, error states
- **Dependencies**: What this domain's design depends on from other domains

## Non-Coding Mode (if mission = non-coding)

When the mission is non-coding, the specialist-driven design works the same way — but with different specialists and different output.

### Non-coding specialist → skill mapping

| Task Domain | Specialist | Skills to Equip |
|-------------|-----------|-----------------|
| Investor materials | Investor Specialist | investor-materials, sales-enablement |
| Cold outreach | Outreach Specialist | cold-email, copywriting |
| Presentations | Presentation Specialist | frontend-slides, copywriting |
| Marketing strategy | Marketing Specialist | marketing-ideas, content-strategy, launch-strategy |
| SEO/GEO campaign | SEO Specialist | seo-plan, ai-seo, geo-main |
| Email campaigns | Email Specialist | email-sequence, copywriting |
| Sales materials | Sales Specialist | sales-enablement, competitor-alternatives |
| Content creation | Content Specialist | article-writing, copywriting, social-content |
| Pricing/packaging | Pricing Specialist | pricing-strategy |
| Trip/event planning | Planning Specialist | (no skill — general research via WebSearch) |
| UI/UX design docs | Design Specialist | ui-ux-pro-max, frontend-patterns |

### Non-coding specialist output format

Each specialist writes:
- **Section**: Which part of the deliverable they own
- **Proposed content/structure**: Concrete outline, not vague (e.g., slide titles, email subject lines, itinerary items)
- **Tone/style guidance**: How this section should read
- **Research findings**: What they discovered that informs the content
- **Dependencies**: What they need from other specialists or the user

### Orchestrator combines (same as coding mode)
Resolve conflicts, ensure consistent tone/style, write unified design document.

---

## Important

Proceed directly to Panel Review — user approval happens AFTER the panel scrutinizes the design (Step 1E).

## Completion Criteria

- [ ] Design domains identified and mapped to specialists
- [ ] Non-coding specialists selected and equipped (if mission = non-coding)
- [ ] Specialists spawned in parallel with skill-equipped prompts
- [ ] Specialist outputs collected and conflicts resolved
- [ ] Unified design document written in plan file (goal, approaches, trade-offs, domain sections)
- [ ] 1-2 approaches presented with concrete trade-offs

## Next → Read `muggle-ai-teams/workflow/step-1d1-panel-equip.md`
