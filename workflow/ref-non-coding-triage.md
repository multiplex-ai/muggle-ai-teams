# Reference: Non-Coding Triage & Research

> Read this only when mission = non-coding.

## Non-Coding Complexity Scoring

| Signal | Quick (+0) | Standard (+1) | Full (+2) |
|--------|-----------|---------------|-----------|
| Deliverables | 1 document/action | 2-3 deliverables | 4+ or multi-format |
| Research needed | None / well-known | Some domain research | Deep research required |
| External actions | None | 1-2 (bookings, sends) | 3+ coordinated actions |
| Stakeholder impact | Personal/internal | Team/client-facing | Public/investor-facing |
| Dependencies | None | Sequential | Multi-party coordination |
| Domain expertise | General | 1 specialist skill | 2+ specialist skills |

Score 0-2 = Quick, 3-6 = Standard, 7+ = Full

**Quick (non-coding)**: Dispatch the matching specialist agent directly from Step 1A (inline Quick execution). The orchestrator routes using the specialist table in `workflow/ref-non-coding-design.md`, equips the agent with relevant skills, checks the output, and presents to user for approval.

Routing priority:
1. Match specialist table → dispatch with skills
2. No match → search local skills for domain keywords
3. No local skills → search SkillsMP + GitHub for community skills
4. Nothing found → ask user whether to proceed with general research or install a skill first

Examples:
- "pitch deck" → Investor Specialist with investor-materials, sales-enablement
- "cold email" → Outreach Specialist with cold-email, copywriting
- "edit this video" → search skills → Video Specialist with video-editing, remotion-video
- "optimize README" → Content Specialist with copywriting, ai-seo

## Non-Coding Research Adjustments

- **Skip**: Code explorer, package registries, code-architect dispatch
- **Keep**: WebSearch (research the domain/topic), Context7 (if using specific tools/frameworks)
- **Add**: Search for relevant skills to equip specialists
- **Add**: Web research for domain best practices

## MANDATORY: Research "What Good Looks Like"

For creative deliverables (videos, presentations, marketing content, design), **always research best-in-class examples before proposing a design or storyboard**. The user's brief tells you WHAT they want; research tells you HOW good versions of that thing are structured.

Steps:
1. WebSearch for 3-5 best-in-class examples in the domain (e.g., "best SaaS demo videos 2026")
2. Analyze: structure, pacing, narrative arc, hook, common patterns
3. Present findings to user alongside your proposed approach
4. Let research inform the design — don't just execute the user's rough brief verbatim

**Why this exists:** A product demo video was built directly from a rough storyboard without studying what makes product videos effective. The first version "didn't make sense" because it lacked narrative structure (hook, problem→solution, pacing). Multiple revision rounds were needed that research would have prevented.
