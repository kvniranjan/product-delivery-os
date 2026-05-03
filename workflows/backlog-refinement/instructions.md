# Backlog Refinement Instructions

## Purpose

Assess whether backlog items are ready for sprint planning, need splitting, need clarification, or need a technical spike.

## When to Use

- A backlog item is being prepared for sprint selection.
- A story seems too large, vague, or blocked.
- The PO needs clear questions for business and technology stakeholders.

## Inputs Needed

- Backlog item title and description
- Business value and priority
- Acceptance criteria
- Known dependencies and risks
- Technical notes, designs, or spikes
- Definition of Ready used by the team

## Step-by-Step Process

1. Check business value, scope clarity, priority, story size, dependencies, acceptance criteria, testability, and traceability.
2. Classify the item as Ready, Not Ready, Needs Splitting, Needs Clarification, or Needs Technical Spike.
3. List questions for business separately from questions for technology.
4. Suggest story slices by workflow step, user type, rule set, system boundary, data condition, or release risk.
5. Recommend the next action and owner.

## Output Format

Use `output-template.md` in this folder. Keep the output concise enough for review, but detailed enough that business, technology, QA, and delivery stakeholders can act on it.

## Quality Checks

- Confirmed facts are separated from assumptions.
- Dependencies, risks, and open questions are visible.
- Missing information is flagged instead of filled in silently.
- The output identifies human decisions or approvals needed.
- The output can be traced to source input.

## What Not To Do

- Do not call a story Ready because it has a title and description.
- Do not ignore unresolved dependencies.
- Do not split stories in a way that removes business value from every slice.
