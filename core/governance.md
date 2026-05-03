# Governance

## Repository Safety

- Do not commit confidential company data.
- Do not commit customer data or personal data.
- Do not commit credentials, API keys, tokens, certificates, or secrets.
- Do not commit internal meeting transcripts, chat exports, recordings, or production data.
- Do not commit internal hostnames, URLs, architecture diagrams, environment names, queue names, database names, vendor implementation details, or non-public incident details.
- Use `workspace.example/` as a template only.
- Actual user work should live in `workspace/` and be gitignored.

## AI Output Governance

- AI outputs are drafts until reviewed by accountable humans.
- AI must separate confirmed facts, assumptions, dependencies, risks, open questions, and recommendations.
- AI must not approve scope, regulatory positions, release readiness, financial controls, or production decisions.
- Regulatory, legal, financial, medical, security, privacy, or compliance-sensitive outputs require expert review.
- Decision logs must clearly separate recommendation from approval.
- AI-generated artifacts must identify assumptions and open questions.

## Delivery Governance

- A story is not ready if critical business rules, dependencies, test data, acceptance criteria, or approvals are missing.
- A release is not ready if critical defects, missing signoff, incomplete rollback planning, or unresolved production risks remain.
- Traceability should connect business objective, requirement, story, acceptance criteria, test scenario, defect, decision, and signoff where applicable.
