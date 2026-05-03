# Story Builder Instructions

## Purpose

Convert requirements into JIRA-ready stories that are clear, testable, and small enough for delivery planning.

## When to Use

- A structured requirement needs to become backlog work.
- A large story needs splitting.
- A system-to-system change needs a technical story with business traceability.

## Inputs Needed

- Requirement or feature reference
- User, role, system actor, or operational actor
- Business value and priority
- Preconditions and business rules
- Dependencies and impacted systems
- Acceptance criteria inputs and test notes

## Step-by-Step Process

1. Identify whether the item is a user story, technical story, spike, defect, or enabler.
2. Write the story in As a / I want / So that format when there is a user or business actor.
3. Use a technical story format for system-to-system work while preserving business value.
4. Add preconditions, dependencies, assumptions, out-of-scope items, and traceability reference.
5. Write acceptance criteria with positive, negative, and exception coverage.
6. Assess story size and suggest slices if the item contains multiple flows, systems, rules, or user types.
7. Set readiness status: Ready, Not Ready, Needs Clarification, Needs Splitting, or Needs Technical Spike.

## Output Format

Use `output-template.md` in this folder. Keep the output concise enough for review, but detailed enough that business, technology, QA, and delivery stakeholders can act on it.

## Quality Checks

- Confirmed facts are separated from assumptions.
- Dependencies, risks, and open questions are visible.
- Missing information is flagged instead of filled in silently.
- The output identifies human decisions or approvals needed.
- The output can be traced to source input.

## What Not To Do

- Do not create a story without acceptance criteria.
- Do not mark Ready when open questions affect scope, testing, or implementation.
- Do not bury multiple independent outcomes in one story.
