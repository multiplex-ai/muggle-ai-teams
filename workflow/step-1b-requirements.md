# /muggle-ai-teams → Step 1B: Requirements & Impact Analysis

> Part of /muggle-ai-teams.

---

## Procedure

### 1. Clarify requirements

Ask questions one at a time until the feature is fully understood. Do not assume — get explicit answers from the user.

### 2. Impact analysis

Map every file, service, flow, and external system that will be affected. Be exhaustive:
- Which files will be modified?
- Which services will be touched?
- Which user flows will change?
- Which external systems (Auth0, Stripe, Firebase, Azure, etc.) are involved?

### 3. Dependency mapping

Identify what must exist before this feature can work:
- Data dependencies (schemas, migrations)
- API dependencies (endpoints that must exist)
- Auth dependencies (permissions, roles)
- Infrastructure dependencies (queues, caches, services)

### 4. Risk identification

What could go wrong?
- Data loss scenarios
- Breaking changes to existing APIs or UI
- Performance regression
- Security exposure
- Race conditions or concurrency issues

---

## Output

Add to the plan document:

```markdown
## Requirements
- [Clarified requirements]
- Impact analysis: [files, services, flows affected]
- Dependencies: [what must exist first]
- Risks: [what could go wrong]
```

## Completion Criteria

- [ ] Requirements clarified with user (ambiguities resolved)
- [ ] Impact analysis complete — affected files, services, and flows identified
- [ ] Dependencies mapped
- [ ] Risks identified with mitigation strategies
- [ ] Requirements section written in plan document

## Next → Read `muggle-ai-teams/workflow/step-1c-design.md`
