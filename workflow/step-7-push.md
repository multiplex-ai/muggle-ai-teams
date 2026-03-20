# /MuggleAI-Teams → Step 7: Push & Finish Branch

> Part of /MuggleAI-Teams.
> **Skill**: `superpowers:finishing-a-development-branch`

**Before committing or pushing, read `MuggleAI-Teams/rules/git.md` for commit message format and branch naming conventions.**

---

## Procedure

When Reviewer approves:

### 1. Push all commits to remote

This is the first time code reaches the remote. Use `git push -u origin <branch>` if it's a new branch.

### 2. Wait for CI

Poll CI status (`gh run list --branch <branch>`) and wait for all checks to pass. If CI fails, diagnose and fix before proceeding.

### 3. Invoke `superpowers:finishing-a-development-branch`

### 4. Provide PR title + description

Follow the commit/PR naming conventions:
- PR title: `type(scope): Short description` (under 70 chars)
- PR body: What changed, How, Why, Test plan

### 5. User opens PR

Do not publish PRs automatically — always confirm with the user first. One PR does one thing on its own branch.

## Next → Read `MuggleAI-Teams/workflow/step-8-learn.md`
