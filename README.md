# Product Delivery OS

**An AI-agnostic Operating System for Business Analysts and Product Owners.**

Clone this repo, pick your AI tool, and turn it into a BA/PO delivery copilot.

Product Delivery OS is a reusable operating structure for delivery work. It helps Business Analysts, Product Owners, Product Managers, Scrum Masters, Delivery Managers, Systems Analysts, AI consultants, and enterprise technology teams use AI with repeatable delivery workflows instead of scattered one-off prompts.

This is not a software application. It is a workflow, prompt, template, example, and adapter repository that can be used with many AI tools.

## Why This Exists

Random AI prompts are not enough for real delivery work. They often sound confident while missing business rules, downstream impact, testing needs, approvals, or traceability. That creates a false sense of readiness.

Product Delivery OS gives the AI a controlled way to work:

- Start from context, not prompt tricks.
- Separate facts from assumptions.
- Make open questions visible.
- Link requirements to stories, acceptance criteria, tests, decisions, and release readiness.
- Keep private project work out of the public repo.
- Treat AI output as a review draft, not an approval.

## Who This Is For

- Business Analysts and Systems Analysts
- Product Owners and Product Managers
- Scrum Masters and Delivery Managers
- AI consultants supporting delivery teams
- Enterprise technology teams
- Banking and fintech delivery teams

## Supported AI Tools

The source of truth is neutral Markdown and YAML. Tool-specific files are adapters only.

| Tool | Support path | How to use it |
|---|---|---|
| ChatGPT | `prompt-packs/chatgpt/` | Use Custom GPT or Project instructions and attach relevant source files. |
| Claude web | `prompt-packs/claude-web/` | Use Claude Project instructions and attach relevant source files. |
| Gemini | `prompt-packs/gemini/` | Use Gem instructions and attach or paste workflow files. |
| Codex | `adapters/codex/` | Use `AGENTS.md.template` and optional skill folders. |
| Claude Code | `adapters/claude-code/` | Use `CLAUDE.md.template` and optional skill folders. |
| Cursor | `adapters/cursor/rules/` | Copy `.mdc` rules into a Cursor rules setup. |
| Generic AI | `prompt-packs/generic-chat/` and `adapters/generic/` | Paste the master prompt or single-file prompt into any AI chat. |

## Quick Start

1. Clone the repo.
2. Run `python3 scripts/init_workspace.py` to create a private `workspace/` folder.
3. Add sanitized project context to `workspace/context/`.
4. Pick your AI tool and load the matching prompt pack or adapter.
5. Ask the AI to run a workflow by ID, for example `requirement-intake` or `impact-analysis`.
6. Review the AI output with business and technology stakeholders before using it for delivery.

Example request:

```text
Use the impact-analysis workflow for this sanitized change request.
Separate confirmed facts, assumptions, dependencies, risks, and open questions.
Do not invent missing business rules.
```

## Repo Structure

| Path | Purpose |
|---|---|
| `core/` | AI-tool-agnostic operating rules, principles, quality bar, glossary, and governance. |
| `role-packs/` | Role guidance for BAs, POs, hybrid BA/POs, and core banking analysts. |
| `workflows/` | Reusable workflow definitions and playbooks. |
| `templates/` | Markdown templates for delivery artifacts. |
| `prompt-packs/` | Copy-paste prompt packs for browser-based AI tools. |
| `adapters/` | Tool-specific setup templates for Codex, Claude Code, Cursor, and generic AI. |
| `workspace.example/` | Safe example of a private workspace structure. |
| `examples/` | Fictional scenarios showing workflow outputs. |
| `scripts/` | Validation, adapter build, and workspace initialization utilities. |
| `tests/` | Pytest checks for structure, manifests, adapters, privacy, and attribution. |

## Core Workflows

| Workflow ID | Use it when you need to |
|---|---|
| `requirement-intake` | Turn raw stakeholder input into structured requirements. |
| `impact-analysis` | Assess systems, data, process, testing, reporting, GL, EOD, and operational impact. |
| `story-builder` | Convert requirements into JIRA-ready stories with acceptance criteria. |
| `acceptance-criteria` | Create observable positive, negative, boundary, exception, access, integration, and audit scenarios. |
| `backlog-refinement` | Decide whether backlog items are ready, too large, blocked, or need a spike. |
| `test-scenario-builder` | Convert requirements and stories into traceable test scenarios. |
| `stakeholder-brief` | Create concise updates with status, risks, blockers, decisions, and asks. |
| `traceability-check` | Find gaps across requirements, stories, acceptance criteria, tests, defects, decisions, and signoff. |
| `change-request-analysis` | Analyze scope change impact and recommend accept, reject, defer, or split. |
| `release-readiness` | Assess go-live readiness and residual risk. |

## Using Browser-Based AI Tools

For ChatGPT, Claude web, Gemini, or a generic AI chat:

1. Start with `prompt-packs/generic-chat/master-prompt.md` or the tool-specific prompt pack.
2. Paste sanitized context from your private workspace.
3. Invoke one workflow by ID.
4. Ask for missing facts before asking for final artifacts.
5. Keep decisions and approvals human-owned.

## Using Code-Based AI Tools

For Codex, Claude Code, or Cursor:

1. Copy the relevant adapter template into the target project.
2. Keep `core/`, `role-packs/`, `workflows/`, `templates/`, and `prompt-packs/` as the source of truth.
3. Use adapter skills or rules as workflow shortcuts.
4. Do not edit generated `dist/` output manually.

## Optional Local GUI

Product Delivery OS includes an optional local Streamlit GUI for non-technical Business Analysts and Product Owners.

The GUI helps you:

- Select a workflow.
- Enter raw input or project context.
- Generate a complete, self-contained prompt.
- Copy the prompt into your preferred AI tool.
- Paste the AI response back into the app.
- Save and export Markdown artifacts locally.

The GUI does not call OpenAI, Claude, Gemini, or any other AI API. It does not require an AI API key, login, database, or SaaS setup. It preserves the AI-agnostic workflow model: you copy prompts into whatever AI tool you choose.

Run it locally:

```bash
pip install -r requirements.txt
streamlit run app/streamlit_app.py
```

The GUI saves artifacts locally under `workspace/`, which is gitignored.

## Privacy Warning

Do not commit or paste sensitive information into public AI chats or this public repo. That includes client data, company data, customer data, production data, credentials, API keys, internal architecture diagrams, meeting transcripts, recordings, non-public financial data, regulatory findings, and proprietary system names.

Use `workspace/` for real work. It is gitignored. Redact names, account numbers, IDs, URLs, tokens, and internal project references before sharing examples publicly.

AI output must be reviewed by a human before delivery. Regulatory, legal, financial, medical, security, privacy, or compliance-sensitive outputs require expert review.

## Contributing

Contributions should improve reusable workflows, templates, examples, adapters, validation, or documentation. Do not add proprietary data. Keep language practical for real BA/PO delivery work. See `CONTRIBUTING.md`.

## Roadmap

- Add deeper examples for regulated enterprise delivery.
- Add more domain role packs.
- Add richer adapter build output.
- Add optional traceability scoring utilities.
- Add issue and pull request templates.
- Add sample JIRA import-friendly story formats.

## Inspiration

This project is inspired by Nate Herk's AIS-OS:
https://github.com/nateherkai/AIS-OS

AIS-OS introduced the idea of structuring an AI workspace as an operating system with onboarding, context, skills, and recurring improvement workflows.

Product Delivery OS adapts that general operating-system idea for Business Analysts and Product Owners, with original BA/PO-specific workflows, templates, prompt packs, and AI-tool adapters.

This project is not affiliated with Nate Herk, AIS-OS, or AI Automation Society.

## License

MIT License. Copyright (c) 2026 Product Delivery OS Contributors.
