---
name: test-feature-local
description: Test a feature locally using Muggle AI local MCP. Handles the full flow of listing/creating projects, use cases, and test cases, then generates or replays test scripts. Supports pulling test artifacts from cloud and rewriting URLs for local testing.
---

# Test Feature Locally

Test a feature on a local web application using Muggle AI local MCP tools.

## Workflow Overview

```
Login (required) → Authenticate with Muggle AI
      ↓
List Sources (merged) → Present unified local+cloud projects
      ↓
Select Project → User chooses project
      ↓
Sync Local Copy → Pull latest from cloud if both exist
      ↓
Analyze Changes (optional) → Identify impacted features
      ↓
List Use Cases → Find/Create/Pull Use Case(s)
      ↓
List Test Cases → Find/Create/Pull Test Case(s)
      ↓
List Test Scripts → Generate (if none) or Replay (if exists)
```

## Prerequisites

- Local MCP server running
- Target web application running (e.g., `http://localhost:3999`)
- User describes the feature to test OR has code changes to analyze

## Mandatory Result Format (Paths + IDs)

For **every Local MCP tool result** you report to the user, include:

1. **Result**: concise summary of pass/fail or key output
2. **Local File Path(s)**: paths returned by MCP output
3. **IDs**: relevant IDs (project/use case/test case/test script/run)
4. **Path Availability**:
   - If MCP returns path(s): mark as `reported`
   - If path(s) are computed from IDs/input: mark as `derived`
   - If no path can be obtained: explicitly state `path not exposed by MCP output`

Never omit this section when presenting Local MCP output.

## Hard-Fail Policy (No Browser Fallback)

This skill is **Local MCP only**. If Local MCP tools are unavailable or a required Local MCP step fails, **stop and fail** this workflow.

Do **not** fall back to generic browser testing features/tools to continue execution.

When failing, clearly report:
1. Which Local MCP step/tool failed
2. The error message
3. What user action is needed (for example, start Local MCP, fix auth, or run local app)

## Step 0: Login (Required)

**Always start by ensuring the user is authenticated.** This is mandatory before any testing can begin.

### Check Authentication Status

Call `muggle_auth_status` to check if user is already logged in.

### If Not Authenticated

1. Inform user: "You need to log in to Muggle AI to start testing."
2. Call `muggle_auth_login` to initiate the login flow
3. Wait for authentication to complete
4. Confirm: "Logged in as [email]. Ready to proceed."

### If Already Authenticated

Confirm: "Already logged in as [email]. Let's continue."

**Important:** Do NOT proceed to any other steps until authentication is confirmed.

## Step 1: List All Sources (Local + Cloud)

**Always present both local and cloud projects for the user to choose from, with matching projects merged.**

### List Both Sources

1. Call `muggle_project_list` to see existing local projects
2. Call `muggle_cloud_project_list` to list cloud projects

### Merge Matching Projects

Projects are considered matching when:
- Local project has `cloudSource.projectId` matching a cloud project ID
- OR local project name matches cloud project name (case-insensitive)

### Present Unified List

Present projects in a merged format - matching local/cloud projects appear as ONE entry:

```
Logged in as: user@example.com

PROJECTS:
| # | Name | Local | Cloud | Local URL |
|---|------|-------|-------|-----------|
| 1 | MuggleTest Staging | Yes | Yes | http://localhost:3999 |
| 2 | Admin Portal | No | Yes | - |
| 3 | My Local App | Yes | No | http://localhost:3000 |

Options:
  - Enter a number to use that project
  - Type "new" to create a new project
```

**Column meanings:**
- **Local**: "Yes" if local copy exists
- **Cloud**: "Yes" if cloud version exists
- **Local URL**: The localhost URL for testing (or "-" if needs to be set)

### User Selection Logic

| Selection | Local? | Cloud? | Action |
| :-------- | :----- | :----- | :----- |
| Number | Yes | Yes | **Sync first**: Pull latest from cloud, then use local |
| Number | Yes | No | Use existing local project |
| Number | No | Yes | Prompt for localhost URL, pull to local |
| "new" | - | - | Create new local project |

### Sync Before Testing (Critical)

**When a project has both local AND cloud versions, always sync before testing:**

1. Inform user: "Syncing local copy with cloud..."
2. Call `muggle_cloud_pull_project` with the cloud project ID and existing local URL
3. This updates use cases and test cases to match cloud
4. Confirm: "Local copy synced. Ready to test."

**Important:** Always wait for user to select a project before proceeding.

## Step 2: Analyze Current Changes (Optional but Recommended)

When user asks to "test my changes" or doesn't specify a feature, analyze the codebase changes first.

### Gather Change Context

Run these commands to understand what changed:

```bash
git status
git diff
git diff --cached
git log -3 --oneline
```

### Identify Impacted Features

From the changes, extract:

1. **Modified components/pages:** Which UI components or pages changed?
2. **Modified API endpoints:** Which backend routes are affected?
3. **Modified services/logic:** What business logic changed?

### Map Changes to Test Areas

| Change Type | Likely Impacted Tests |
| :---------- | :-------------------- |
| Login/auth files | Authentication use cases |
| User profile files | User management use cases |
| Form components | Data input/validation test cases |
| API route handlers | CRUD operation test cases |
| Navigation/routing | Navigation flow use cases |
| Payment/checkout | Transaction test cases |

### Present Findings to User

After analysis, summarize:
1. What files changed
2. What features are likely impacted
3. Suggested use cases/test cases to run

**Example output:**
```
Based on your changes:
- Modified: src/components/LoginForm.tsx, src/api/auth.ts
- Impacted features: User authentication, session management
- Suggested tests:
  1. "User can log in with valid credentials"
  2. "User sees error with invalid password"
  3. "User can reset password"

Which test(s) would you like to run?
```

## Step 3: Pull from Cloud (If Selected)

When user selects a cloud project, use case, or test case:

### Prompt for Local Testing URL

```
You selected a cloud project with URL: https://app.example.com

What localhost URL should be used for local testing?
(e.g., http://localhost:3000, http://localhost:3999)
```

### Pull and Rewrite URL

Call `muggle_cloud_pull_project` with:
```
{
  "cloudProjectId": "<cloud_project_id>",
  "localUrl": "<user_provided_localhost_url>"
}
```

**What happens:**
1. Downloads project metadata from cloud
2. Stores `originalUrl` field with the cloud URL (e.g., `https://app.example.com`)
3. Rewrites `url` field to localhost URL (e.g., `http://localhost:3000`)
4. Creates local copies of use cases and test cases with same URL rewriting
5. Tracks `cloudSource` mapping for future sync

### URL Rewriting Rules

| Field | Original (Cloud) | Rewritten (Local) |
| :---- | :--------------- | :---------------- |
| `project.url` | `https://app.example.com` | `http://localhost:3000` |
| `project.originalUrl` | (none) | `https://app.example.com` |
| `testCase.url` | `https://app.example.com/login` | `http://localhost:3000/login` |
| `testCase.originalUrl` | (none) | `https://app.example.com/login` |

**Path preservation:** When rewriting URLs, preserve the path portion:
- `https://app.example.com/dashboard` → `http://localhost:3000/dashboard`
- `https://app.example.com/users/123` → `http://localhost:3000/users/123`

## Step 4: Identify or Create Project

If not pulling from cloud, find or create a local project.

Call `muggle_project_list` to see existing projects.

**Match logic:**
- Match by URL (exact or base domain match)
- Match by project name (case-insensitive contains)

**If match found:** Use existing project, confirm with user.

**If no match:** Call `muggle_project_create` with:
- `name`: Derived from app name or URL
- `url`: The localhost URL
- `description`: Brief description of the app

## Step 5: Identify or Create Use Case(s)

Call `muggle_use_case_list` with the `projectId`.

**Match logic:**
- Match by goal/title containing key terms from user's feature description
- Match against impacted features from change analysis (Step 0)
- Look for similar user personas

**If multiple matches found:**
1. List all matching use cases with brief descriptions
2. Ask user: "Found N use cases that may be impacted. Which would you like to test?"
3. Allow selecting multiple (e.g., "all", "1,2,3", or specific names)

**If single match found:** Confirm with user, use existing.

**If no match:** Call `muggle_use_case_save` with:
```
{
  "projectId": "<projectId>",
  "useCase": {
    "title": "<Feature name>",
    "userStory": "<As a user, I want to...>",
    "description": "<Detailed description>",
    "breakdownItems": [{"stepNumber": 1, "action": "...", "expected": "..."}]
  }
}
```

## Step 6: Identify or Create Test Case(s)

Call `muggle_test_case_list` with `projectId` and optionally `useCaseId`.

**Match logic:**
- Match by title or goal containing feature keywords
- Match against impacted features from change analysis (Step 0)
- Match by URL if provided
- For each selected use case, find associated test cases

**If multiple matches found:**
1. List all matching test cases grouped by use case
2. Show which are likely impacted based on change analysis
3. Ask user: "Found N test cases. Run all impacted, or select specific ones?"
4. Options: "all", "impacted only", or specific IDs

**Example output:**
```
Found test cases:

Use Case: User Authentication
  [IMPACTED] tc_001 - Login with valid credentials (login form changed)
  [IMPACTED] tc_002 - Login with invalid password
  [ ] tc_003 - Remember me functionality

Use Case: User Profile
  [ ] tc_004 - Update display name

Run: [all impacted] [all] [select specific]?
```

**If single match found:** Confirm with user, use existing.

**If no match:** Call `muggle_test_case_save` with:
```
{
  "projectId": "<projectId>",
  "useCaseId": "<useCaseId>",
  "testCase": {
    "title": "<Test case name>",
    "goal": "<What this test verifies>",
    "url": "<Starting URL - use localhost>",
    "precondition": "<Any setup needed>",
    "instructions": "<Step-by-step instructions>",
    "expectedResult": "<What should happen>"
  }
}
```

## Step 7: Generate or Replay Test Script(s)

For each selected test case, call `muggle_test_script_list` with `projectId` and `testCaseId`.

### For multiple test cases:

Process each test case and categorize:

```
Test execution plan:
  REPLAY (script exists):
    - tc_001: Login with valid credentials
    - tc_002: Login with invalid password
  
  GENERATE (no script):
    - tc_005: New password reset flow

Proceed? [yes/no]
```

### If test script exists:

1. Confirm with user: "Found existing test script. Replay it?"
2. If yes, call `muggle_execute_replay`:
   ```
   {
     "projectId": "<projectId>",
     "testScriptId": "<testScriptId>"
   }
   ```
3. Report results from the execution

### If no test script:

1. Inform user: "No test script found. Generating one..."
2. Call `muggle_execute_test_generation`:
   ```
   {
     "projectId": "<projectId>",
     "testCaseId": "<testCaseId>"
   }
   ```
3. Wait for generation to complete
4. Report the generated script details

### Batch Execution Order

When running multiple tests:

1. **Replay existing scripts first** (faster, validates current behavior)
2. **Generate new scripts after** (slower, may need user observation)
3. Track results for each test case

## Step 8: View Results

After execution, call `muggle_run_result_list` or `muggle_run_result_get` to show:
- Pass/fail status
- Screenshots captured
- Execution time
- Any errors encountered

### For Multiple Tests - Summary Report

After running multiple tests, provide a summary:

```
Test Run Summary
================
Total: 4 tests
Passed: 3
Failed: 1

Results:
  [PASS] tc_001 - Login with valid credentials (2.3s)
  [PASS] tc_002 - Login with invalid password (1.8s)
  [FAIL] tc_003 - Remember me functionality (3.1s)
     Error: Checkbox not found on page
  [PASS] tc_005 - Password reset flow (4.2s) [newly generated]

Failed test details:
  tc_003: Element '#remember-me' not found. 
          Screenshot: run_xxx/step_3.png
```

### Suggested Next Actions

Based on results:

| Result | Suggested Action |
| :----- | :--------------- |
| All passed | "All tests passed. Ready to commit?" |
| Some failed | "N tests failed. Review failures or re-run?" |
| New scripts generated | "N new scripts created. Replay to verify?" |

## Example Interactions

### Example 1: Test with Existing Synced Project

**User:** "Test the login feature at localhost:3999"

**Agent:**
1. `muggle_auth_status` → Not authenticated
2. `muggle_auth_login` → User completes login
3. Confirm: "Logged in as user@example.com"
4. `muggle_project_list` → Found 1 local project (MuggleTest Staging)
5. `muggle_cloud_project_list` → Found cloud project with same name
6. Present merged list:
   ```
   | # | Name | Local | Cloud | Local URL |
   |---|------|-------|-------|-----------|
   | 1 | MuggleTest Staging | Yes | Yes | http://localhost:3999 |
   | 2 | Other App | No | Yes | - |
   ```
7. User: "1"
8. **Sync**: "Syncing local copy with cloud..."
9. `muggle_cloud_pull_project` → Updates local with latest from cloud
10. Confirm: "Local copy synced. Ready to test."
11. `muggle_use_case_list` → Found "User Authentication"
12. `muggle_test_case_list` → Found 3 test cases
13. Run tests against localhost:3999

### Example 2: Test Based on Code Changes

**User:** "Test my changes"

**Agent:**
1. `muggle_auth_status` → Authenticated as user@example.com
2. Confirm: "Already logged in. Let's continue."
3. `muggle_project_list` → Found 1 local project
4. `muggle_cloud_project_list` → Found 3 cloud projects
5. Present combined list: "Which project to use?"
6. User: "1" (selects local project)
7. `git status` → Modified: LoginForm.tsx, AuthService.ts
8. `git diff` → Analyze changes (added error handling, updated validation)
9. `muggle_use_case_list` → Found 5 use cases
10. Present: "Your changes affect authentication. Found 2 related use cases:
    - User Authentication (3 test cases)
    - Password Reset (2 test cases)
    Which to test?"
11. User: "all"
12. `muggle_test_case_list` → 5 test cases total
13. `muggle_test_script_list` for each → 4 have scripts, 1 doesn't
14. Present execution plan, user confirms
15. Run 4 replays, 1 generation
16. Report summary: "4 passed, 1 new script generated"

### Example 3: Create New Test

**User:** "Test the login flow on my app at localhost:3000"

**Agent:**
1. `muggle_auth_status` → Not authenticated
2. `muggle_auth_login` → User completes login
3. Confirm: "Logged in as user@example.com"
4. `muggle_project_list` → No local projects
5. `muggle_cloud_project_list` → Found 1 cloud project (different app)
6. Present list: "No matching projects found. Create new?"
7. User: "new"
8. `muggle_project_create` with name "Local App", url "http://localhost:3000"
9. `muggle_use_case_save` with goal "User can log in to the application"
10. `muggle_test_case_save` with login test details
11. `muggle_test_script_list` → Empty
12. `muggle_execute_test_generation` → Generates script
13. Report: "Test script generated with 5 steps. Ready to replay."

## Quick Reference

| Action | Tool/Command |
| :----- | :----------- |
| Check auth status | `muggle_auth_status` |
| Login | `muggle_auth_login` |
| List local projects | `muggle_project_list` |
| List cloud projects | `muggle_cloud_project_list` |
| Analyze changes | `git status`, `git diff` |
| Pull project from cloud | `muggle_cloud_pull_project` |
| Pull use case from cloud | `muggle_cloud_pull_use_case` |
| Pull test case from cloud | `muggle_cloud_pull_test_case` |
| Create project | `muggle_project_create` |
| List use cases | `muggle_use_case_list` |
| Create use case | `muggle_use_case_save` |
| List test cases | `muggle_test_case_list` |
| Create test case | `muggle_test_case_save` |
| List test scripts | `muggle_test_script_list` |
| Generate script | `muggle_execute_test_generation` |
| Replay script | `muggle_execute_replay` |
| View results | `muggle_run_result_get` |
| List recent runs | `muggle_run_result_list` |

## Notes

- **Login required:** Always authenticate the user first before any testing operations.
- **Project selection required:** Always list both local and cloud projects, and wait for user to select one.
- **Merge matching projects:** Local and cloud projects with the same name should appear as ONE entry.
- **Sync before testing:** When a project has both local and cloud versions, always pull latest from cloud before testing.
- **URL rewriting:** When pulling from cloud, rewrite URLs to localhost and store original URL.
- **Change-aware:** When user says "test my changes", analyze git diff to identify impacted tests.
- **Batch execution:** Can run multiple tests in sequence, with summary report.
- **No auto-publishing:** This skill focuses on local testing only. Use `publish-to-cloud` skill separately.
- **Reuse entities:** Always check for existing projects/use cases/test cases before creating new ones.
- **Confirm with user:** When matches are ambiguous or multiple options exist, ask user to choose.
- **No browser fallback:** If Local MCP flow cannot proceed, fail fast with clear remediation steps.
