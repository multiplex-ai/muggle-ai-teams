# /MuggleAI-Teams → Step 1D1: Skill Search & Panel Equip

> Part of /MuggleAI-Teams. Run BEFORE Step 1D2 (Panel Review).

---

## Purpose

Before dispatching the panel, ensure panelists have the right expertise for this specific design. Search for skills to fill gaps, equip existing panelists, or create temporary panelists for domains not covered by the existing roster.

---

## Procedure

### 1. Analyze expertise gaps

After the orchestrator selects panelists from the existing roster (Step 1D2), ask:

> "What expertise does this design need that our existing panelists don't cover?"

Examples:
- Stripe integration → needs payment-security expertise the generic Security Reviewer lacks
- HIPAA-regulated feature → needs healthcare compliance expertise
- Real-time WebSocket features → needs real-time architecture expertise

If no gaps are identified, skip to Step 1D2.

### 2. Search SkillsMP for panelist skills

Follow `MuggleAI-Teams/workflow/procedure-skillsmp-search.md` (shared search procedure).

Formulate queries based on the identified gaps. Example queries:
- "payment security stripe PCI"
- "real-time websocket architecture"
- "HIPAA compliance healthcare"

### 3. Equip or create

For each relevant skill found:

**Option A — Equip an existing panelist** (when an existing panelist covers the domain):
- Include the found skill's content in the panelist subagent's prompt alongside their base instructions
- The panelist now has domain-specific knowledge in addition to their general expertise
- Example: Security Reviewer + payment security skill = payment-aware security review

**Option B — Create a temporary panelist** (when no existing panelist covers the domain):
- Create a new panelist agent using this template:
  - **Name**: Derived from the skill (e.g., "Payment Compliance Reviewer")
  - **Base prompt**: Standard panelist instructions (MUST ADDRESS / SHOULD ADDRESS / CONSIDER format from Step 1D2)
  - **Domain knowledge**: The found skill's content
  - **Focus**: Extracted from the skill description
- **Temporary by default**: This agent exists only for this workflow run

### 4. Present augmented panel to user

Before dispatching, show the full panel including any skill-equipped or newly created panelists:

> Panel for this review:
> 1. Architecture Expert
> 2. Security Reviewer (equipped with: payment-security-stripe)
> 3. Stress Test Reviewer
> 4. Blind Spot Reviewer
> 5. **Payment Compliance Reviewer** (new, temporary — created from payment-compliance skill)
>
> Confirm or adjust?

---

## Guardrails

- **Maximum 3 dynamically created agents** per panel (prevent bloat)
- Each created agent must have a **clear, non-overlapping focus** with existing panelists
- Skills are **read-only knowledge** in the panelist prompt — the panelist uses them as context, not as executable procedures
- If SkillsMP search returns no relevant skills above 5K stars, **skip this step** (don't force it)
- If no API key is available and user skips, **document and continue** to Step 1D2

---

## After panel review completes

For each temporarily created panelist, ask the user:

> "[Panelist name] was created for this review. Keep it for future runs?

- **Yes** → Save to `MuggleAI-Teams/agents/` as a permanent agent definition
- **No** → Discard (default)

---

## Completion Criteria

- [ ] Expertise gaps analyzed
- [ ] SkillsMP searched for gaps (or documented skip)
- [ ] Augmented panel presented to user and confirmed
- [ ] No more than 3 dynamically created panelists

## Next → Read `MuggleAI-Teams/workflow/step-1d2-panel-review.md`
