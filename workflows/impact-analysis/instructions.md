# Impact Analysis Instructions

## Purpose

Identify business, system, data, integration, operational, testing, reporting, GL, EOD, and release impact before delivery commits.

## When to Use

- A change touches more than one system, data flow, team, control, report, or operational process.
- A change request needs scope, timeline, testing, or risk assessment.
- A banking, fintech, enterprise, or regulated change may have downstream consequences.

## Inputs Needed

- Change description and requirement references
- System landscape with upstream and downstream systems
- Interface/API/file/message details if known
- Data fields, mappings, reports, and retention needs
- Operational procedures, support teams, and controls
- Testing scope, environments, and release timing

## Step-by-Step Process

1. Classify each impact as Confirmed, Suspected, Not applicable, or Unknown.
2. Map upstream sources, triggers, timing, and owners.
3. Map downstream consumers, reports, notifications, analytics, and operations.
4. Check interface/API, data mapping, UI, security, access, audit, batch/EOD, GL/accounting, reporting, and UAT impact.
5. Identify regression areas including existing happy path, negative path, failure handling, permissions, reporting, and reconciliation.
6. List risks with severity and likely owner.
7. Give a recommendation for next analysis action, not a business approval.

## Output Format

Use `output-template.md` in this folder. Keep the output concise enough for review, but detailed enough that business, technology, QA, and delivery stakeholders can act on it.

## Quality Checks

- Confirmed facts are separated from assumptions.
- Dependencies, risks, and open questions are visible.
- Missing information is flagged instead of filled in silently.
- The output identifies human decisions or approvals needed.
- The output can be traced to source input.

## What Not To Do

- Do not skip GL/accounting or EOD/batch sections because they feel unlikely. Mark them Not applicable or Unknown.
- Do not present suspected impact as confirmed.
- Do not recommend delivery dates without test and dependency evidence.
