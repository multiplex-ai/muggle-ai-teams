---
name: wf-full-funnel-cro
description: >
  Full-funnel conversion rate optimization workflow — audit and optimize every
  stage from landing page through retention. Chains 9 CRO skills in funnel order.
  Use when user says "full funnel CRO", "optimize my funnel", "conversion audit",
  "end-to-end CRO", "funnel optimization", "why aren't people converting",
  "improve our conversion rates", or "CRO workflow". Covers landing → signup →
  onboarding → upgrade → retention.
---

# Full-Funnel CRO Workflow

Systematically optimize every conversion point in the user journey.

## Pre-Flight

Check for `.agents/product-marketing-context.md`. If missing, invoke `product-marketing-context` first.

---

## Stage 1: Acquisition (Landing Pages)

### Step 1A — Page CRO Audit
Invoke `page-cro` on the primary landing page(s):
- Conversion blockers, messaging clarity, CTA effectiveness
- Quick wins vs. high-impact changes

### Step 1B — Copy & Design Review
Invoke `copy-editing` on existing page copy:
- Seven-sweep edit (Clarity, Voice, So What, Prove It, Specificity, Emotion, Zero Risk)
- If copy needs full rewrite, invoke `copywriting` instead
Invoke `ui-ux-pro-max` to review visual design:
- Layout, visual hierarchy, typography, spacing, CTA prominence
- Use `frontend-design:frontend-design` to implement design changes

### Step 1C — Popup/Lead Capture
Invoke `popup-cro` to audit or design:
- Exit-intent, scroll-trigger, or timed popups
- Email capture strategy

### Step 1D — Form Optimization
Invoke `form-cro` on any non-signup forms:
- Demo request, contact, lead capture forms
- Field reduction, progressive profiling

**Output**: Prioritized list of acquisition-stage changes.

---

## Stage 2: Activation (Signup & Onboarding)

### Step 2A — Signup Flow
Invoke `signup-flow-cro`:
- Registration friction audit
- Field-by-field analysis, social proof, progress indicators
- Use `ui-ux-pro-max` for signup form visual design and `frontend-design:frontend-design` to implement

### Step 2B — Onboarding Flow
Invoke `onboarding-cro`:
- Activation metric definition (aha moment)
- Step-by-step flow design, empty states, email triggers
- Time-to-value optimization

**Output**: Redesigned signup → onboarding flow with metrics plan.

---

## Stage 3: Monetization (Upgrade & Pricing)

### Step 3A — Paywall/Upgrade Screens
Invoke `paywall-upgrade-cro`:
- In-app upgrade moments, feature gates, trial expiration
- Use `ui-ux-pro-max` for upgrade modal/screen visual design
- UI patterns, trigger points, urgency/proof elements

### Step 3B — Pricing Psychology
Invoke `marketing-psychology` focused on:
- Anchoring, decoy effect, loss aversion for pricing
- Apply findings to upgrade screens from 3A

**Output**: Optimized upgrade experience with psychology-backed design.

---

## Stage 4: Retention

### Step 4A — Churn Prevention
Invoke `churn-prevention`:
- Cancel flow design with save offers
- Dunning sequence for failed payments
- Win-back campaign structure

### Step 4B — Retention Email Sequences
Invoke `email-sequence` for:
- Re-engagement sequence (inactive users)
- Win-back sequence (post-cancel)
- Feature adoption drips

**Output**: Complete retention system (cancel flow + dunning + email sequences).

---

## Stage 5: Measurement

### Step 5A — Analytics Setup
Invoke `analytics-tracking`:
- Funnel-wide event tracking plan
- Per-stage conversion metrics and dashboards

### Step 5B — Testing Plan
Invoke `ab-test-setup`:
- Prioritized test backlog from all stages above
- Statistical requirements, duration estimates
- Testing roadmap (which tests to run first)

**Output**: Measurement infrastructure + prioritized test queue.

---

## Skill Chain Summary

```
Acquisition:  page-cro → copy-editing → popup-cro → form-cro
Activation:   signup-flow-cro → onboarding-cro
Monetization: paywall-upgrade-cro + marketing-psychology
Retention:    churn-prevention → email-sequence
Measurement:  analytics-tracking → ab-test-setup
```

## Rules
- Work through stages in order (acquisition → retention), but within each stage steps can be parallelized.
- Present findings per stage and get user approval before moving to the next stage.
- If the user only cares about one stage, run just that stage — don't force the full funnel.
- Always end with Stage 5 (measurement) regardless of which stages were run.
