# Product Delivery OS Local GUI

This folder contains a lightweight Streamlit GUI for Product Delivery OS.

The GUI is local-first. It does not call OpenAI, Claude, Gemini, or any other AI API. It does not require an API key, login, database, or SaaS setup.

## What It Does

- Select a BA/PO delivery workflow.
- Compose a self-contained prompt from the files under `workflows/`.
- Let the user copy that prompt into any AI tool.
- Let the user paste the AI response back into the app.
- Save outputs locally under `workspace/`.
- Preview and download Markdown artifacts.

## Architecture

- `streamlit_app.py`: main entry point and overview.
- `pages/`: Streamlit pages for onboarding, each workflow, and export.
- `components/workflow_loader.py`: loads workflow YAML and Markdown source files.
- `components/prompt_builder.py`: builds AI-agnostic self-contained prompts.
- `components/workspace_manager.py`: creates `workspace/` and saves artifacts locally.
- `components/markdown_exporter.py`: formats saved Markdown artifacts.
- `components/ui_helpers.py`: shared Streamlit UI helpers.

## Pages

- Home
- Onboard Workspace
- Requirement Intake
- Impact Analysis
- Story Builder
- Acceptance Criteria
- Backlog Refinement
- Test Scenario Builder
- Stakeholder Brief
- Traceability Check
- Change Request Analysis
- Release Readiness
- Export Center

## Run Locally

```bash
pip install -r requirements.txt
streamlit run app/streamlit_app.py
```

Artifacts are saved under `workspace/`, which is gitignored. Do not enter confidential data unless you are running locally and following your company policies.
