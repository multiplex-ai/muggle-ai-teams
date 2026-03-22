# Procedure: Sub-Task Tracking

This procedure applies to ALL workflow steps and to ALL bug fix / feedback batches.

---

## When to Create Sub-Tasks

1. **Every workflow step**: When you start a step, create a sub-task file listing every action in that step. Even if the step has only 1 action — create the file anyway.

2. **Bug fix batches**: When the user reports bugs (any number), create a sub-task file listing every bug before fixing any of them.

3. **Feedback batches**: When the user gives feedback (any number of items), create a sub-task file listing every item before evaluating or implementing any of them.

---

## Sub-Task File Format

Write to: `muggle-ai-teams/projects/<project-name>/tracking/<step-or-batch-name>.md`

**Do NOT commit these files to git.** Add `muggle-ai-teams/projects/*/tracking/` to `.gitignore` if needed.

### Default format (all steps except Step 2)

```markdown
# Sub-Tasks: <step name or batch description>
# Parent: <main task step, e.g., "Step 1A: Research">
# REMINDER: When all sub-tasks below are done, return to the MAIN task list and advance the parent step.

- [ ] Sub-task 1: <description>
- [ ] Sub-task 2: <description>
- [ ] Sub-task 3: <description>
...
```

### Step 2 format (per-slice gate tracking)

For Step 2 (Execute Per Slice), each slice MUST have gate-level sub-checkboxes. This format is mandatory — it enforces the gate sequence from `step-2-execute.md`. **A slice is not complete until ALL gates are checked. The next slice CANNOT start until the previous slice's "User confirmed" gate is checked.**

```markdown
# Sub-Tasks: Step 2 — Execute Slices (<feature name>)
# Parent: Step 2: Execute Per Slice
# REMINDER: When all sub-tasks below are done, return to the MAIN task list and advance the parent step.
# GATE RULE: Do NOT dispatch the next slice agent until ALL gates of the current slice are checked.

- [ ] Slice 1: <description>
  - [ ] Agent executed
  - [ ] Scope check passed
  - [ ] Localhost test instructions posted
  - [ ] User confirmed working
  - [ ] Committed (hash: )
  - [ ] Tracking updated
- [ ] Slice 2: <description>
  - [ ] Agent executed
  - [ ] Scope check passed
  - [ ] Localhost test instructions posted
  - [ ] User confirmed working
  - [ ] Committed (hash: )
  - [ ] Tracking updated
...
```

---

## Rules

1. **Create before acting.** Write the file BEFORE starting any work. For bug batches: list all bugs first, diagnose all, then fix. For feedback: list all items first, evaluate all, then implement.

2. **Check off as you go.** After completing each sub-task, update the file to `[x]`.

3. **No hijacking.** Sub-task files track work WITHIN a step. They do not replace the main TaskCreate/TaskUpdate task list. The main task list tracks steps (1A, 1B, ..., 6). Sub-tasks track actions within a step.

4. **Return to main.** Every sub-task file has a REMINDER header. When all sub-tasks are checked off, read the reminder and return to the main task list to mark the parent step as complete or advance.

5. **Actual files, not context.** Do not track sub-tasks in conversation memory — write them to disk so they survive compaction and context loss.

---

## Bug Fix Batch Procedure

When the user reports multiple bugs:

1. **Extract**: List EVERY bug into a numbered sub-task file. Use the feedback-as-checklist protocol (extract ALL items before evaluating).
2. **Diagnose**: For each bug, diagnose the root cause BEFORE proposing a fix. Use `superpowers:systematic-debugging` if needed. Write the diagnosis next to each sub-task.
3. **Fix**: Fix bugs one at a time (or in logical groups). Commit each fix batch separately.
4. **Verify**: After fixing, check off the sub-task and verify the fix.

---

## Feedback Implementation Procedure

When the user provides multiple feedback items:

1. **Extract**: List EVERY feedback item into a numbered sub-task file.
2. **Evaluate**: For each item, evaluate whether it makes sense, conflicts with existing rules, or needs clarification. Write the evaluation next to each sub-task.
3. **Present**: Show the evaluation table to the user for confirmation before implementing.
4. **Implement**: Implement confirmed items. Update the relevant workflow/rules files.
5. **Check off**: Mark each sub-task as done.
