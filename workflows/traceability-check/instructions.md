# Traceability Check Instructions

## Purpose

Find gaps across requirements, stories, acceptance criteria, tests, defects, and decisions.

## When to Use

Use this workflow when a delivery team needs a structured, reviewable artifact for traceability check.

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

- Identify requirements without stories.
- Identify stories without acceptance criteria.
- Identify acceptance criteria without test scenarios.
- Identify test scenarios without requirement links.
- Identify decisions not logged.
- Identify orphaned artifacts and missing signoff.

## What Not To Do

- Do not invent missing details.
- Do not hide uncertainty.
- Do not mark work ready when critical open questions remain.
- Do not skip traceability or testability checks.
