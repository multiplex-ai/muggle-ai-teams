# Reference: Common Failure Modes

> Injected by step-context-injector per step. Read this for the full table if needed.

| Failure | What happens | What to do instead |
|---------|-------------|-------------------|
| Skip task creation | No structure → workflow drifts | Create tasks FIRST |
| Treat user arguments as pre-workflow | Workflow never starts | Feed into Step 1A as research input |
| Propose solutions outside a step | Orchestrator becomes passive assistant | Capture as requirement, advance to Step 1B |
| Summarize and ask "what do you want to do?" | Waiting for direction | Execute the current step |
| Create TaskCreate tasks for slices | Steps 3-6 disappear | Track slices in sub-task files only |
| Run Step 6 after first phase PR | Remaining phases never execute | Check phases.md at Step 5 → loop back to 1F |
| Skip completion criteria check | Step half-done | List every criterion, block until all pass |
| Skip QA in Step 2 | Bugs discovered late | Run per-slice QA in Gate 4 |
| Process 8+ items without batching | Items 6-8 lost | Max 5 per batch, verify, then next |
| Send vague bug to engineer | Sonnet fails 3-5 tries | Orchestrator diagnoses first → fix spec |
| Dispatch agent without skills | Generic output | Every dispatch has ## Skills section |
| Forget remaining slices | List scrolled away | Re-read tracking after every agent return |
| Orchestrator writes code directly | Loses sight of task list | ALWAYS dispatch to sub-agent |
| Complete Phase 1 then go to Step 6 | Workflow ends prematurely | Step 5 checks phases.md |
