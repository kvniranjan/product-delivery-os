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

## Hosted Beta Web App

Product Delivery OS also includes a hosted beta web app built with Next.js, Convex, Clerk, TypeScript, and Tailwind CSS.

The beta app lets Business Analysts and Product Owners:

- Sign up and log in with Clerk.
- Create sanitized beta projects.
- Run Requirement Intake, Impact Analysis, Story Builder, and Acceptance Criteria workflows from `workflows/`.
- Generate complete, self-contained prompts.
- Copy prompts into their preferred AI tool.
- Paste AI output back into the app.
- Save workflow runs and project artifacts.
- Submit workflow feedback.
- View aggregate feedback and workflow usage as an admin.

The hosted beta supports both the original AI-agnostic copy/paste workflow and an optional in-app AI workflow. When AI provider keys are configured, users can generate structured delivery artifacts directly inside the workflow runner, review the AI Draft, edit it, and save it as a project artifact without pasting output from an external chat tool.

Required environment variables:

```bash
NEXT_PUBLIC_CONVEX_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
ADMIN_EMAILS=
```

Optional server-only AI provider variables:

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GEMINI_API_KEY=

AI_KEY_ENCRYPTION_SECRET=

AI_DEFAULT_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
GEMINI_MODEL=gemini-1.5-pro
```

Do not prefix provider API keys with `NEXT_PUBLIC_`. Provider calls run only on the server. GUI-saved user keys are validated by Convex actions, encrypted with `AI_KEY_ENCRYPTION_SECRET`, and never displayed back to the browser.

For local Convex development, set the encryption secret in the Convex environment:

```bash
npx convex env set AI_KEY_ENCRYPTION_SECRET "use-a-random-secret-at-least-32-characters"
```

If you want server fallback keys in Convex actions, set those in Convex too:

```bash
npx convex env set OPENAI_API_KEY "..."
npx convex env set ANTHROPIC_API_KEY "..."
npx convex env set GOOGLE_GEMINI_API_KEY "..."
```

Convex authentication with Clerk also requires setting the Clerk JWT issuer domain in the Convex deployment environment:

```bash
CLERK_JWT_ISSUER_DOMAIN=
```

Run the beta app locally:

```bash
npm install
npx convex dev
npm run dev
```

Validate the web app:

```bash
npm run typecheck
npm run lint
npm run build
```

### In-App AI Delivery Artifacts

The AI integration is provider-agnostic. UI code calls the Product Delivery OS backend route, the route calls `src/lib/ai`, and provider-specific SDK logic stays isolated in:

- `src/lib/ai/clients/openai.ts`
- `src/lib/ai/clients/anthropic.ts`
- `src/lib/ai/clients/gemini.ts`

Users can also configure provider API keys in the app under **Manage Account**. The screen requires a successful provider validation before enabling save. Saving re-validates the key server-side, encrypts it, and stores only a masked preview such as `•••• 1234` for display.

Provider selection order:

1. Explicit provider selected in the workflow runner.
2. `AI_DEFAULT_PROVIDER`.
3. OpenAI when `OPENAI_API_KEY` is configured.
4. Controlled configuration error when no provider is configured.

The app does not silently fail over from one selected provider to another. If the selected provider is missing its API key, the API returns: `AI provider is not configured. Please set the required API key.`

Sample raw input:

```text
Stakeholder asks to add approval routing for checkout refunds above $500. Ops needs audit visibility, QA wants regression coverage for refund status updates, and Finance needs to confirm reporting impact before release.
```

The AI response is strict JSON with summary, facts, assumptions, open questions, requirements, impacted systems, dependencies, risks, Given/When/Then acceptance criteria, test scenarios, Jira story drafts, stakeholder update, next actions, and confidence notes. AI output is saved as an AI Draft first. Users must review or edit it before treating it as delivery-ready.

Manual AI test cases:

1. Submit valid raw stakeholder email using the default provider.
2. Submit valid raw input using OpenAI.
3. Submit valid raw input using Anthropic.
4. Submit valid raw input using Gemini.
5. Submit empty raw input.
6. Run with a missing API key.
7. Simulate invalid AI JSON response.
8. Save a reviewed AI Draft.
9. Confirm existing prompt copy/paste workflows still work.

Known limitations:

- The first AI Draft editor is JSON-first, not a fully custom artifact editor for every section.
- Provider schema enforcement still relies on runtime validation after provider response parsing.
- Real project data should remain sanitized unless your organization explicitly approves use of the configured AI provider.

Future enhancements:

- Section-level artifact editors for requirements, risks, acceptance criteria, and Jira stories.
- Provider model selection per workspace.
- Audit controls for AI generation history and review signoff.

Beta privacy warning: do not enter confidential company, client, production, regulated, or customer data during beta testing. Use sanitized requirements unless your organization permits use.

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
