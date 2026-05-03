# Test Scenario Builder Instructions

## Purpose

Convert requirements and stories into traceable test scenarios for QA, UAT, and regression planning.

## When to Use

- A story or requirement needs test coverage.
- UAT needs business-readable scenarios.
- Regression scope must be identified before release.

## Inputs Needed

- Requirement and story references
- Acceptance criteria
- Business rules and data rules
- User roles and permissions
- System and integration context
- Known defects, regression areas, and UAT concerns

## Step-by-Step Process

1. Assign scenario IDs and link each scenario to a requirement or story.
2. Cover happy path, negative path, boundary, exception, access/security, integration failure, audit/logging, and regression cases where relevant.
3. Define preconditions, test data, steps, expected result, priority, and UAT notes.
4. Make expected results explicit and observable.
5. Flag missing test data, environment needs, approvals, or unclear outcomes.

## Output Format

Use `output-template.md` in this folder. Keep the output concise enough for review, but detailed enough that business, technology, QA, and delivery stakeholders can act on it.

## Quality Checks

- Confirmed facts are separated from assumptions.
- Dependencies, risks, and open questions are visible.
- Missing information is flagged instead of filled in silently.
- The output identifies human decisions or approvals needed.
- The output can be traced to source input.

## What Not To Do

- Do not create scenarios without requirement or story links.
- Do not use expected results like passes or works.
- Do not ignore regression impact.
