# Impact Analysis Output

## Impacted Applications

| Application | Impact status | Notes |
|---|---|---|
| Admin UI | Confirmed | New Team Admin actions and disabled restricted actions. |
| Authorization service | Confirmed | Role checks need update. |
| User management service | Confirmed | Invite, deactivate, and role assignment behavior changes. |
| Billing service | Confirmed | Team Admin must be denied billing access. |
| Audit logging | Confirmed | Permission changes and denied attempts require logging. |

## Upstream Systems

- Identity provider group or role mapping if roles sync externally.

## Downstream Systems

- Audit export.
- Notification service for invited/deactivated users.
- Analytics for admin actions.

## Security/Access Impact

- Team Admin may manage only users in their own team.
- Team Admin must be blocked from billing, ownership transfer, audit export, and org security settings.
- Denied access attempts should be observable and auditable.

## Data Impact

- Role model may need team-scoped role assignment.
- Audit records need actor, target user, team, action, timestamp, and result.

## Accounting/GL Impact

- Not applicable.

## Batch/EOD Impact

- Not applicable unless audit export or analytics are batch-generated.

## Regression Areas

- Organization Admin permissions.
- Standard user restrictions.
- Cross-team access boundaries.
- Audit log completeness.
- Invitation and deactivation emails.

## Recommendation

Proceed with a technical design review for role scoping and audit logging before marking stories ready.
