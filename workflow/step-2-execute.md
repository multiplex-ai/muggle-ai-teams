# /muggle-ai-teams → Step 2: Execute Per Slice

> Mindset: `muggle-ai-teams/contexts/dev.md` — write code first, explain after.
> **Skills**: `superpowers:executing-plans`, `superpowers:dispatching-parallel-agents`, `superpowers:test-driven-development`
> **Load rules**: coding.md, testing.md, quality-gates.md

**Non-coding?** Read `workflow/ref-non-coding-execution.md` instead.

---

## Batch Cap: Max 5 Slices Per Batch

If the plan has more than 5 slices, split into batches. Execute batch 1 (slices 1-5), verify all complete, then batch 2, etc.

## Before Starting — Create Tracking File

`muggle-ai-teams/projects/<project>/tracking/step-2-<phase>-slices.md`

```
- [ ] Slice 1: <name>
  - [ ] Execute  - [ ] Scope check  - [ ] Quality gates
  - [ ] QA       - [ ] User confirmed  - [ ] Committed
- [ ] Slice 2: <name>
  ...
```

**Do NOT use TaskCreate for slices.** Track in this file only.

## Dispatch Strategy

- **2+ independent slices**: `superpowers:dispatching-parallel-agents`
- **Sequential slices**: one at a time
- **Single slice**: execute directly

## Per Slice — 7 Mandatory Gates

Each slice passes through Gates 1-7 in order. No gate skipped. No next slice until all gates pass.

For gate details → read `workflow/ref-execution-gates.md`

| Gate | What | Key rule |
|------|------|----------|
| 1. Execute | Dispatch engineer with slice + skills + TDD | Skills section REQUIRED in dispatch |
| 2. Scope check | `git diff --name-only` within declared scope | Revert out-of-scope changes |
| 3. Quality gates | typecheck, lint, test | Fix before proceeding |
| 4. QA | muggle-ai-works (user-facing slices only) | Skip with reason if not triggered |
| 5. User confirm | **BLOCKING** — present results, wait for explicit yes | No implicit confirmation |
| 6. Commit | Stage in-scope files only, `type(scope): desc` | Never `git add -A` |
| 7. Next slice | Update tracking, verify previous slice complete | Re-read tracking file |

## After Each Slice

1. **Re-read the tracking file** — confirm current slice fully checked off
2. **State remaining work**: "Completed slice N/M. Next: [slice name]"
3. Only then proceed to Gate 1 for next slice

## Completion Criteria

- [ ] All slices executed and committed locally
- [ ] Quality gates passed per slice
- [ ] Scope check passed per slice
- [ ] QA passed or skipped with documented reason per slice
- [ ] User confirmed each slice

## Next → Read `muggle-ai-teams/workflow/step-3-verify.md`
