---
name: wf-paid-acquisition
description: >
  Paid acquisition workflow — plan, create, optimize, and measure paid ad
  campaigns across Google, Meta, LinkedIn, and TikTok. Use when user says
  "paid acquisition workflow", "ad campaign workflow", "PPC workflow", "run
  ads workflow", "paid media plan", "ad campaign from scratch", "scale paid
  ads", or "paid growth workflow". Chains 6 skills from strategy through
  creative to measurement.
---

# Paid Acquisition Workflow

End-to-end paid advertising from strategy to measurement.

## Pre-Flight

Check for `.agents/product-marketing-context.md`. If missing, invoke `product-marketing-context` first.

---

## Phase 1: Strategy

### Step 1A — Campaign Strategy
Invoke `paid-ads`:
- Platform selection (Google, Meta, LinkedIn, TikTok)
- Campaign structure and naming conventions
- Audience targeting (custom, lookalike, interest, keyword)
- Budget allocation across platforms and campaigns
- Bidding strategy and CPA/ROAS targets

### Step 1B — Psychology Layer
Invoke `marketing-psychology` for:
- Ad angle selection based on cognitive biases
- Urgency, social proof, and loss aversion framing
- Platform-specific psychological triggers

**Gate**: User approves platform mix, budget, and targeting before creative.

---

## Phase 2: Creative

### Step 2A — Ad Creative at Scale
Invoke `ad-creative`:
- Headlines and descriptions per platform/format
- Multiple angles (pain, gain, social proof, curiosity, authority)
- Character-count compliant variations
- CSV-ready for bulk upload

### Step 2B — Landing Page Copy
Invoke `copywriting` for ad-specific landing pages:
- Message match with ad creative
- One page per major campaign angle
- CTA aligned to campaign objective

### Step 2C — Landing Page Design & CRO
Invoke `ui-ux-pro-max` to design/review each landing page:
- Layout, visual hierarchy, typography, CTA prominence, mobile responsiveness
Invoke `page-cro` on each landing page:
- Above-fold audit, trust signals, friction reduction
- Mobile optimization check
Use `frontend-design:frontend-design` to implement design + CRO changes

---

## Phase 3: Infrastructure

### Step 3A — Tracking Setup
Invoke `analytics-tracking`:
- Pixel/tag implementation plan
- Conversion event definitions
- UTM taxonomy for all campaigns
- Attribution model configuration

### Step 3B — A/B Test Plan
Invoke `ab-test-setup`:
- Ad creative testing plan (which variations to test first)
- Landing page split tests
- Audience segment tests
- Statistical significance thresholds

---

## Phase 4: Iteration (post-launch)

After campaigns run for 1-2 weeks with data:

### Step 4A — Creative Iteration
Re-invoke `ad-creative` with performance data:
- Double down on winning angles
- New variations inspired by top performers
- Fatigue detection and refresh schedule

### Step 4B — Landing Page Optimization
Re-invoke `page-cro` with conversion data:
- Data-informed CRO recommendations
- New A/B test hypotheses

---

## Skill Chain Summary

```
Strategy:       paid-ads → marketing-psychology
Creative:       ad-creative → copywriting → page-cro
Infrastructure: analytics-tracking → ab-test-setup
Iteration:      ad-creative (v2) → page-cro (v2)
```

## Rules
- Never create ads without landing page alignment (always pair 2A with 2B).
- Tracking (Phase 3) should be set up BEFORE campaigns go live.
- Phase 4 requires real performance data — don't run prematurely.
- Always create at least 3 ad angle variations for testing.
