# Release Readiness Template

## Purpose

Assess whether a change is ready for go-live using evidence, signoffs, operational readiness, rollback planning, support readiness, and residual risk.

## When to Use

Use before go/no-go decisions, release review meetings, UAT signoff, or production deployment approval.

## Required Fields

| Field | Placeholder |
|---|---|
| Release | Example release name |
| Change references | `REQ-001`, `STORY-001` |
| Release date | YYYY-MM-DD |
| Readiness owner | Name or role |
| Recommendation | Go / Conditional Go / No-Go / Defer |

## Readiness Checklist

| Area | Status | Evidence | Owner |
|---|---|---|---|
| Requirements signed off | Complete / Incomplete / Blocked | Link or note | TBD |
| Stories complete | Complete / Incomplete / Blocked | Link or note | TBD |
| QA status | Passed / Failed / Blocked | Summary | TBD |
| UAT status | Signed off / Not signed off / Blocked | Summary | TBD |
| Open defects | None / Low only / Critical / High | Defect summary | TBD |
| Known limitations | Accepted / Not accepted / Unknown | Limitation list | TBD |
| Operational readiness | Ready / Not ready | Procedures, training, owners | TBD |
| Support handover | Ready / Not ready | Runbook and contacts | TBD |
| Rollback considerations | Ready / Not ready | Rollback plan | TBD |
| Communication readiness | Ready / Not ready | Stakeholder/customer comms | TBD |

## Residual Risk

| Risk | Severity | Accepted by | Notes |
|---|---|---|---|
| Example residual risk | Medium | TBD | TBD |

## Go/No-Go Recommendation

State the recommendation and evidence. Do not recommend Go if critical defects, missing signoff, incomplete rollback planning, or unresolved production risks remain.

## Quality Checklist

- Readiness facts are separated from recommendation.
- Critical defects and missing signoffs are visible.
- Rollback and support handover are covered.
- Residual risk has an owner or approver.
