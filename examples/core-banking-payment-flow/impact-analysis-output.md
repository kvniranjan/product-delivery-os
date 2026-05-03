# Impact Analysis Output

## Impacted Applications

| Application | Impact status | Notes |
|---|---|---|
| Payment capture system | Confirmed | Sends payment review event and review outcome. |
| Integration layer | Confirmed | Routes and transforms event payload to core banking. |
| Core banking platform | Confirmed | Places, displays, releases, and reverses temporary hold. |
| Servicing portal | Suspected | Must show hold reason, release status, and review timestamp. |
| Operational reporting | Suspected | May need new hold status and review metrics. |

## Upstream Systems

- Payment capture system sends inbound payment review events.
- Fraud/manual review process determines whether the hold should be placed or released.

## Downstream Systems

- Servicing portal for operations users.
- Customer communication process if hold status is exposed to customers.
- Reporting and reconciliation extracts.

## Interface/API Impact

- Payment review event must include payment ID, account ID, amount, currency, review status, hold reason, timestamp, and correlation ID.
- Error handling is needed if core banking rejects the hold request.

## Data Impact

- Core banking must store hold reason, review timestamp, hold status, release timestamp, and audit reference.
- Data retention and reporting requirements are open questions.

## Batch/EOD Impact

- EOD must reconcile held funds, released holds, reversals, and suspense postings.
- Cutoff behavior for payments flagged close to EOD is an open question.

## Accounting/GL Impact

- GL posting, suspense account usage, hold release, and reversal behavior require finance confirmation.
- No GL treatment should be assumed until accounting signs off.

## Reporting Impact

- Operations may need daily counts of active holds, released holds, aged holds, and rejected hold requests.

## Security/Access Impact

- Only authorized operations roles should release or override a hold.
- Release and override actions must be audited.

## Regression Areas

- Standard inbound payment posting.
- Payment reversal.
- Manual review approval and rejection.
- EOD reconciliation.
- Servicing search and account view.
- Reports consuming payment status.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Hold logic affects available balance incorrectly | High | Add balance, posting, reversal, and release regression tests. |
| EOD reconciliation breaks for held payments | High | Include EOD batch test and finance review. |
| Operations cannot explain hold reason | Medium | Confirm servicing portal display requirements. |

## Open Questions

- What exact review statuses trigger a hold?
- What is the maximum hold duration?
- Who can release or override a hold?
- What GL entries are required when funds are held, released, or reversed?
- What happens when the event arrives after EOD cutoff?

## Recommendation

Proceed to technical spike and finance review before story readiness. Do not mark delivery-ready until GL, EOD, access, and hold release rules are confirmed.
