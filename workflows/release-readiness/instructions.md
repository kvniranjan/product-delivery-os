# Release Readiness Instructions

## Purpose

Assess go-live readiness using evidence, open risks, signoffs, support preparation, rollback, and communication readiness.

## When to Use

- A release is approaching go/no-go.
- UAT or QA is complete or near complete.
- Stakeholders need a readiness view and residual risk summary.

## Inputs Needed

- Requirement and story completion status
- QA, UAT, defect, and regression status
- Business, technology, operations, support, and compliance signoffs
- Known limitations and workarounds
- Deployment, rollback, monitoring, and support plan
- Communication plan and go/no-go criteria

## Step-by-Step Process

1. Separate readiness facts from recommendation.
2. Check requirements signed off, stories complete, QA, UAT, defects, limitations, operational readiness, support handover, rollback, monitoring, communication, and approvals.
3. Classify defects by severity and production risk.
4. Identify residual risk and owners.
5. Recommend Go, Conditional Go, No-Go, or Defer with evidence.
6. Do not recommend Go if critical defects, missing signoff, incomplete rollback, or unresolved production risks remain.

## Output Format

Use `output-template.md` in this folder. Keep the output concise enough for review, but detailed enough that business, technology, QA, and delivery stakeholders can act on it.

## Quality Checks

- Confirmed facts are separated from assumptions.
- Dependencies, risks, and open questions are visible.
- Missing information is flagged instead of filled in silently.
- The output identifies human decisions or approvals needed.
- The output can be traced to source input.

## What Not To Do

- Do not treat story completion as release readiness.
- Do not recommend Go with unresolved critical risks.
- Do not omit rollback or support handover.
