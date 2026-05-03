# Impact Analysis Instructions

## Purpose

Analyze system, data, operational, delivery, and regression impact.

## When to Use

Use this workflow when a delivery team needs a structured, reviewable artifact for impact analysis.

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

- Always include upstream/downstream analysis.
- Always include regression impact.
- Include accounting/GL and EOD sections even if marked Not applicable / Unknown.
- Separate confirmed impacts from suspected impacts.
- Include follow-up questions where impact is unclear.

## What Not To Do

- Do not invent missing details.
- Do not hide uncertainty.
- Do not mark work ready when critical open questions remain.
- Do not skip traceability or testability checks.
