# /muggle-ai-teams → Step 5: Push & Finish

> Part of /muggle-ai-teams.
> **Skill**: `superpowers:finishing-a-development-branch`

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

## Completion Criteria

- [ ] All commits pushed to remote
- [ ] CI passes (or no CI configured)
- [ ] PR title and description prepared
- [ ] User confirmed PR creation

## Next → Read `muggle-ai-teams/workflow/step-6-learn.md`
