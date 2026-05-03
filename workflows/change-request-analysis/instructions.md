# Change Request Analysis Instructions

## Purpose

Analyze proposed scope changes and recommend accept, reject, defer, or split without approving the change.

## When to Use

- A stakeholder asks to add, remove, or change scope.
- A change may affect timeline, testing, cost, risk, operations, or release readiness.
- The team needs options for decision-making.

## Inputs Needed

- Original requirement or baseline scope
- Requested change and reason
- Impacted stories, systems, reports, data, controls, users, and operations
- Delivery timeline, release window, and dependencies
- Testing and regression scope
- Decision owner and approval process

## Step-by-Step Process

1. Restate original requirement and requested change.
2. Separate business justification from implementation impact.
3. Identify impacted stories, systems, data, operations, testing, timeline, and risk.
4. Provide options such as accept now, defer, split, reject, or run spike.
5. State recommendation with rationale and residual risk.
6. Identify the decision owner and approval needed.

## Output Format

Use `output-template.md` in this folder. Keep the output concise enough for review, but detailed enough that business, technology, QA, and delivery stakeholders can act on it.

## Quality Checks

- Confirmed facts are separated from assumptions.
- Dependencies, risks, and open questions are visible.
- Missing information is flagged instead of filled in silently.
- The output identifies human decisions or approvals needed.
- The output can be traced to source input.

## What Not To Do

- Do not approve the change.
- Do not ignore timeline and testing impact.
- Do not treat business urgency as proof of implementation feasibility.
