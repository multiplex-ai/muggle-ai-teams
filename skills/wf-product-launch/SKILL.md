---
name: wf-product-launch
description: >
  End-to-end product launch workflow — from positioning through launch day and
  post-launch growth. Chains 11 skills in 4 phases: Foundation, Build, Launch,
  Grow. Use when user says "launch workflow", "launch my product", "GTM workflow",
  "go-to-market plan", "full launch plan", "launch from scratch", or "product
  launch checklist". This is the master workflow for taking a product to market.
---

# Product Launch Workflow

Orchestrate a complete product launch by chaining skills in 4 phases.
**Every phase gates the next** — confirm with the user before advancing.

## Phase 1: Foundation (sequential)

### Step 1A — Product Marketing Context
Invoke `product-marketing-context` to establish:
- Product definition, ICP, positioning, competitive landscape
- Output: `.agents/product-marketing-context.md`

**Gate**: User confirms context doc is accurate before proceeding.

### Step 1B — Pricing Strategy
Invoke `pricing-strategy` to design:
- Tier structure, value metric, packaging, price points
- Uses context from Step 1A automatically

### Step 1C — Site Architecture
Invoke `site-architecture` to plan:
- Page hierarchy, URL structure, navigation, internal linking
- Informed by pricing tiers from Step 1B
Then invoke `ui-ux-pro-max` to review/design:
- Navigation patterns, page layout structure, visual hierarchy of site sections
- Responsive navigation behavior (mobile hamburger, sticky header, etc.)
- Design system foundations (color, typography, spacing) that inform all pages
Then invoke `frontend-design:frontend-design` to evaluate existing implementation:
- Audit current landing page against design system decisions
- Identify gaps between current UI and recommended patterns

**Gate**: User approves foundation (positioning + pricing + site plan + design direction).

---

## Phase 2: Build (parallelizable where noted)

### Step 2A — Copywriting (sequential — needs site architecture)
Invoke `copywriting` for each key page identified in Step 1C:
- Homepage, pricing page, feature pages, about page
- Apply `marketing-psychology` principles inline

### Step 2B — UI/UX Design Review (after 2A, parallel with 2C)
Invoke `ui-ux-pro-max` to review/design:
- Landing page layout, visual hierarchy, typography, color system
- Component patterns, spacing, interaction states
- Responsive design and dark mode considerations
- Accessibility audit (WCAG 2.x AA)
Then invoke `frontend-design:frontend-design` if implementation is needed:
- Production-grade UI code for landing page sections
- Apply the design system decisions from ui-ux-pro-max

### Step 2C — Page CRO Review (after 2A)
Invoke `page-cro` on each page's copy:
- Conversion audit, quick wins, A/B test hypotheses
- Feed CRO findings back into ui-ux-pro-max design if layout changes needed

### Step 2D — Schema Markup (parallel with 2B/2C)
Invoke `schema-markup` for:
- JSON-LD structured data for all page types
- Organization, Product, FAQ, Breadcrumb schemas

### Step 2E — Signup Flow (after 2C)
Invoke `signup-flow-cro` to design:
- Registration/trial flow, field reduction, social proof placement
- Use `ui-ux-pro-max` for signup form/flow visual design

### Step 2F — Lead Capture Assets (parallel with 2E)
Invoke `lead-magnets` to plan lead magnet(s), then
Invoke `popup-cro` to design email capture overlays

### Step 2G — Analytics Setup (parallel with 2E/2F)
Invoke `analytics-tracking` to create:
- Tracking plan, conversion events, UTM taxonomy, attribution model

**Gate**: User reviews all copy, designs, flows, and tracking before launch prep.

---

## Phase 3: Launch (sequential)

### Step 3A — Launch Strategy
Invoke `launch-strategy` with the ORB framework:
- Owned/Rented/Borrowed channel plan
- Product Hunt strategy (if applicable)
- 5-phase timeline: Seed → Build → Launch → Sustain → Iterate

### Step 3B — Email Sequences
Invoke `email-sequence` for:
- Welcome/onboarding sequence (triggered by signup from 2D)
- Launch announcement sequence (for existing audience)
- Waitlist → access sequence (if applicable)

### Step 3C — Social Content
Invoke `social-content` for:
- Launch week content calendar across platforms
- Repurposing system for launch assets

### Step 3D — Paid Ads (if budget exists)
Invoke `paid-ads` for campaign structure, then
Invoke `ad-creative` for ad copy variations

**Gate**: User approves full launch plan before execution.

---

## Phase 4: Post-Launch Growth (ongoing)

### Step 4A — Onboarding CRO
Invoke `onboarding-cro` once real user data exists:
- Activation flow optimization, empty states, time-to-value

### Step 4B — SEO + GEO Foundation
Invoke `seo-audit` and `geo-audit` in parallel, then
Invoke `content-strategy` to plan ongoing content based on findings

### Step 4C — Referral Program
Invoke `referral-program` once product-market fit signals appear:
- Incentive structure, viral loop design

### Step 4D — A/B Testing
Invoke `ab-test-setup` to formalize testing cadence:
- Prioritized test backlog from all CRO skills

---

## Skill Chain Summary

```
Phase 1: product-marketing-context → pricing-strategy → site-architecture
Phase 2: copywriting → ui-ux-pro-max + page-cro → frontend-design → signup-flow-cro
         schema-markup (parallel)
         lead-magnets + popup-cro (parallel)
         analytics-tracking (parallel)
Phase 3: launch-strategy → email-sequence → social-content → paid-ads + ad-creative
Phase 4: onboarding-cro → seo-audit + geo-audit → content-strategy → referral-program → ab-test-setup
```

## Rules
- ALWAYS start with Phase 1, Step 1A. Never skip `product-marketing-context`.
- Each gate requires explicit user approval before proceeding.
- Parallelizable steps should be dispatched concurrently when possible.
- If the user already has a product-marketing-context.md, read it and skip to Step 1B.
- Adapt — skip steps that don't apply (e.g., skip paid-ads if no budget).
