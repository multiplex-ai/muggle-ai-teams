# Reference: Non-Coding Execution

> Read this when mission = non-coding during Step 2 (or Quick tier inline execution).

## Agent Routing for Non-Coding Execution

Use the SAME specialist that designed the section. The agent that designs a section should execute it too — don't hand off a Content Specialist's design to a general-engineer.

### Routing priority:

1. **Match specialist table** → use that agent + skills
2. **No match → search local skills** for domain keywords → spawn agent with matched skills
3. **No local skills → search SkillsMP + GitHub** for community skills (`workflow/procedure-skillsmp-search.md`) → install and equip
4. **Nothing found → tell user**: "No specialist skills found for [domain]. Want me to proceed with general research, or find and install a skill first?"

### Specialist Table (same as design phase)

| Task Domain | Agent | Skills to Equip |
|-------------|-------|-----------------|
| Investor materials | Investor Specialist | investor-materials, sales-enablement |
| Cold outreach | Outreach Specialist | cold-email, copywriting |
| Presentations | Presentation Specialist | frontend-slides, copywriting |
| Marketing strategy / GTM | Marketing Specialist | marketing-ideas, content-strategy, launch-strategy |
| SEO/GEO campaign | SEO Specialist | seo-plan, ai-seo, geo-main |
| Email campaigns | Email Specialist | email-sequence, copywriting |
| Sales materials | Sales Specialist | sales-enablement, competitor-alternatives |
| Content / README / docs | Content Specialist | article-writing, copywriting, ai-seo |
| Pricing / packaging | Pricing Specialist | pricing-strategy |
| Trip / event planning | Planning Specialist | (general research via WebSearch) |
| UI/UX design docs | Design Specialist | ui-ux-pro-max, frontend-patterns |
| Video editing | Video Specialist | video-editing, remotion-video |

For domains not in this table, follow the routing priority above — search for skills first, then ask the user.

## Per Section — Gate Sequence

### Gate 1: Execute
Spawn specialist agent (from table above or skill search) with section brief, equipped skill content, research findings, output format.

### Gate 2: Scope check
Verify output covers assigned section only. Check tone/style matches requirements.

### Gate 3: Quality check
Review for completeness, accuracy, tone, formatting. No typecheck/lint — content quality only.

### Gate 4: User review — BLOCKING
Present section output. Wait for explicit feedback. If changes requested → revise → re-present.

### Gate 5: Save
Write approved section to output file. For external actions (bookings, sends): confirm with user first.

### Gate 6: Next section
Verify previous section has all gates checked. Proceed.

## Tracking file format
```
- [ ] Section 1: Cover + Problem Statement
  - [ ] Execute (agent: Investor Specialist, skills: investor-materials)
  - [ ] Scope check
  - [ ] Quality check
  - [ ] User approved
  - [ ] Saved
```
