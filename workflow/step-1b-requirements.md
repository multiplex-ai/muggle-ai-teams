# /muggle-ai-teams → Step 1B: Requirements & Impact Analysis

> **Load rules**: core.md

**Non-coding?** Adapt: replace "files/services/flows" with "deliverables/sections/external actions."

---

## 1. Clarify requirements

Ask questions one at a time until the feature is fully understood. Do not assume — get explicit answers.

## 1b. Proactive needs discovery — know MORE than what user asked for

Don't just clarify what the user said. Identify what the user **didn't say but probably needs**. Based on the task type, proactively check:

| If user wants to... | Proactively ask about |
|---------------------|----------------------|
| Build a website/page | SEO/GEO optimization? Pricing strategy? Analytics tracking? Mobile responsive? |
| Build an API | Auth strategy? Rate limiting? Versioning? Error format? |
| Build a feature | Edge cases? Error states? Loading states? Empty states? Permissions? |
| Launch a product | Go-to-market plan? Content strategy? Email sequences? Social presence? |
| Fix a bug | Other symptoms? Related bugs? Regression risk? Test coverage gap? |

Present findings: "You asked for X. Based on similar projects, you likely also need Y and Z. Should we include these in scope?"

The user may say no — that's fine. But **never ship something the user will regret** because we didn't ask.

## 2. Impact analysis

Map every file, service, flow, and external system affected:
- Which files modified? Which services touched?
- Which user flows change? Which external systems involved?

## 3. Dependency mapping

What must exist before this works?
- Data (schemas, migrations), API (endpoints), Auth (permissions), Infrastructure (queues, caches)

## 4. Risk identification

What could go wrong?
- Data loss, breaking changes, performance regression, security exposure, race conditions

## Output

Add to plan document: clarified requirements, impact analysis, dependencies, risks.

## Completion Criteria

- [ ] Requirements clarified (ambiguities resolved)
- [ ] Proactive needs surfaced and user decided (include or exclude)
- [ ] Impact analysis complete (files, services, flows)
- [ ] Dependencies mapped
- [ ] Risks identified with mitigations
- [ ] Requirements section written in plan document

## Next → Read `muggle-ai-teams/workflow/step-1c-design.md`
