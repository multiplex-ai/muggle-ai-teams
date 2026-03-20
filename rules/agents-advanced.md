# Agents Advanced

## Available Agents

Located in `~/.claude/agents/`:

| Agent | Purpose | Model |
|-------|---------|-------|
| planner | Implementation planning | opus |
| architect | System design and ADRs | opus |
| tdd-guide | Test-driven development | opus |
| reviewer | 3-pass code review (quality, compliance, contract) | opus |
| security-reviewer | OWASP Top 10, secrets, dependency audit | opus |
| build-error-resolver | Fix build/typecheck errors incrementally | sonnet |
| e2e-runner | Playwright E2E testing | sonnet |
| refactor-cleaner | Dead code cleanup | sonnet |
| doc-updater | Documentation maintenance | haiku |
| docs-lookup | Live library docs via Context7 | haiku |
| harness-optimizer | Agent harness configuration tuning | sonnet |

Language-specific agents (use when working in that language):
cpp-reviewer, cpp-build-resolver, go-reviewer, go-build-resolver, java-reviewer, java-build-resolver, kotlin-reviewer, kotlin-build-resolver, python-reviewer, rust-reviewer, rust-build-resolver

## Code Review: Checkpoint-Based

Code review happens at deliberate checkpoints, NOT automatically after every edit:
- **Per-commit**: Quality gates (typecheck, lint, test) must pass before committing
- **Per-PR**: Structured 3-pass review by the **reviewer** agent (quality -> compliance -> contract)
- **Security audit**: Dispatch **security-reviewer** for PRs touching auth, input handling, or secrets

## Parallel Task Execution

ALWAYS use parallel execution for independent operations:

```markdown
# GOOD: Parallel execution
Launch 3 agents in parallel:
1. Agent 1: Security analysis of auth module
2. Agent 2: Performance review of cache system
3. Agent 3: Type checking of utilities

# BAD: Sequential when unnecessary
First agent 1, then agent 2, then agent 3
```

## Multi-Perspective Analysis

For complex problems, use split role sub-agents:
- Factual reviewer — verifies claims against codebase
- Senior engineer — evaluates patterns and architecture
- Security expert — checks for vulnerabilities
- Consistency reviewer — ensures cross-module alignment
- Redundancy checker — finds duplicate code/logic
