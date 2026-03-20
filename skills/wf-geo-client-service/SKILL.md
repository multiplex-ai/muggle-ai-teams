---
name: wf-geo-client-service
description: >
  GEO agency client service workflow — manage the full client lifecycle from
  prospect intake through audit, reporting, proposal, and monthly tracking.
  Use when user says "GEO client workflow", "new GEO client", "GEO agency
  workflow", "client audit workflow", "GEO service delivery", "onboard a
  GEO client", or "monthly GEO reporting". Chains 10 GEO skills for agency
  service delivery.
---

# GEO Client Service Workflow

Full agency workflow for GEO service delivery — prospect to recurring revenue.

---

## Phase 1: Prospect Intake

### Step 1A — Add Prospect
Invoke `geo-prospect` to:
- Create prospect record (domain, contact, deal value)
- Set pipeline stage to "Lead"

### Step 1B — Initial Crawl Assessment
Invoke `geo-crawlers` for a quick:
- AI crawler access map
- robots.txt review
- First impression of GEO readiness

**Gate**: Qualify prospect — move to "Qualified" if site has GEO potential.

---

## Phase 2: Full Audit

### Step 2A — Comprehensive GEO Audit
Invoke `geo-audit` which orchestrates:
- `geo-citability` — passage-level AI citation scoring
- `geo-crawlers` — full crawler access analysis
- `geo-llmstxt` — llms.txt assessment/generation
- `geo-brand-mentions` — brand authority scoring
- `geo-content` — E-E-A-T for AI citability
- `geo-schema` — structured data for AI discoverability
- `geo-technical` — technical audit with GEO checks
- `geo-platform-optimizer` — per-platform optimization

### Step 2B — Traditional SEO Layer (optional)
Invoke `seo-audit` in parallel if client wants combined SEO+GEO:
- Technical SEO, content quality, schema, sitemap, images

**Output**: GEO Score (0-100) + SEO Health Score (if applicable).

---

## Phase 3: Reporting & Proposal

### Step 3A — Client Report
Invoke `geo-report` to produce:
- Professional narrative report (3,000-6,000 words)
- Score breakdowns, findings, prioritized actions

### Step 3B — PDF Report
Invoke `geo-report-pdf`:
- Visual PDF with score gauges, charts, tables
- Client-ready deliverable

### Step 3C — Service Proposal
Invoke `geo-proposal`:
- Executive summary with audit highlights
- Three service tiers (Basic/Standard/Premium)
- Timeline and deliverables per tier
- Terms and pricing

### Step 3D — Update Pipeline
Invoke `geo-prospect` to:
- Update stage to "Proposal Sent"
- Attach audit results and proposal

**Gate**: User sends proposal to client. Wait for response.

---

## Phase 4: Implementation (post-sale)

### Step 4A — Update Pipeline
Invoke `geo-prospect` to move to "Won" with deal value.

### Step 4B — Generate llms.txt
Invoke `geo-llmstxt` in generation mode:
- Create deploy-ready llms.txt for client

### Step 4C — Schema Implementation
Invoke `geo-schema` or `schema-markup`:
- Generate all recommended JSON-LD blocks
- Implementation guide for client's tech stack

### Step 4D — Content Optimization
Invoke `geo-citability` on key pages:
- Passage-level rewrites for AI citation potential

### Step 4E — Platform-Specific Optimization
Invoke `geo-platform-optimizer`:
- Per-platform action plan execution

---

## Phase 5: Monthly Reporting (recurring)

### Step 5A — Re-Audit
Run `geo-audit` on client's domain (current state).

### Step 5B — Delta Report
Invoke `geo-compare`:
- Compare current audit vs. baseline (or vs. last month)
- Score improvements, wins, regressions
- Action item completion tracking

### Step 5C — Monthly PDF
Invoke `geo-report-pdf` with updated data.

### Step 5D — Update Prospect Record
Invoke `geo-prospect` to log monthly audit.

**Repeat Phase 5 monthly.**

---

## Skill Chain Summary

```
Intake:         geo-prospect → geo-crawlers
Audit:          geo-audit (orchestrates 8 sub-skills) ║ seo-audit
Reporting:      geo-report → geo-report-pdf → geo-proposal → geo-prospect
Implementation: geo-llmstxt → geo-schema → geo-citability → geo-platform-optimizer
Monthly:        geo-audit → geo-compare → geo-report-pdf → geo-prospect
```

## Rules
- Always start with Phase 1 for new clients.
- Phase 2 and 3 can be run together as a "sales audit" package.
- Phase 4 only after deal is won — don't do implementation work speculatively.
- Phase 5 should be run monthly — consider using `/loop 30d` for reminders.
- Keep `geo-prospect` updated at every stage transition.
