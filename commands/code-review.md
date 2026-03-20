---
description: Comprehensive 3-pass code review of uncommitted changes. Covers quality (security, React, Node.js, performance), compliance (CLAUDE.md rules), and contract consistency (cross-repo API types).
---

# Code Review

Run a structured 3-pass review on uncommitted or staged changes.

## Process

1. **Gather changes**: `git diff --staged` and `git diff` to see all modifications. If no diff, check recent commits with `git log --oneline -5`.

2. **Read surrounding code**: Don't review changes in isolation. Read the full file and understand imports, dependencies, and call sites.

3. **Run three passes**:

### Pass 1: Code Quality

**Security (CRITICAL — always flag):**
- Hardcoded credentials, API keys, tokens
- SQL/NoSQL injection, XSS vulnerabilities
- Missing input validation, path traversal
- Authentication bypasses, CSRF gaps
- Insecure dependencies, exposed secrets in logs

**Code Quality (HIGH):**
- Bugs, logic errors, off-by-one errors
- Functions >50 lines, files >800 lines, nesting >4 levels
- Missing error handling, console.log statements
- Missing tests for new code paths, dead code

**React/Node.js Patterns (HIGH):**
- Missing useEffect dependency arrays, stale closures
- N+1 queries, unbounded queries, missing rate limiting
- Unvalidated request input, error message leakage

**Performance (MEDIUM):**
- O(n²) algorithms, missing caching, large bundle imports

### Pass 2: Compliance
- CLAUDE.md rules for each repo touched (naming, structure, patterns)
- TypeScript strictness (no `any`, explicit types)
- Code style (longform property syntax, ~200 line files)
- Test coverage for changed behavior

### Pass 3: Contract Consistency (skip if single-repo)
- Frontend/backend API type alignment
- Endpoint path consistency
- Error format consistency (`{ code, message, details }`)

## Confidence-Based Filtering
- Only report issues with >80% confidence
- Consolidate similar issues
- Skip stylistic preferences unless they violate project conventions

## Output Format

```
## MUST FIX
- [file:line] [description] — [why critical]

## SHOULD FIX
- [file:line] [description] — [why improves quality]

## NITPICK
- [file:line] [description]

## Summary
| Severity | Count |
|----------|-------|
| MUST FIX | N |
| SHOULD FIX | N |
| NITPICK | N |

Verdict: APPROVE / REQUEST CHANGES / BLOCK
```

Block if any MUST FIX issues found. Never approve code with security vulnerabilities.
