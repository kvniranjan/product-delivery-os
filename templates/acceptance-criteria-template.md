# Acceptance Criteria Template

## Purpose

Define observable conditions that prove a story or requirement is acceptable.

## Required Fields

| Field | Placeholder |
|---|---|
| Story or requirement reference | `STORY-001` |
| Scenario owner | BA / PO / QA |
| Status | Draft / Reviewed / Approved |

## Scenarios

### Positive Scenario

```gherkin
Given <valid precondition>
When <user or system action occurs>
Then <observable expected result occurs>
And <data, audit, integration, or notification outcome is recorded>
```

### Negative Scenario

```gherkin
Given <invalid or unauthorized condition>
When <action is attempted>
Then <action is rejected or blocked>
And <clear reason or audit event is available>
```

### Boundary Scenario

```gherkin
Given <minimum, maximum, cutoff, or threshold condition>
When <action occurs>
Then <expected boundary behavior occurs>
```

## Quality Checklist

- Then statements are observable.
- Data validation is included where relevant.
- Error handling is included where relevant.
- Access/security, integration failure, and audit/logging scenarios are included where relevant.
- No business rule is invented.
