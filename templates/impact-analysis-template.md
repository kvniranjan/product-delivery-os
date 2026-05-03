# Impact Analysis Template

## Purpose

Assess the likely effect of a change across applications, integrations, data, operations, controls, testing, reporting, GL/accounting, EOD/batch, and release readiness.

## When to Use

Use before committing scope, timeline, testing approach, or release recommendation for a change with cross-team or cross-system impact.

## Required Fields

| Field | Placeholder |
|---|---|
| Impact ID | `IA-001` |
| Change reference | `REQ-001` or `CR-001` |
| Analyst | Name or role |
| Status | Draft / In Review / Approved for Planning |
| Date | YYYY-MM-DD |
| Recommendation | Proceed / Clarify / Spike / Defer |

## Impact Summary

| Area | Status | Notes | Owner |
|---|---|---|---|
| Impacted applications | Confirmed / Suspected / Unknown / N/A | Example app impact | TBD |
| Upstream systems | Confirmed / Suspected / Unknown / N/A | Source systems and triggers | TBD |
| Downstream systems | Confirmed / Suspected / Unknown / N/A | Consumers, reports, notifications | TBD |
| Interface/API/file | Confirmed / Suspected / Unknown / N/A | Contract, mapping, errors | TBD |
| Data | Confirmed / Suspected / Unknown / N/A | Fields, retention, migration | TBD |
| UI | Confirmed / Suspected / Unknown / N/A | Screens, labels, permissions | TBD |
| Batch/EOD | Confirmed / Suspected / Unknown / N/A | Cutoff, jobs, reconciliation | TBD |
| Accounting/GL | Confirmed / Suspected / Unknown / N/A | Posting, reversal, settlement | TBD |
| Reporting | Confirmed / Suspected / Unknown / N/A | Operational and analytics reports | TBD |
| Security/access | Confirmed / Suspected / Unknown / N/A | Roles, audit, entitlements | TBD |
| Operations/support | Confirmed / Suspected / Unknown / N/A | Procedures, training, handover | TBD |
| UAT/regression | Confirmed / Suspected / Unknown / N/A | Coverage and owners | TBD |

## Risks

| Risk | Severity | Mitigation | Owner |
|---|---|---|---|
| Example risk | High / Medium / Low | Example mitigation | TBD |

## Open Questions

| Question | Needed from | Due by | Blocks readiness? |
|---|---|---|---|
| Example question | Product / Tech / Ops | YYYY-MM-DD | Yes / No |

## Quality Checklist

- Upstream and downstream systems are covered.
- GL/accounting and EOD/batch are included or explicitly marked N/A/Unknown.
- Regression and UAT impact are included.
- Confirmed and suspected impacts are not mixed.
- Recommendation does not approve the change.
