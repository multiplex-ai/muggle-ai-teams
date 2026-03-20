---
name: wf-b2b-sales-pipeline
description: >
  B2B sales pipeline workflow — build the complete marketing-to-sales system
  from RevOps foundation through outbound, enablement, and competitive
  positioning. Use when user says "B2B sales workflow", "sales pipeline
  setup", "outbound workflow", "sales enablement workflow", "build sales
  pipeline", "marketing to sales handoff", "B2B go-to-market", or "sales
  motion workflow". Chains 7 skills for B2B sales teams.
---

# B2B Sales Pipeline Workflow

Build a complete B2B marketing-to-sales pipeline.

## Pre-Flight

Check for `.agents/product-marketing-context.md`. If missing, invoke `product-marketing-context` first — this is critical for B2B where positioning drives everything.

---

## Phase 1: Revenue Operations Foundation

### Step 1A — RevOps Setup
Invoke `revops`:
- Lead lifecycle stages (Subscriber → MQL → SQL → Opportunity → Customer)
- Lead scoring model (demographic + behavioral signals)
- Routing rules (which leads go to which reps/teams)
- Marketing-to-sales handoff criteria
- CRM automation specs

### Step 1B — Pricing & Packaging
Invoke `pricing-strategy` (if not already set):
- Tier structure aligned to B2B buying motion
- Enterprise vs. self-serve packaging
- Annual vs. monthly, per-seat vs. usage

**Gate**: User approves lifecycle stages, scoring model, and pricing.

---

## Phase 2: Sales Collateral

### Step 2A — Sales Enablement Suite
Invoke `sales-enablement` to create:
- Pitch deck (slide-by-slide outline)
- One-pager / leave-behind
- Objection handling document
- Demo script / talk track
- ROI calculator framework
- Buyer persona cards

### Step 2B — Competitor Battle Cards
Invoke `competitor-alternatives`:
- "Us vs. Them" comparison pages
- "Alternatives to [Competitor]" pages
- Feature matrices with honest positioning
- Internal battle cards for sales team

### Step 2C — Schema for Sales Pages
Invoke `schema-markup` for:
- Product, FAQ, and Organization schema on key pages

**Gate**: User reviews collateral before outbound begins.

---

## Phase 3: Outbound Engine

### Step 3A — Cold Email Sequences
Invoke `cold-email` for each ICP segment:
- Initial outreach email (3 angle variations)
- 3-5 touch follow-up sequence per variation
- Subject line alternatives
- Personalization framework by signal type

### Step 3B — Email Nurture (Inbound Leads)
Invoke `email-sequence` for:
- MQL nurture sequence (education → demo request)
- Post-demo follow-up sequence
- Stalled deal re-engagement sequence

### Step 3C — Social Selling Content
Invoke `social-content` focused on:
- LinkedIn thought leadership for sales team
- Content that supports outbound conversations
- Case study and proof point distribution

---

## Phase 4: Measurement & Optimization

### Step 4A — Pipeline Analytics
Invoke `analytics-tracking`:
- Pipeline stage conversion rates
- Lead source attribution
- Email engagement metrics
- Sales cycle length tracking

### Step 4B — A/B Testing
Invoke `ab-test-setup`:
- Cold email subject line tests
- Landing page variations for demo requests
- Pricing page experiments

---

## Skill Chain Summary

```
Foundation:   revops → pricing-strategy
Collateral:   sales-enablement → competitor-alternatives → schema-markup
Outbound:     cold-email → email-sequence → social-content
Measurement:  analytics-tracking → ab-test-setup
```

## Rules
- RevOps (Phase 1) must come first — it defines the pipeline that everything else feeds.
- Collateral (Phase 2) before outbound (Phase 3) — don't start emailing without materials.
- If user only needs outbound emails, can skip to Phase 3 but recommend Phase 2.
- Cold email sequences should have at least 3 angle variations per ICP.
