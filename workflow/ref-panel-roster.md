# Reference: Panel Roster

> Read when assembling the panel in Step 1D2.

## Core Panelists (always run)

| Panelist | Focus |
|----------|-------|
| **Architecture Expert** | Scalability, design patterns, over-engineering risk, system boundaries, data consistency |
| **Security Reviewer** | Auth flows, data exposure, injection vectors, OWASP top 10, secrets handling |
| **Stress Test Reviewer** | Unhappy paths, edge cases, race conditions, abuse scenarios. For every feature: What if input is wrong/malicious? Service down? Out of order? Two users simultaneously? Boundary conditions? |
| **Blind Spot Reviewer** | What is this design MISSING? Researches similar products/features. Returns gaps + recommended gap panelists for Round 2. |

## Domain Panelists (auto-selected)

| Panelist | Triggers when | Focus |
|----------|--------------|-------|
| **Frontend Architect** | UI components or state | Component structure, state management, rendering perf, bundle impact |
| **Backend Architect** | APIs or data layer | API design, data modeling, query perf, caching, error handling |
| **UI/UX/UE Expert** | User-facing changes | User flows, visual hierarchy, interaction patterns, loading/error/empty states |
| **Mobile/Responsive Expert** | Visual/layout changes | Cross-platform, responsive breakpoints, touch targets |
| **Database/Data Expert** | Data models or queries | Schema design, migration, indexing, data integrity |

## Gap Panelists (Round 2 only, if Blind Spot Reviewer finds gaps)

| Panelist | Typical trigger | Focus |
|----------|----------------|-------|
| **SEO/GEO/AEO Specialist** | Discoverability | Search optimization, meta tags, structured data, sitemaps |
| **Analytics/Growth Expert** | Tracking, metrics | Event tracking, conversion funnels, A/B testing hooks |
| **Web Performance Expert** | Performance budget | Core Web Vitals, Lighthouse, lazy loading, CDN strategy |
| **Accessibility Expert** | a11y | Screen reader, keyboard nav, color contrast, ARIA, focus management |
| **i18n/Localization Expert** | Multi-language | String externalization, RTL, date/number formatting |
| **Privacy/Compliance Reviewer** | Data handling | GDPR, CCPA, cookie consent, data retention, PII |
| **DevOps/Infrastructure Expert** | Deployment, scaling | CI/CD impact, feature flags, rollback, monitoring |
