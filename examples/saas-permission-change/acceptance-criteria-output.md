# Acceptance Criteria Output

## Positive Scenario

```gherkin
Given the user or transaction meets the approved business rule
When the action is submitted
Then the system applies the expected outcome
And records an auditable result
```

## Negative Scenario

```gherkin
Given the user or transaction does not meet the approved business rule
When the action is submitted
Then the system blocks the action
And displays or records a clear reason
```

## Regression Scenario

- Existing unaffected flows continue to behave as previously approved.
