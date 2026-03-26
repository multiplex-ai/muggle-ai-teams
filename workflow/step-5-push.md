# /muggle-ai-teams → Step 5: Push & Finish

> **Skill**: `superpowers:finishing-a-development-branch`
> **Load rules**: git.md

**Non-coding?** Read `workflow/ref-non-coding-design.md` (Non-Coding Delivery section).

---

## 1. Push to remote

`git push -u origin <branch>` (new) or `git push` (existing). Read project config VCS section.

## 2. Wait for CI

GitHub: `gh run list --branch <branch>`. If CI fails → diagnose before fixing (per `rules/behavior.md`).

## 3. Create PR

Invoke `superpowers:finishing-a-development-branch`.
- Title: `type(scope): Short description` (under 70 chars)
- Body: What, How, Why, Test plan
- Confirm with user before creating. One PR = one thing.

## 4. Publish QA results (if QA ran in Step 2)

1. Read tracking file — collect QA run IDs
2. Offer batch publish to Muggle AI cloud
3. If yes: `muggle-local-publish-test-script` per run ID
4. Add QA summary table to PR description

## 5. Delivery summary

Report: files changed, tests passing/added, commits, cost from `/cost`.

## 6. PHASE CHECK — DO NOT SKIP

**Before going to Step 6, read the plan document and check: are there remaining phases?**

Read `muggle-ai-teams/projects/<project>/tracking/phases.md` (created in Step 1F).

- **Remaining phases exist** → DO NOT go to Step 6. Instead:
  1. Mark current phase complete in `phases.md`
  2. Run `/save-session` + `/compact`
  3. Loop back to **Step 1F** for the next phase's plan
  4. State: "Phase N/M complete. Starting Phase N+1: [name]"

- **All phases complete** → Proceed to Step 6.

**This check is MANDATORY. The workflow is NOT complete until ALL phases have PRs.**

## Completion Criteria

- [ ] Pushed to remote
- [ ] CI passes (or no CI)
- [ ] PR created with user confirmation
- [ ] QA published (if applicable)
- [ ] Delivery summary presented
- [ ] **Phase check done** — remaining phases identified or all phases confirmed complete

## Next → If phases remain: `muggle-ai-teams/workflow/step-1f-plan.md` | If all done: `muggle-ai-teams/workflow/step-6-learn.md`
