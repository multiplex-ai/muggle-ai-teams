# /MuggleAI-Teams → Step 6: Learn & Graduate

> Part of /MuggleAI-Teams.
> **Skill**: `claude-md-management:revise-claude-md`

After every workflow run (whether successful or abandoned), the orchestrator captures learnings and graduates them into persistent rules.

---

## 6.1: Capture Run Log

Append a **Run Log** section to the plan document:

```markdown
## Run Log
### Panelist Performance
| Panelist | Findings | Led to change | Rejected |
|----------|----------|--------------|----------|

### Agent Performance
| Agent | Slices | Gate first-pass | Fix cycles |
|-------|--------|----------------|------------|

### Cost
- Total cost in USD for this workflow run (from `/cost`)

### Lessons Learned
- Design patterns that worked: [what and why]
- Mistakes caught by panel: [what, who caught it, how to prevent next time]
- Engineer dispatch improvements: [agent, recurring issue, context to add]
```

---

## 6.2: Graduate Learnings into Persistent Rules

Invoke `/learn-eval` to extract patterns with quality gates (checklist + holistic verdict + save-location decision). This replaces free-form "did we learn anything" — the command has a rigorous evaluation pipeline that checks for overlap, confirms reusability, and decides Global vs Project scope.

Ask: **"Did we learn anything that should apply to ALL future runs?"**

### Graduation Table

| Learning type | Graduates to | Why |
|--------------|-------------|-----|
| User correction about HOW to work | `rules/behavior.md` | Always loaded — prevents same mistake in all future sessions |
| Code quality expectation | `rules/core.md` | Always loaded universal principle |
| Testing/CI expectation | `rules/quality-gates.md` | Loaded during testing |
| Git/PR expectation | `rules/git.md` | Loaded during git ops |
| Agent dispatch correction | `rules/agents-routing.md` | Always loaded routing |
| Workflow process correction | `workflow/reference.md` or step file | Loaded during workflow |
| Design pattern that always works | Per-repo CLAUDE.md | Project-specific |
| Recurring engineer mistake | Agent definition (dispatch context) | Agent-specific |
| Technical pattern (error/debug/workaround) | Per-repo CLAUDE.md or relevant rules file | Project/global knowledge |

**Critical rule: Never save behavioral corrections to memory only.** Memory requires active recall and is unreliable. Rules files are always loaded and enforced. Memory is a last resort for things that don't fit any rules file (e.g., user preferences about non-work topics).

### Sensitive Data Check

Before writing ANY learning to a persistent file, verify it contains NO:
- API keys, passwords, tokens, or connection strings
- Internal URLs with credentials
- Environment variable values
- PII or customer data

If a learning references sensitive context, abstract it: "Auth endpoint must handle token refresh" NOT "Auth0 tenant xyz.auth0.com token refresh at /oauth/token"

---

## 6.3: Compress Rules When Needed

When a CLAUDE.md file accumulates many similar rules:

1. **Compress**: Merge related specific rules into fewer general rules
   - Before: 4 rules about auth error handling → After: 1 rule covering all auth error patterns
2. **Split**: When a CLAUDE.md exceeds ~200 lines, split into domain-specific rule files
   - `muggle-ai-ui/CLAUDE.md` (core) + `muggle-ai-ui/docs/rules/auth.md`, `forms.md`, etc.
   - Agent reads core CLAUDE.md (always) + relevant domain rule file (only when working on that domain)

---

## 6.4: How the System Gets Smarter Over Time

The orchestrator reads past learnings (now in CLAUDE.md and agent definitions, not in run logs) at the start of each new `/MuggleAI-Teams` run. Over time:
- Designs anticipate common concerns upfront → panel finds fewer issues → fewer panelists needed
- Engineer dispatch prompts include known pitfalls → higher first-pass quality → fewer fix cycles
- The panel shrinks not because panelists are pruned, but because the orchestrator produces better designs that need less scrutiny

---

## Completion Criteria

- [ ] Run log appended to plan document
- [ ] `/learn-eval` invoked — patterns extracted and evaluated
- [ ] Learnings graduated to appropriate rules/CLAUDE.md files (not just memory)
- [ ] No sensitive data in any graduated content

## Workflow Complete

This is the final step. See `MuggleAI-Teams/workflow/reference.md` for error recovery and quick reference.
