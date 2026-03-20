# /MuggleAI-Teams → Step 1A: Research & Context Gathering

> Part of /MuggleAI-Teams. Mindset: `MuggleAI-Teams/contexts/research.md` — read widely before concluding.

> **Skills**: `superpowers:brainstorming`, `superpowers:writing-plans`, `frontend-design:frontend-design`
> **Tools**: `feature-dev:code-explorer`, `feature-dev:code-architect`, `WebSearch`, `Context7`, `EnterPlanMode`

All design and plan content is saved to a single document: `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`.

---

## Procedure

Before designing anything, understand the current state and the landscape.

### 1. Explore codebase

Dispatch `feature-dev:code-explorer` agent to trace existing code paths, map current architecture, and identify files/services that will be affected.

### 2. Research industry practices (MANDATORY)

Use `WebSearch` to find how similar features are implemented in production systems, industry standards, and common pitfalls. **At least 3 queries with findings documented.**

### 3. Search SkillsMP

Search [skillsmp.com](https://skillsmp.com/) for related skills. Install valuable ones.

**API key required.** Check if the user has provided a SkillsMP API key (stored in memory as `reference_skillsmp`). If no key is available:
1. Ask the user: *"SkillsMP search requires an API key. You can register at https://skillsmp.com/ and provide your key, or we can skip this step."*
2. If user provides a key → save it to memory and proceed with the search
3. If user skips → document "SkillsMP search: skipped (no API key)" and continue

### 4. Pull library docs

Use `Context7` MCP to fetch latest documentation for relevant libraries being used.

### 5. Enter Plan Mode

Use `EnterPlanMode` for structured reasoning on complex architectural decisions.

### 6. Check package registries

Search npm, PyPI, crates.io before writing utility code. Prefer battle-tested libraries over hand-rolled solutions.

### 7. Search for adaptable implementations

Look for open-source projects that solve 80%+ of the problem and can be forked, ported, or wrapped. Prefer adopting or porting a proven approach over writing net-new code when it meets the requirement.

---

## Mandatory Research Protocol

These are NOT optional. Skip only if user explicitly says to. Each skipped item requires a documented reason.

1. **WebSearch** for industry practices (at least 3 queries with findings documented)
2. **Search SkillsMP** (skillsmp.com) via API for relevant skills; install valuable ones (requires API key — ask user or skip)
3. **Use Context7 MCP** to fetch latest docs for libraries being used
4. **Dispatch `feature-dev:code-architect`** for architecture design (not design it yourself)
5. **Invoke `frontend-design:frontend-design`** for visual mockups AFTER panel review (Step 1D), not during Step 1C — the panel may change the design significantly, making early mockups wasted work
6. **Examine existing app styling** before creating any visual mockups — read the Tailwind config, globals.css, and existing component patterns. Never guess fonts, colors, or spacing.

---

## Output

A context summary with:
- Current state of affected code/services
- Affected files/services mapped
- Relevant research findings (industry practices, library docs)
- Available packages/implementations to leverage

## Next → Read `MuggleAI-Teams/workflow/step-1b-requirements.md`
