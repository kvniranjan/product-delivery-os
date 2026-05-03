# Acceptance Criteria Instructions

## Purpose

Create observable acceptance criteria that developers, testers, BAs, POs, and stakeholders can review.

## When to Use

- A requirement or story needs testable acceptance conditions.
- Existing criteria are vague or only cover the happy path.
- The change includes access, integration, audit, or error handling behavior.

## Inputs Needed

- Story or requirement
- Business rules and validation rules
- User roles and permissions
- Data fields and examples
- Integration points and failure modes
- Audit, reporting, compliance, or operational expectations

## Step-by-Step Process

1. Identify the behavior under test and the actor or system trigger.
2. Write positive scenarios first using Gherkin where helpful.
3. Add negative, boundary, exception, access/security, integration failure, audit/logging, and regression scenarios where relevant.
4. Make each Then statement observable through UI, API response, data state, audit log, report, notification, or error message.
5. Flag missing expected outcomes, validation rules, test data, or business decisions.
6. Link criteria back to the story or requirement.

## Output Format

Use `output-template.md` in this folder. Keep the output concise enough for review, but detailed enough that business, technology, QA, and delivery stakeholders can act on it.

## Quality Checks

- Confirmed facts are separated from assumptions.
- Dependencies, risks, and open questions are visible.
- Missing information is flagged instead of filled in silently.
- The output identifies human decisions or approvals needed.
- The output can be traced to source input.

## What Not To Do

- Do not write vague outcomes like system works correctly.
- Do not skip negative or exception behavior.
- Do not invent validation thresholds, messages, or audit rules.
