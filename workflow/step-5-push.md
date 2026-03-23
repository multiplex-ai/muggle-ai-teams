# /muggle-ai-teams → Step 5: Push & Finish

> Part of /muggle-ai-teams.
> **Skill**: `superpowers:finishing-a-development-branch`
> **Load rules**: git.md

**Before committing or pushing, read `muggle-ai-teams/rules/git.md` for commit message format and branch naming conventions.**

---

## Procedure

When Reviewer approves:

### 1. Push all commits to remote

Read the project config's **VCS & Hosting** section for the correct commands. Defaults:
- **Git**: `git push -u origin <branch>` (new branch) or `git push` (existing)
- **No VCS**: Skip this step; deliver changes as patches or direct file copies

### 2. Wait for CI

Poll CI status using the project's hosting platform. Defaults:
- **GitHub**: `gh run list --branch <branch>`
- **GitLab**: `glab ci list`
- **Bitbucket**: Check pipeline status via web
- **No CI**: Skip; rely on local quality gates from Step 3

If CI fails, diagnose and fix before proceeding.

### 3. Invoke `superpowers:finishing-a-development-branch`

### 4. Provide PR title + description

Follow the commit/PR naming conventions:
- PR title: `type(scope): Short description` (under 70 chars)
- PR body: What changed, How, Why, Test plan

### 5. User opens PR

Do not publish PRs automatically — always confirm with the user first. One PR does one thing on its own branch.

### 6. Publish QA results to cloud (if QA ran in Step 2)

If per-slice QA ran during Step 2 (check tracking file for QA run IDs):

1. Read the tracking file — collect all QA run IDs from per-slice results
2. Offer batch publish:
   > "QA tests ran for N slices. Publish all results to Muggle AI cloud? (y/skip)"
3. If yes: call `muggle-local-publish-test-script` for each run ID
4. Add QA summary to PR description:
   ```markdown
   ## QA Results
   | Slice | Test Case | Result | Run ID |
   |-------|-----------|--------|--------|
   | ... | ... | PASS/FAIL | ... |

   Full results: [cloud dashboard link]
   ```
5. If full tier regression sweep ran (Step 3): include regression results too

If no QA ran: skip this section.

## Non-Coding Mode (if mission = non-coding)

When the mission is non-coding, delivery replaces push. No git, no PR, no CI.

### Procedure

#### 1. Compile final deliverable
- Assemble all approved sections into the final output
- Apply final formatting (markdown → slides, markdown → PDF, etc.)
- If using `frontend-slides` skill: generate HTML presentation
- If email: format for the target platform

#### 2. Present to user
- Show the complete deliverable
- Provide the file path(s) where outputs are saved
- For multi-format: list all outputs (e.g., "pitch-deck.md + pitch-deck.html")

#### 3. External actions (if pending)
- If any bookings, sends, or actions were deferred to delivery:
  - List them with details
  - Get user confirmation for each before executing
  - Record confirmations

#### 4. Handoff
- Summarize what was delivered
- Note any follow-up actions the user needs to take
- If applicable: "You can now send this email", "Open pitch-deck.html in your browser", etc.

### Skip
- No git push, no PR, no CI check
- No QA publishing

## Completion Criteria

- [ ] All commits pushed to remote
- [ ] CI passes (or no CI configured)
- [ ] PR title and description prepared
- [ ] User confirmed PR creation
- [ ] QA results published to cloud (if QA ran) or skipped

### Completion Criteria (Non-Coding)
- [ ] Final deliverable compiled and formatted
- [ ] User received all output files
- [ ] External actions completed (if any)
- [ ] Follow-up actions communicated to user

## Next → Read `muggle-ai-teams/workflow/step-6-learn.md`
