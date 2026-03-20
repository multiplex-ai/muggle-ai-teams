# /MuggleAI-Teams → Step 1F: Implementation Plan

> Part of /MuggleAI-Teams.

---

## Procedure

Once design is approved, continue in the same plan document. Invoke `superpowers:writing-plans`:

### 1. Route the requirement

Use the Agent Routing table (see Step 2: `MuggleAI-Teams/workflow/step-2-routing.md`).

### 2. Decide parallel vs sequential

Use the checklist (see Step 3: `MuggleAI-Teams/workflow/step-3-parallel.md`).

### 3. Define contract artifact (for parallel cross-repo slices)

For parallel cross-repo slices, define a concrete contract artifact — TypeScript interface definition or API shape that both agents must conform to. Include in the plan document.

Example:
```typescript
// Contract: POST /api/v1/feature
interface CreateFeatureRequest {
  name: string;
  config: FeatureConfig;
}
interface CreateFeatureResponse {
  id: string;
  status: 'created' | 'error';
}
```

### 4. Break work into committable slices with TDD steps

Each slice should be:
- Small enough to commit independently
- Testable in isolation
- Clear about which agent owns it

### 5. Define each slice

For each slice, specify:
- **Agent**: Which engineer agent executes this slice
- **Scope**: Files to touch and files NOT to touch
- **Contract reference**: Which contract artifact applies (if cross-repo)
- **TDD steps**: What tests to write first
- **Localhost test instructions**: How the user verifies it works

### 6. Get user approval on the full plan before executing

Present the complete implementation plan and wait for explicit user approval before proceeding to Step 4.

---

## Output

Add to the plan document:

```markdown
## Implementation Plan
- Mode: [parallel / sequential / single agent]
- Contract: [TypeScript interface / API shape if cross-repo]
- Slices:
  - Slice 1: [description] → Agent: [X] → Scope: [files] → Test: [Y]
  - Slice 2: ...
```

## Next → Read `MuggleAI-Teams/workflow/step-2-routing.md`
