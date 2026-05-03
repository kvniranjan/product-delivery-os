# Requirement Intake Instructions

## Purpose

Convert raw stakeholder input into structured, testable requirements without inventing business rules.

## When to Use

- A stakeholder gives an idea, complaint, email, meeting note, or rough request.
- A BA/PO needs to prepare a requirement draft for review.
- The team needs to discover missing business rules, systems, data, users, or approvals.

## Inputs Needed

- Raw stakeholder statement or meeting notes
- Business objective or problem being solved
- Current process or system behavior
- Known future-state expectation
- Impacted users, systems, data, reports, and controls
- Constraints, deadlines, policy, compliance, or operational concerns

## Step-by-Step Process

1. Restate the request as a problem statement and business objective.
2. Extract confirmed facts only from supplied input.
3. Separate current state from future state.
4. Draft functional and non-functional requirements using observable language.
5. List business rules only when provided; otherwise mark them as open questions.
6. Identify missing stakeholders, systems, data, decisions, and approvals.
7. Create an acceptance criteria starter, not final acceptance criteria if rules are missing.
8. Assign a readiness status: Draft, Needs Clarification, or Ready for Story Breakdown.

## Output Format

Use `output-template.md` in this folder. Keep the output concise enough for review, but detailed enough that business, technology, QA, and delivery stakeholders can act on it.

## Quality Checks

- Confirmed facts are separated from assumptions.
- Dependencies, risks, and open questions are visible.
- Missing information is flagged instead of filled in silently.
- The output identifies human decisions or approvals needed.
- The output can be traced to source input.

## What Not To Do

- Do not turn stakeholder wishes into approved requirements.
- Do not hide unclear rules inside polished wording.
- Do not combine multiple unrelated needs into one requirement.
