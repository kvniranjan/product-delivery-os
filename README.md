# Product Delivery OS

**An AI-agnostic Operating System for Business Analysts and Product Owners.**

Clone this repo, pick your AI tool, and turn it into a BA/PO delivery copilot.

Product Delivery OS is a reusable operating structure for delivery work. It gives Business Analysts, Product Owners, Product Managers, Scrum Masters, Delivery Managers, Systems Analysts, AI consultants, and enterprise technology teams a consistent way to use AI for requirements, backlog, testing, stakeholder communication, traceability, and release readiness.

This is not a software application. It is an AI-agnostic workflow, prompt, template, example, and adapter repository.

## Why This Exists

Random prompts are not enough for real delivery work. They miss context, hide assumptions, skip traceability, and produce artifacts that sound polished but are not delivery-ready. BAs and POs need repeatable workflows that force clarity:

- What is confirmed?
- What is assumed?
- What is blocked?
- What systems are impacted?
- What needs approval?
- How will this be tested?
- How does this trace back to the business need?

Product Delivery OS makes AI useful by giving it operating rules, role guidance, reusable workflows, and artifact templates instead of relying on one-off prompt improvisation.

## Supported AI Tools

The source of truth is neutral Markdown and YAML. Use it with:

- ChatGPT
- Claude
- Codex
- Cursor
- Gemini
- Any AI assistant that can read pasted prompts or project files

Tool-specific files live under `adapters/`. They are convenience wrappers, not the core architecture.

## Quick Start

1. Clone the repo.
2. Copy `workspace.example/` to `workspace/`.
3. Add your private project context to `workspace/`.
4. Keep `workspace/` out of git.
5. Pick an AI tool.
6. Load `prompt-packs/generic-chat/master-prompt.md` or the adapter for your tool.
7. Run a workflow such as `requirement-intake`, `impact-analysis`, or `story-builder`.
8. Review every AI output before sharing or committing it.

## Repo Structure

| Path | Purpose |
|---|---|
| `core/` | Tool-agnostic operating rules, principles, quality bar, glossary, and governance. |
| `role-packs/` | Guidance for BAs, POs, hybrid BA/POs, and core banking analysts. |
| `workflows/` | Reusable workflow definitions for delivery work. |
| `templates/` | Markdown templates for BA/PO artifacts. |
| `prompt-packs/` | Copy-paste prompt packs for browser-based AI tools. |
| `adapters/` | Codex, Claude Code, Cursor, and generic adapter templates. |
| `workspace.example/` | Example private workspace structure. Copy to `workspace/`. |
| `examples/` | Safe, realistic sample scenarios. |
| `scripts/` | Validation, adapter build, and workspace initialization utilities. |
| `tests/` | Pytest checks for required structure and manifests. |

## Core Workflows

- Requirement intake
- Impact analysis
- JIRA story writing
- Acceptance criteria
- Backlog refinement
- Test scenario generation
- Stakeholder updates
- Traceability checks
- Change request analysis
- Release readiness

## Generic Prompt Pack

Use `prompt-packs/generic-chat/master-prompt.md` when your AI tool has no project file feature. Paste it into a new chat, then add project context and invoke a workflow by name:

```text
Use the requirement-intake workflow for this stakeholder input:
...
```

Add `prompt-packs/generic-chat/ba-pack.md` or `po-pack.md` when you want role-specific behavior.

## ChatGPT Prompt Packs

- Use `prompt-packs/chatgpt/custom-gpt-instructions.md` when creating a Custom GPT.
- Use `prompt-packs/chatgpt/project-instructions.md` inside ChatGPT Projects.
- Attach or paste the relevant `core/`, `workflows/`, and `templates/` files.

## Codex Adapter

Use `adapters/codex/AGENTS.md.template` as a starting point for a Codex-enabled repo. The Codex adapter explains how to keep the AI-agnostic source files as the source of truth while using Codex skills as reusable delivery playbooks.

## Claude Code Adapter

Use `adapters/claude-code/CLAUDE.md.template` for Claude Code repository instructions. Add the Claude-compatible skill folders from `adapters/claude-code/skills/` when you want workflow-specific playbooks.

## Cursor Adapter

Use `adapters/cursor/rules/` for Cursor rule files. The core rule establishes Product Delivery OS behavior, and workflow-specific rules guide delivery tasks.

## Privacy Warning

Do not commit client data, company data, customer data, production data, credentials, internal meeting transcripts, or proprietary system details. Put real project work in `workspace/`, which is gitignored. AI outputs must be reviewed by a human before delivery, especially for regulatory, legal, financial, medical, or compliance-sensitive work.

## Contributing

Contributions should improve reusable delivery workflows, templates, examples, adapters, or validation. Do not add proprietary data. Keep the language practical, reviewable, and useful for real BA/PO work. See `CONTRIBUTING.md`.

## Roadmap

- Expand domain role packs beyond core banking.
- Add more realistic examples for enterprise delivery.
- Add richer validation for workflow manifests.
- Add optional generated adapter bundles in `dist/`.
- Add traceability matrix examples.
- Add release readiness and UAT scenario packs.

## Inspiration

This project is inspired by Nate Herk's AIS-OS:
https://github.com/nateherkai/AIS-OS

AIS-OS introduced the idea of structuring an AI workspace as an operating system with onboarding, context, skills, and recurring improvement workflows.

Product Delivery OS adapts that general operating-system idea for Business Analysts and Product Owners, with original BA/PO-specific workflows, templates, prompt packs, and AI-tool adapters.

This project is not affiliated with Nate Herk, AIS-OS, or AI Automation Society.

## License

MIT License. Copyright (c) 2026 Product Delivery OS Contributors.
