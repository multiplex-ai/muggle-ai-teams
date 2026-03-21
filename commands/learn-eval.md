---
description: "Extract reusable patterns from the session, self-evaluate quality before saving, and determine the right save location (Global vs Project)."
---

# /learn-eval - Extract, Evaluate, then Save

Extends `/learn` with a quality gate, save-location decision, and knowledge-placement awareness before writing any skill file.

## What to Extract

Look for TWO categories:

### Category A: Technical Patterns (save as skills)
1. **Error Resolution Patterns** — root cause + fix + reusability
2. **Debugging Techniques** — non-obvious steps, tool combinations
3. **Workarounds** — library quirks, API limitations, version-specific fixes
4. **Project-Specific Patterns** — conventions, architecture decisions, integration patterns

### Category B: Behavioral Rules (graduate to rules files)
5. **User corrections** — "don't do X", "always do Y first", "stop doing Z"
6. **Process improvements** — better ways to handle recurring situations
7. **Communication preferences** — how the user wants information presented
8. **Quality standards** — expectations for output quality, thoroughness, or approach

Category B items are the user's feedback about HOW you work, not WHAT you build. These are more valuable than technical patterns because they prevent the same mistakes across all future sessions.

## Process

1. Review the session for extractable patterns
2. Identify the most valuable/reusable insight

3. **Determine save location based on category:**

   **Category A (Technical Patterns) → Rules or CLAUDE.md:**
   - Ask: "Would this pattern be useful in a different project?"
   - **Global** (relevant rules file in `muggle-ai-teams/rules/`): Generic patterns usable across 2+ projects
   - **Project** (per-repo `CLAUDE.md`): Project-specific knowledge
   - When in doubt, choose global rules file

   **Category B (Behavioral Rules) → Rules files:**
   - Decide which rules file the learning belongs in:

   | Learning type | Target file | Why |
   |--------------|-------------|-----|
   | How to debug/fix bugs | `rules/behavior.md` (Debugging section) | Always-loaded behavioral rule |
   | How to process information | `rules/behavior.md` (Processing section) | Always-loaded behavioral rule |
   | Communication/output preferences | `rules/behavior.md` (Communication section) | Always-loaded behavioral rule |
   | Code quality expectations | `rules/core.md` | Always-loaded principle |
   | Testing/CI expectations | `rules/quality-gates.md` | Loaded during testing |
   | Git/PR expectations | `rules/git.md` | Loaded during git ops |
   | Agent dispatch corrections | `rules/agents-routing.md` | Always-loaded routing |
   | Workflow process corrections | `workflow/reference.md` or relevant step file | Loaded during workflow |

   - **Synthesize with existing rules**: Before adding, read the target file. If a related rule exists, merge into a stronger version rather than adding a duplicate.
   - **Never save behavioral rules to memory only** — memory is unreliable (requires active recall). Rules files are always loaded.
   - User preferences that don't fit any rules file → memory as last resort.

4. Draft the output:

   **For Category A**, draft a skill file using this format:

```markdown
---
name: pattern-name
description: "Under 130 characters"
user-invocable: false
origin: auto-extracted
---

# [Descriptive Pattern Name]

**Extracted:** [Date]
**Context:** [Brief description of when this applies]

## Problem
[What problem this solves - be specific]

## Solution
[The pattern/technique/workaround - with code examples]

## When to Use
[Trigger conditions]
```

   **For Category B**, draft a rule addition:
   - Read the target rules file
   - Identify where the new rule fits (which section, or new section needed)
   - Check for existing rules that cover similar ground — if found, merge into a stronger version
   - Draft the addition as a concise, actionable bullet or paragraph (not a skill file)
   - If the learning is the same underlying principle as an existing rule but for a different domain, synthesize into one rule that covers both (e.g., "diagnose CSS first" + "one fix then diagnose" = "diagnose before fixing any bug")

5. **Quality gate — Checklist + Holistic verdict**

   ### 5a. Required checklist (verify by actually reading files)

   Execute **all** of the following before evaluating the draft:

   **For Category A:**
   - [ ] Grep relevant rules files and project CLAUDE.md for content overlap
   - [ ] Check MEMORY.md (both project and global) for overlap
   - [ ] Consider whether updating an existing rule would suffice
   - [ ] Confirm this is a reusable pattern, not a one-off fix

   **For Category B:**
   - [ ] Read the target rules file to check for existing rules that cover the same ground
   - [ ] If overlap found, draft a merged version that's stronger than either original
   - [ ] Check memory files for related feedback that should be synthesized together
   - [ ] Confirm this is a persistent behavioral preference, not a one-time situational request

   ### 5b. Holistic verdict

   Synthesize the checklist results and draft quality, then choose **one** of the following:

   | Verdict | Meaning | Next Action |
   |---------|---------|-------------|
   | **Save** | Unique, specific, well-scoped | Proceed to Step 6 |
   | **Improve then Save** | Valuable but needs refinement | List improvements → revise → re-evaluate (once) |
   | **Absorb into [X]** | Should be appended to an existing skill | Show target skill and additions → Step 6 |
   | **Drop** | Trivial, redundant, or too abstract | Explain reasoning and stop |

   **Guideline dimensions** (informing the verdict, not scored):

   - **Specificity & Actionability**: Contains code examples or commands that are immediately usable
   - **Scope Fit**: Name, trigger conditions, and content are aligned and focused on a single pattern
   - **Uniqueness**: Provides value not covered by existing skills (informed by checklist results)
   - **Reusability**: Realistic trigger scenarios exist in future sessions

6. **Verdict-specific confirmation flow**

   - **Improve then Save**: Present the required improvements + revised draft + updated checklist/verdict after one re-evaluation; if the revised verdict is **Save**, save after user confirmation, otherwise follow the new verdict
   - **Save**: Present save path + checklist results + 1-line verdict rationale + full draft → save after user confirmation
   - **Absorb into [X]**: Present target path + additions (diff format) + checklist results + verdict rationale → append after user confirmation
   - **Drop**: Show checklist results + reasoning only (no confirmation needed)

7. Save / Absorb to the determined location

## Output Format for Step 5

```
### Checklist
- [x] skills/ grep: no overlap (or: overlap found → details)
- [x] MEMORY.md: no overlap (or: overlap found → details)
- [x] Existing skill append: new file appropriate (or: should append to [X])
- [x] Reusability: confirmed (or: one-off → Drop)

### Verdict: Save / Improve then Save / Absorb into [X] / Drop

**Rationale:** (1-2 sentences explaining the verdict)
```

## Design Rationale

This version replaces the previous 5-dimension numeric scoring rubric (Specificity, Actionability, Scope Fit, Non-redundancy, Coverage scored 1-5) with a checklist-based holistic verdict system. Modern frontier models (Opus 4.6+) have strong contextual judgment — forcing rich qualitative signals into numeric scores loses nuance and can produce misleading totals. The holistic approach lets the model weigh all factors naturally, producing more accurate save/drop decisions while the explicit checklist ensures no critical check is skipped.

## Notes

- Don't extract trivial fixes (typos, simple syntax errors)
- Don't extract one-time issues (specific API outages, etc.)
- Focus on patterns that will save time in future sessions
- Keep skills focused — one pattern per skill
- When the verdict is Absorb, append to the existing skill rather than creating a new file
