# AGENTS.md

This repo is AI-agnostic. Codex may be used to build and maintain it, but Codex is not the core target.

## Source of Truth

The source of truth lives in:

- `core/`
- `role-packs/`
- `workflows/`
- `templates/`
- `prompt-packs/`

Adapters under `adapters/` translate source material into tool-specific formats. Generated `dist/` output is build output and must not be edited manually.

## Contribution Rules

- Maintain attribution to Nate Herk's AIS-OS inspiration in `README.md`.
- Do not copy Nate Herk's branding, trademarked framework names, or framework language as this project's branding.
- Do not add proprietary data, client data, company data, production data, customer data, credentials, transcripts, recordings, internal URLs, or non-public system names.
- Keep examples fictional and clearly sanitized.
- Prefer small, coherent changes.
- Keep language practical for real Business Analysts and Product Owners.

## BA/PO Quality Rules

- Requirements must be testable.
- Stories must include acceptance criteria.
- Impact analysis must include upstream, downstream, interface, data, regression, GL/accounting, EOD/batch, reporting, security, operational, and UAT sections.
- Decisions must separate recommendation from approval.
- Release readiness must not recommend Go when critical defects, missing signoff, or unresolved production risks remain.

## Validation

Run these before completing changes:

```bash
python3 scripts/validate_repo.py
pytest
```

If `pytest` is not installed, install it in your environment or use a temporary isolated install. Do not commit local caches, generated `dist/`, or private `workspace/` content.
