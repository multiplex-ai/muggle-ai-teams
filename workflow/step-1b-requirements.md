# /muggle-ai-teams → Step 1B: Requirements & Impact Analysis

> Part of /muggle-ai-teams.

> **Load rules**: core.md

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

### Non-Coding Mode (if mission = non-coding)

When the mission is non-coding, adapt the analysis:

#### 1. Clarify requirements (same approach)
Ask questions until the deliverable is fully understood. Key questions for non-coding:
- What is the final deliverable? (document, presentation, email, plan, booking)
- Who is the audience? (investors, clients, team, personal)
- What format? (markdown, HTML slides, PDF, email draft, spreadsheet)
- What tone/style? (formal, casual, persuasive, informational)
- Any constraints? (budget, timeline, word count, specific platforms)

#### 2. Scope analysis (replaces impact analysis)
Instead of mapping files and services, map:
- **Deliverables**: What outputs will be produced?
- **Sections/components**: What parts make up each deliverable?
- **External actions**: Any bookings, sends, or third-party interactions needed?
- **Research needed**: What information must be gathered first?

#### 3. Dependency mapping (adapted)
- Content dependencies (what info is needed before writing each section?)
- Sequential dependencies (does section B require section A to be done first?)
- External dependencies (waiting on user input, third-party availability?)

#### 4. Risk identification (adapted)
- Audience mismatch (wrong tone, wrong level of detail)
- Missing information (user hasn't provided key context)
- External failures (bookings unavailable, services down)
- Scope creep (simple email becomes full campaign)

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

**Non-coding output variant:**
```markdown
## Requirements
- [Clarified requirements — deliverable, audience, format, tone]
- Scope: [deliverables and their sections]
- Dependencies: [content and external dependencies]
- Risks: [audience mismatch, missing info, scope creep]
```

## Completion Criteria

- [ ] Requirements clarified with user (ambiguities resolved)
- [ ] Impact analysis complete — affected files, services, and flows identified
- [ ] Scope analysis complete (non-coding: deliverables and sections mapped)
- [ ] Dependencies mapped
- [ ] Risks identified with mitigation strategies
- [ ] Requirements section written in plan document

## Next → Read `muggle-ai-teams/workflow/step-1c-design.md`
