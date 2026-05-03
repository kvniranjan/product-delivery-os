# Change Request Analysis Instructions

## Purpose

Analyze scope changes without confusing recommendation with approval.

## When to Use

Use this workflow when a delivery team needs a structured, reviewable artifact for change request analysis.

## Inputs Needed

- Raw stakeholder input or existing artifact.
- Product, process, system, and data context.
- Known constraints, dates, owners, and dependencies.
- Existing decisions, risks, defects, or open questions.

## Step-by-Step Process

1. Restate the request in plain language.
2. Separate confirmed facts from assumptions.
3. Identify missing business rules, stakeholders, systems, and data.
4. Build the required output sections.
5. Check testability and traceability.
6. List risks, dependencies, and open questions.
7. Recommend next steps without approving business decisions.

## Output Format

Use `output-template.md` in this folder unless the user requests another format.

## Quality Checks

- Separate business justification from implementation impact.
- Identify timeline and testing impact.
- Do not approve the change; recommend and identify decision owner.

## What Not To Do

- Do not invent missing details.
- Do not hide uncertainty.
- Do not mark work ready when critical open questions remain.
- Do not skip traceability or testability checks.
