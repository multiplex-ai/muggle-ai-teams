# /muggle-ai-teams → Step 6: Learn & Evolve

> Part of /muggle-ai-teams.
> **Load rules**: core.md

After every workflow run (whether successful or abandoned), the orchestrator extracts learnings and **applies them directly to the workflow files**. This step is NOT done until target files are actually modified.

The goal: **every run makes the next run better by mutating the system itself.**

---

## 6.1: Extract Learnings

From the conversation history, extract EVERY learning into a typed table. Sources:

| Source | Priority | Examples |
|--------|----------|---------|
| **User correction** | P0 — always apply | "don't do X", "this is wrong", "you should have done Y" |
| **User confirmation** | P1 — capture validated approach | "yes exactly", "good now", accepting unusual choice |
| **Repeated failure** | P1 — prevent recurrence | Same mistake made 2+ times before getting it right |
| **Process gap** | P2 — workflow missed something | Step that should exist but doesn't, check that should happen but didn't |
| **Tool/technique discovery** | P2 — new capability | Found a better way to do something mid-run |

### Extraction Table (MANDATORY — fill before proceeding)

| # | Learning | Source | Type | Confidence | Target File |
|---|---------|--------|------|------------|-------------|
| 1 | ... | user correction / repeated failure / etc. | skill / step / agent / rule | HIGH / MEDIUM | exact file path |

**Types:**

| Type | What changed | Target |
|------|-------------|--------|
| `skill` | How to use a tool/framework/technique | `~/.claude/skills/<skill>/SKILL.md` |
| `step` | Workflow process improvement | `workflow/step-*.md` or `workflow/ref-*.md` |
| `agent` | How an agent should behave | `~/.claude/agents/<agent>.md` or project agent config |
| `rule` | Universal behavioral rule | `rules/*.md` |
| `project` | Project-specific pattern | `projects/<name>/<name>.md` or per-repo `CLAUDE.md` |

---

## 6.2: Confidence-Based Routing

Not all learnings have equal certainty. Route based on confidence:

| Confidence | Criteria | Action |
|-----------|---------|--------|
| **HIGH** | User explicitly corrected/confirmed, OR same mistake happened 2+ times | **Apply directly** — modify the target file now |
| **MEDIUM** | Orchestrator observation, single occurrence, no user signal | **Apply as `<!-- PENDING: ... -->` comment** in target file — promoted to permanent after 3 runs where it proves useful |
| **LOW** | Speculative improvement, untested theory | **Log only** — append to plan document's run log, do NOT modify workflow files |

**User corrections are always HIGH confidence.** Don't second-guess them.

---

## 6.3: Apply — Mutate the Target Files

For each HIGH confidence learning, **edit the target file now**. This is the critical step — if you skip this, the learning is lost.

### Application Rules

1. **Additive by default.** Add new rules/checks/sections. Never delete existing rules unless the user explicitly says one is wrong.
2. **Include the "why".** Every added rule must include a one-line reason: `(Why: [what went wrong without this rule])`.
3. **Place near related content.** Don't dump all learnings at the bottom of a file. Find the section where the learning belongs.
4. **Merge duplicates.** If a learning overlaps with an existing rule, strengthen the existing rule rather than adding a duplicate.
5. **Scope correctly.** A React-specific learning doesn't belong in `rules/core.md`. A universal principle doesn't belong in a project config.

### Application Checklist (per learning)

- [ ] Target file read
- [ ] Relevant section identified
- [ ] Content written (with "Why:" line)
- [ ] No sensitive data (secrets, tokens, PII, internal URLs)
- [ ] Verified the edit doesn't break the file's structure

### What Gets Written Where

| Learning about... | Target file | What to add |
|-------------------|------------|-------------|
| How to work with user | `rules/behavior.md` | Behavioral rule |
| Workflow step missing a check | `workflow/step-*.md` | New checklist item or section |
| Reference doc missing info | `workflow/ref-*.md` | New section or updated guidance |
| Skill has a gotcha/pattern | `~/.claude/skills/<skill>/SKILL.md` | "Lessons Learned" section entry |
| Agent should do X differently | Agent definition file | Updated instruction |
| Routing was wrong | `rules/agents-routing.md` | Updated routing table or note |
| Quality gate missed something | `rules/quality-gates.md` | New gate or check |
| Research phase skipped something | `workflow/step-1a-research.md` or ref doc | New research checklist item |
| Non-coding task pattern | `workflow/ref-non-coding-*.md` | Updated guidance or example |

---

## 6.4: Verify Applications

After all edits, list what was changed:

```
## Changes Applied (Step 6)
| # | File Modified | What Was Added | Confidence |
|---|--------------|---------------|------------|
| 1 | workflow/ref-non-coding-triage.md | Research "what good looks like" section | HIGH |
| 2 | ~/.claude/skills/remotion-video/SKILL.md | Lessons Learned: contain mapping | HIGH |
```

Present to user for acknowledgment.

---

## Completion Criteria

- [ ] Extraction table filled with ALL learnings from the run
- [ ] Each learning classified by confidence (HIGH / MEDIUM / LOW)
- [ ] HIGH confidence learnings: target files **actually edited** (not just recommended)
- [ ] MEDIUM confidence: added as `<!-- PENDING -->` comments in target files
- [ ] LOW confidence: logged in plan document only
- [ ] Changes summary presented to user
- [ ] No sensitive data in any graduated content

**The step is NOT complete until files are modified.** A reflection without file edits is a failed Step 6.

## Workflow Complete
