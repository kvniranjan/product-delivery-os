# JIRA Story Template

## Purpose

Create a delivery-ready backlog item that is understandable, testable, traceable, and small enough for planning.

## When to Use

Use when a requirement, feature, defect, spike, or technical change needs to become backlog work.

## Required Fields

| Field | Placeholder |
|---|---|
| Story ID | `STORY-001` |
| Epic | `EPIC-001: Example Epic` |
| Feature | Example feature name |
| Title | Short action-oriented title |
| Actor | User, role, system, or operational team |
| Business value | Why this matters |
| Priority | High / Medium / Low |
| Source requirement | `REQ-001` |
| Readiness status | Ready / Not Ready / Needs Clarification / Needs Splitting / Needs Technical Spike |

## Story

As a `<user or system actor>`, I want `<capability or behavior>` so that `<business outcome>`.

For system-to-system work:

The `<source system>` must `<send/receive/validate/transform>` `<data or event>` so that `<business or operational outcome>`.

## Preconditions

- Example: User has the required role.
- Example: Account is active and eligible.

## Acceptance Criteria

```gherkin
Given <precondition>
When <action or event occurs>
Then <observable expected result>
And <data, audit, notification, or integration outcome>
```

## Negative and Exception Scenarios

| Scenario | Expected result |
|---|---|
| Missing required data | System rejects the action and records a clear reason. |
| Unauthorized user | Access is denied and audit event is recorded. |

## Dependencies

- System, team, data, environment, decision, or approval dependency.

## Out of Scope

- Explicitly list related behavior not included in this story.

## Test Notes

- Test data needed:
- Regression areas:
- UAT owner:

## Quality Checklist

- Business value is clear.
- Story has acceptance criteria.
- Expected outcomes are observable.
- Dependencies and assumptions are explicit.
- Open questions do not block readiness.
- Traceability reference is included.
