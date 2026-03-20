# Behavioral Rules

Rules about how to work with this user. Always loaded, always enforced.

## Debugging: Diagnose Before Fixing

When the user reports a bug or a fix attempt fails:

1. **STOP.** Do not guess at a root cause.
2. Invoke `superpowers:systematic-debugging` to trace the actual root cause.
3. If the issue involves a chain (CSS layout, data flow, component hierarchy), dispatch `feature-dev:code-explorer` to trace the full chain.
4. Only propose a fix when you can name the exact root cause with file:line evidence.

**Never** attempt more than 1 fix without systematic diagnosis. The cost of diagnosis (~2 min) is always less than repeated guessing (~30 min + trust erosion). This applies to ALL bug types — CSS, logic, data flow, API errors, build failures. Symptoms are visible at one layer but root causes are often many layers away.

## Processing External Feedback

When the user shares feedback from others (chat history, meeting notes, PR comments, Slack threads):

1. **First pass**: Extract EVERY distinct comment/question/suggestion into a numbered table: #, Comment, From, Category (question/suggestion/concern/praise)
2. **Second pass**: Evaluate each row — what makes sense, what doesn't, what's missing context
3. **Third pass**: Propose solutions per row
4. **Present the table** to user for verification BEFORE synthesizing

Never process feedback as narrative — it causes latching onto debated topics and missing standalone comments mentioned once.

## Output Quality Standards

When creating visual artifacts (mockups, wireframes, diagrams, companion images):

- Use sufficient size for readability (300px+ for card/image previews)
- Use legible font sizes (12px+ for body text)
- Show one option at full detail rather than cramming multiple options into a small space
- Ensure wireframes are fully visible without clipping

## Communication Preferences

- Don't ask user to review technical spec documents — just note specs passed and continue
- Keep user-facing communication at the product/design level, not implementation details
- When the user says "yes" or "proceed," do the work without restating what you're about to do
