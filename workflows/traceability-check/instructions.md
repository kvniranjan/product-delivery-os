# Traceability Check Instructions

## Purpose

Find delivery gaps across requirements, stories, acceptance criteria, tests, defects, decisions, and approvals.

## When to Use

- A team is preparing for refinement, UAT, release readiness, audit review, or scope review.
- Artifacts exist in multiple places and may not line up.
- The team needs to know what is blocking readiness.

## Inputs Needed

- Requirement list
- Stories and epics
- Acceptance criteria
- Test scenarios and defects
- Decision log and signoff records
- Definition of Ready or Done

## Step-by-Step Process

1. Build a traceability map from business objective to requirement, story, acceptance criteria, test scenario, defect, decision, and signoff.
2. Identify requirements without stories, stories without acceptance criteria, acceptance criteria without tests, tests without requirement links, unlogged decisions, orphaned artifacts, unresolved open questions, and missing approvals.
3. Assign severity to each gap.
4. Calculate a simple traceability score based on complete links versus expected links.
5. Recommend fixes with owners and next actions.

## Output Format

Use `output-template.md` in this folder. Keep the output concise enough for review, but detailed enough that business, technology, QA, and delivery stakeholders can act on it.

## Quality Checks

- Confirmed facts are separated from assumptions.
- Dependencies, risks, and open questions are visible.
- Missing information is flagged instead of filled in silently.
- The output identifies human decisions or approvals needed.
- The output can be traced to source input.

## What Not To Do

- Do not treat partial links as complete traceability.
- Do not hide approval gaps.
- Do not mark a release ready based only on completed stories.
