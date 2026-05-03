# Contributing

Product Delivery OS is for reusable BA/PO delivery work. Keep contributions practical, original, and safe to publish.

## Add Workflows

- Add a folder under `workflows/`.
- Include `workflow.yaml`, `instructions.md`, `output-template.md`, and `checklist.md`.
- Keep workflow outputs specific and reviewable.
- Separate facts, assumptions, dependencies, risks, and open questions.
- Add or update tests when structure changes.

## Add Role Packs

- Put role guidance under `role-packs/`.
- Include role purpose, responsibilities, workflows, quality checks, mistakes, and example prompts.
- Do not make tool-specific behavior part of a role pack.

## Add Prompt Packs

- Keep prompts copy-paste friendly for non-technical users.
- Make privacy guidance visible.
- Tell the AI how to handle missing information.
- Do not include client, company, or production data.

## Add Examples

- Use realistic but fictional scenarios.
- Do not include proprietary systems, internal process names, customer data, credentials, or meeting transcripts.
- Show enough detail to teach the workflow without pretending to be a real client record.

## Add Adapters

- Adapters should translate Product Delivery OS into a tool's instruction format.
- The source of truth remains `core/`, `role-packs/`, `workflows/`, `templates/`, and `prompt-packs/`.
- Generated output belongs in `dist/` and should not be edited manually.

## Quality Standards

- Requirements must be testable.
- Stories must include acceptance criteria.
- Impact analysis must include upstream, downstream, regression, EOD, and GL sections where relevant.
- Decisions must be logged separately from recommendations.
- AI output must be reviewed by a human before delivery.

Run `python scripts/validate_repo.py` and `pytest` before submitting changes.
