# /muggle-ai-teams → Step 1C: Design Proposal

> **Load rules**: core.md, coding.md, agents-advanced.md, model-selection.md

**Non-coding?** Read `workflow/ref-non-coding-design.md` for specialist mapping.

---

## Why Specialists (not engineers)

Engineers write CODE in Step 2. Design requires domain expertise spanning UI/UX, API design, security, performance. Spawn specialist sub-agents equipped with relevant skills.

## 1. Identify design domains needed

| Domain | When needed | Equipped Skills |
|--------|-------------|----------------|
| Frontend UI/UX | User-facing changes | ui-ux-pro-max, frontend-patterns |
| API / Data | New endpoints, schema changes | api-design, backend-patterns, postgres-patterns |
| SEO / Content | Content pages, discoverability | ai-seo, schema-markup |
| Security | Auth, data handling | security-review |
| Performance | High-traffic paths, heavy queries | backend-patterns (perf sections) |
| Mobile / Responsive | Layout-sensitive changes | frontend-patterns (responsive sections) |

## 2. Spawn specialists in parallel

- **Standard tier**: 1-2 specialists (domains the task directly touches)
- **Full tier**: 2-4 specialists (primary + supporting domains)

Each specialist receives: design-focused prompt, skill content, Step 1A research, project config.

## 3. Combine into unified design

1. Resolve conflicts between specialist outputs
2. Ensure consistency across domain boundaries
3. Write unified design document
4. Present 1-2 approaches with trade-offs (performance, cost, complexity, risk)

## Completion Criteria

- [ ] Design domains identified and specialists dispatched with skills
- [ ] Specialist outputs collected and conflicts resolved
- [ ] Unified design document written in plan file
- [ ] 1-2 approaches with concrete trade-offs

## Next → Read `muggle-ai-teams/workflow/step-1d1-panel-equip.md`
