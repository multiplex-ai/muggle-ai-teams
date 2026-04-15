# First Principles Reasoning

Reason from irreducible truths, not inherited patterns. This is the general reasoning mode — "Diagnose Before Fixing" and "Evaluate Before Accepting" (behavior.md) are specific applications of it.

## When to Apply

Use first principles decomposition at these decision points:

- **Technology/architecture choices** — "should we use X?" Decompose to actual requirements (latency, team size, deployment frequency, data shape) before recommending. Never recommend a technology because "it's popular" or "Netflix uses it."
- **When a conventional approach has failed** — if the obvious solution didn't work, the assumptions behind it are wrong. Decompose.
- **When evaluating proposals** — the user's idea, a library's approach, a tutorial's pattern. What assumptions does it carry? Do those assumptions hold here?
- **When something feels wrong but you can't say why** — that feeling is pattern mismatch. Decompose until you find the conflicting assumption.
- **Cost/effort estimates that seem fixed** — "this will take X" or "this costs Y." Question whether X and Y are fundamental constraints or inherited conventions.

## When NOT to Apply

- Routine implementation of well-understood patterns (CRUD endpoints, standard React components, known algorithms)
- When the existing solution is correct and the task is to extend it, not rethink it
- Time-critical fixes where the conventional approach is obviously right

Use analogy for speed. Use first principles to validate critical assumptions.

## The Method

At each decision point, run these questions:

1. **What am I assuming?** List every assumption in the current approach — inherited conventions, "best practices," things that "everyone knows."
2. **Which assumptions are actually verified?** For each: is this true because of physics/math/measured data, or because someone said so?
3. **What are the irreducible constraints?** Strip away convention. What remains? (User needs, physical limits, budget, actual data, actual traffic.)
4. **Does my solution follow from the constraints alone?** Rebuild the answer using only verified truths. If the new answer differs from the conventional one, explain why.

## Applying It

When you catch yourself reasoning by analogy at a decision point:

```
STOP.
"I'm recommending X because I've seen it work in similar contexts."

DECOMPOSE.
"What are the actual constraints of THIS project?"
"Does X follow from those constraints, or just from pattern matching?"

REBUILD.
"Given only the verified constraints, what solution follows?"
```

## Red Flags You're Reasoning by Analogy

- "This is the standard approach" — standard for whom? Under what constraints?
- "Best practice says..." — whose best practice? For what scale, team, and problem shape?
- "Similar projects use..." — similar how? What's different that might invalidate the analogy?
- "The documentation recommends..." — for your use case, or a generic one?
- Recommending a technology without naming the specific constraints it satisfies
- Copying a pattern from a tutorial without verifying the tutorial's assumptions match the project
