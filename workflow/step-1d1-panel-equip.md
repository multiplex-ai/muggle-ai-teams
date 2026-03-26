# /muggle-ai-teams → Step 1D1: Skill Search & Panel Equip

> **Tier guard**: Standard tier → SKIP. Proceed to Step 1E.

---

## Purpose

Before panel review, search for skills to fill expertise gaps. Equip panelists or create temporary ones.

## 1. Analyze expertise gaps

After selecting panelists from the roster (Step 1D2), ask: "What expertise does this design need that existing panelists don't cover?"

If no gaps → skip to Step 1D2.

## 2. Search for skills

Search local skills + SkillsMP (`workflow/procedure-skillsmp-search.md`). Formulate queries from identified gaps.

## 3. Equip or create

- **Equip existing panelist**: Include found skill in panelist's prompt (e.g., Security Reviewer + payment-security)
- **Create temporary panelist**: New agent with standard panelist format + skill content. Max 3 dynamic panelists.

## 4. Present augmented panel to user

Show full panel including equipped/new panelists. User confirms or adjusts.

## After panel review

For each temporary panelist: "Keep for future runs?" Yes → save to agent definition. No → discard.

## Completion Criteria

- [ ] Expertise gaps analyzed
- [ ] Skills searched (or skip documented)
- [ ] Augmented panel confirmed by user
- [ ] Max 3 dynamic panelists

## Next → Read `muggle-ai-teams/workflow/step-1d2-panel-review.md`
