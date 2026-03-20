---
name: wf-content-growth
description: >
  Content-led growth engine workflow — build a sustainable inbound machine
  through content strategy, SEO, lead magnets, email nurture, and social
  distribution. Use when user says "content growth workflow", "inbound
  marketing workflow", "content engine", "build a content machine", "content
  marketing plan", "grow with content", "inbound growth strategy", or "content
  flywheel". Chains 10 skills across strategy, creation, capture, and
  distribution.
---

# Content Growth Engine Workflow

Build a content-led growth system that attracts, captures, and nurtures leads.

## Pre-Flight

Check for `.agents/product-marketing-context.md`. If missing, invoke `product-marketing-context` first.

---

## Phase 1: Strategy

### Step 1A — Content Strategy
Invoke `content-strategy`:
- 3-5 content pillars aligned to ICP pain points
- Topic cluster architecture
- Editorial calendar framework
- Competitive content gap analysis

### Step 1B — Site Architecture (if needed)
Invoke `site-architecture` if blog/resource center doesn't exist:
- Blog taxonomy, category structure, URL patterns
- Hub-and-spoke internal linking plan

### Step 1C — AI Visibility Strategy
Invoke `ai-seo`:
- Optimize content plan for AI citation potential
- Structure, authority, and presence recommendations

**Gate**: User approves content pillars and topic priorities.

---

## Phase 2: Lead Capture System

### Step 2A — Lead Magnets
Invoke `lead-magnets`:
- One lead magnet per content pillar
- Format selection, distribution plan, gating strategy

### Step 2B — Free Tool Strategy (optional)
Invoke `free-tool-strategy` if engineering resources available:
- Interactive tool evaluation (calculators, generators, graders)
- SEO value + lead capture potential scoring

### Step 2C — Popup & Form Design
Invoke `popup-cro` for email capture overlays, then
Invoke `form-cro` for lead capture forms:
- Content upgrades, exit-intent, scroll triggers

**Gate**: User approves lead capture assets and forms.

---

## Phase 3: Nurture System

### Step 3A — Email Sequences
Invoke `email-sequence` for:
- Welcome sequence (post-lead-magnet download)
- Nurture sequence (education → product awareness → trial)
- Re-engagement sequence (gone cold)

### Step 3B — Copywriting
Invoke `copywriting` for:
- Landing pages for each lead magnet
- Key pillar content pieces (or briefs for writers)

### Step 3C — Schema & SEO Polish
Invoke `schema-markup` for article/FAQ/HowTo schemas, then
Invoke `programmatic-seo` if scale opportunities exist (location pages, integration pages, etc.)

---

## Phase 4: Distribution

### Step 4A — Social Content
Invoke `social-content`:
- Content repurposing system (blog → social posts)
- Platform-specific content calendar
- Hook formulas and engagement strategy

### Step 4B — Referral Program (optional)
Invoke `referral-program` if product has sharing potential:
- Content-driven referral loops

---

## Phase 5: Measurement

### Step 5A — Analytics
Invoke `analytics-tracking`:
- Content performance metrics (traffic, engagement, conversion)
- Lead magnet conversion tracking
- Attribution model for content → revenue

### Step 5B — Testing
Invoke `ab-test-setup`:
- Headline tests, CTA tests, lead magnet format tests
- Content experiment framework

---

## Skill Chain Summary

```
Strategy:     content-strategy → site-architecture → ai-seo
Capture:      lead-magnets + free-tool-strategy → popup-cro + form-cro
Nurture:      email-sequence → copywriting → schema-markup + programmatic-seo
Distribution: social-content → referral-program
Measurement:  analytics-tracking → ab-test-setup
```

## Rules
- Phase 1 is mandatory. Other phases can be run selectively.
- If the user already has a content strategy, start at Phase 2.
- Free tool strategy (2B) and referral program (4B) are optional — only suggest if appropriate.
- Every content piece should be optimized for both Google AND AI engines (ai-seo).
