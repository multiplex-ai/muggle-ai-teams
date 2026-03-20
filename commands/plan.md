---
description: Research context, restate requirements, assess risks, compare approaches, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

Create a comprehensive implementation plan before writing any code.

## When to Use

- Starting a new feature
- Making significant architectural changes
- Complex refactoring across multiple files
- Requirements are unclear or ambiguous

## Process

### Phase 0: Context Retrieval (mandatory)
1. **Explore codebase**: Read relevant files to understand current state
2. **Library docs**: Use Context7 MCP to fetch latest docs for libraries involved
3. **Web research**: Search for industry best practices and common pitfalls
4. **Check existing patterns**: Identify conventions already used in the codebase

### Phase 1: Requirements Analysis
- Restate requirements in clear, unambiguous terms
- Identify acceptance criteria
- Score requirement completeness (0-100). If <60, ask clarifying questions before proceeding.

### Phase 2: Approach Comparison
- Propose 2-3 approaches with trade-offs
- For each: pros, cons, complexity, risk
- Recommend one with rationale

### Phase 3: Implementation Plan
- Break down into phases with specific, actionable steps
- Identify key files to create/modify (table format)
- Map dependencies between phases
- Assess risks (HIGH/MEDIUM/LOW with mitigation)
- Estimate complexity

### Phase 4: Persist & Confirm
- Save plan to `.claude/plan/` directory
- Present the plan to user
- **WAIT for explicit confirmation** before proceeding

## Output Template

```markdown
# Implementation Plan: [Feature Name]

## Requirements
[Restated requirements + acceptance criteria]

## Approach (recommended)
[Selected approach with rationale]

### Key Files
| File | Action | Purpose |
|------|--------|---------|
| src/... | Create | ... |
| src/... | Modify | ... |

## Phases
### Phase 1: [Name]
- [ ] Step 1
- [ ] Step 2

### Phase 2: [Name]
- [ ] Step 1

## Risk Matrix
| Risk | Severity | Mitigation |
|------|----------|------------|
| ... | HIGH | ... |

## Complexity: [HIGH/MEDIUM/LOW]

**WAITING FOR CONFIRMATION**: Proceed? (yes/no/modify)
```

## Important

**CRITICAL**: Do NOT write any code until the user explicitly confirms the plan.

After planning, use:
- `/tdd` to implement with test-driven development
- `/build-fix` if build errors occur
- `/code-review` to review completed implementation
