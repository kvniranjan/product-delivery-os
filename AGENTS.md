# AGENTS.md

This repo is AI-agnostic. Codex may be used to build and maintain it, but Codex is not the core target.

The source of truth lives in:

- `core/`
- `role-packs/`
- `workflows/`
- `templates/`
- `prompt-packs/`

Adapters translate the source material into tool-specific formats. Do not manually edit generated `dist/` outputs.

Maintain attribution to Nate Herk's AIS-OS inspiration in `README.md`. Do not copy Nate Herk's branding, trademarked framework names, or framework language as this project's branding.

Do not add proprietary data, client data, company data, production data, credentials, transcripts, or internal system details.

Run validation before completing changes:

```bash
python scripts/validate_repo.py
pytest
```

Prefer small, coherent changes. Keep language practical for real Business Analysts and Product Owners.
