from __future__ import annotations

from pathlib import Path

import streamlit as st

from app.components.markdown_exporter import safe_download_filename
from app.components.prompt_builder import build_prompt
from app.components.workflow_loader import Workflow
from app.components.workspace_manager import (
    WORKFLOW_FOLDER_MAP,
    WORKSPACE_DIR,
    get_workflow_folder,
    list_saved_artifacts,
    safe_filename,
    save_artifact,
)


WORKFLOW_PHASES = {
    "Discovery": ["requirement-intake", "impact-analysis"],
    "Backlog": ["story-builder", "acceptance-criteria", "backlog-refinement"],
    "Quality": ["test-scenario-builder", "traceability-check"],
    "Communication": ["stakeholder-brief", "change-request-analysis", "release-readiness"],
}


WORKFLOW_PAGE_MAP = {
    "requirement-intake": "pages/03_Requirement_Intake.py",
    "impact-analysis": "pages/04_Impact_Analysis.py",
    "story-builder": "pages/05_Story_Builder.py",
    "acceptance-criteria": "pages/06_Acceptance_Criteria.py",
    "backlog-refinement": "pages/07_Backlog_Refinement.py",
    "test-scenario-builder": "pages/08_Test_Scenario_Builder.py",
    "stakeholder-brief": "pages/09_Stakeholder_Brief.py",
    "traceability-check": "pages/10_Traceability_Check.py",
    "change-request-analysis": "pages/11_Change_Request_Analysis.py",
    "release-readiness": "pages/12_Release_Readiness.py",
}


def apply_app_theme() -> None:
    st.markdown(
        """
        <style>
        :root {
            --pdos-bg: #f4f6f3;
            --pdos-panel: #ffffff;
            --pdos-panel-muted: #eef3ef;
            --pdos-ink: #16211d;
            --pdos-muted: #5d6964;
            --pdos-border: #d7ded8;
            --pdos-accent: #0f766e;
            --pdos-accent-strong: #0b5f59;
            --pdos-accent-soft: #dcefed;
            --pdos-amber: #b7791f;
            --pdos-amber-soft: #fff4db;
            --pdos-success: #167049;
            --pdos-shadow: 0 12px 28px rgba(22, 33, 29, 0.08);
            --pdos-radius: 8px;
        }

        .stApp {
            background: var(--pdos-bg);
            color: var(--pdos-ink);
            font-family: "Aptos", "Segoe UI", "Helvetica Neue", sans-serif;
        }

        .block-container {
            padding-top: 2.2rem;
            padding-bottom: 4rem;
            max-width: 1220px;
        }

        h1, h2, h3 {
            color: var(--pdos-ink);
            letter-spacing: 0;
        }

        h1 {
            font-size: 2.25rem;
            line-height: 1.08;
            font-weight: 760;
        }

        h2 {
            font-size: 1.35rem;
            font-weight: 720;
            margin-top: 1.5rem;
        }

        h3 {
            font-size: 1rem;
            font-weight: 700;
        }

        p, li, label, .stMarkdown {
            color: var(--pdos-ink);
        }

        [data-testid="stSidebar"] {
            background: #111c18;
            border-right: 1px solid #26342e;
        }

        [data-testid="stSidebar"] * {
            color: #edf4ef;
        }

        [data-testid="stSidebar"] .stCaption,
        [data-testid="stSidebar"] small {
            color: #b8c7bf !important;
        }

        .stButton > button,
        .stDownloadButton > button,
        button[kind="primary"] {
            border-radius: 7px;
            border: 1px solid var(--pdos-accent-strong);
            background: var(--pdos-accent);
            color: #ffffff;
            font-weight: 700;
            min-height: 2.55rem;
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.08);
        }

        .stButton > button:hover,
        .stDownloadButton > button:hover {
            border-color: var(--pdos-accent-strong);
            background: var(--pdos-accent-strong);
            color: #ffffff;
        }

        .stTextArea textarea,
        .stTextInput input,
        .stSelectbox [data-baseweb="select"] {
            border-radius: 7px;
            border-color: var(--pdos-border);
            background: #ffffff;
            color: var(--pdos-ink);
        }

        .pdos-kicker {
            color: var(--pdos-accent-strong);
            font-size: 0.78rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 0.2rem;
        }

        .pdos-lede {
            max-width: 840px;
            color: var(--pdos-muted);
            font-size: 1.04rem;
            margin-top: -0.35rem;
        }

        .pdos-tile,
        .pdos-workflow-card,
        .pdos-panel,
        .pdos-artifact-preview {
            background: var(--pdos-panel);
            border: 1px solid var(--pdos-border);
            border-radius: var(--pdos-radius);
            box-shadow: var(--pdos-shadow);
        }

        .pdos-tile {
            padding: 1rem;
            min-height: 104px;
        }

        .pdos-tile-value {
            font-size: 1.8rem;
            line-height: 1;
            font-weight: 800;
            color: var(--pdos-ink);
        }

        .pdos-tile-label {
            margin-top: 0.5rem;
            color: var(--pdos-muted);
            font-size: 0.9rem;
        }

        .pdos-workflow-card {
            padding: 0.95rem 1rem;
            min-height: 126px;
            margin-bottom: 0.85rem;
        }

        .pdos-card-title {
            font-weight: 780;
            font-size: 1rem;
            color: var(--pdos-ink);
        }

        .pdos-card-body {
            color: var(--pdos-muted);
            font-size: 0.88rem;
            line-height: 1.45;
            margin-top: 0.35rem;
        }

        .pdos-badge {
            display: inline-flex;
            align-items: center;
            min-height: 1.6rem;
            padding: 0.16rem 0.55rem;
            border-radius: 999px;
            border: 1px solid var(--pdos-border);
            background: var(--pdos-panel-muted);
            color: var(--pdos-ink);
            font-size: 0.78rem;
            font-weight: 750;
        }

        .pdos-badge.local,
        .pdos-badge.success {
            background: var(--pdos-accent-soft);
            border-color: #afcfca;
            color: var(--pdos-accent-strong);
        }

        .pdos-badge.warning {
            background: var(--pdos-amber-soft);
            border-color: #edcf8b;
            color: #7a4d10;
        }

        .pdos-callout {
            border: 1px solid var(--pdos-border);
            border-left: 5px solid var(--pdos-accent);
            background: #ffffff;
            border-radius: 8px;
            padding: 0.85rem 1rem;
            margin: 1rem 0;
            color: var(--pdos-ink);
        }

        .pdos-callout.warning {
            border-left-color: var(--pdos-amber);
            background: var(--pdos-amber-soft);
        }

        .pdos-progress {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.5rem;
            margin: 1rem 0 1.25rem;
        }

        .pdos-step {
            border: 1px solid var(--pdos-border);
            background: #ffffff;
            border-radius: 8px;
            padding: 0.65rem 0.75rem;
            font-size: 0.86rem;
            font-weight: 750;
            color: var(--pdos-ink);
        }

        .pdos-step span {
            color: var(--pdos-accent-strong);
            margin-right: 0.35rem;
            font-weight: 850;
        }

        .pdos-artifact-preview {
            padding: 1rem;
            min-height: 220px;
            overflow: auto;
        }

        .pdos-meta-row {
            color: var(--pdos-muted);
            font-size: 0.86rem;
            margin: 0.25rem 0;
        }

        div[data-testid="stAlert"] {
            border-radius: 8px;
            border: 1px solid var(--pdos-border);
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_privacy_warning() -> None:
    st.markdown(
        """
        <div class="pdos-callout warning">
        <strong>Privacy guardrail:</strong> Product Delivery OS runs local-first, does not call AI APIs, and saves artifacts under
        <code>workspace/</code>. Use sanitized inputs and follow your company data policies.
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_sidebar() -> None:
    apply_app_theme()
    artifacts = list_saved_artifacts()
    st.sidebar.markdown("### Product Delivery OS")
    st.sidebar.caption("Local-first BA/PO delivery workbench")
    st.sidebar.markdown('<span class="pdos-badge local">Local mode</span>', unsafe_allow_html=True)
    st.sidebar.caption("No API keys. No login. No external services.")
    st.sidebar.divider()
    st.sidebar.page_link("streamlit_app.py", label="Command Desk")
    st.sidebar.page_link("pages/01_Home.py", label="Home Dashboard")
    st.sidebar.page_link("pages/02_Onboard_Workspace.py", label="Workspace Profile")
    for phase, workflow_ids in WORKFLOW_PHASES.items():
        with st.sidebar.expander(phase, expanded=phase in {"Discovery", "Backlog"}):
            for workflow_id in workflow_ids:
                label = workflow_id.replace("-", " ").title()
                st.page_link(WORKFLOW_PAGE_MAP[workflow_id], label=label)
    st.sidebar.page_link("pages/13_Export_Center.py", label="Export Center")
    st.sidebar.divider()
    st.sidebar.metric("Artifacts", len(artifacts))
    st.sidebar.caption("Artifacts stay in the local workspace folder until you move or delete them.")


def render_workflow_header(workflow: Workflow) -> None:
    st.markdown('<div class="pdos-kicker">Guided workflow</div>', unsafe_allow_html=True)
    st.title(workflow.title)
    st.markdown(f'<p class="pdos-lede">{workflow.description}</p>', unsafe_allow_html=True)
    if workflow.missing_files:
        st.error(f"Missing workflow files: {', '.join(workflow.missing_files)}")
    st.markdown(
        """
        <div class="pdos-progress">
            <div class="pdos-step"><span>1</span>Input</div>
            <div class="pdos-step"><span>2</span>Prompt</div>
            <div class="pdos-step"><span>3</span>Save</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_prompt_box(prompt: str, key: str = "generated_prompt") -> None:
    st.text_area(
        "Generated Prompt",
        value=prompt,
        height=420,
        key=key,
        help="Select all text and copy it into ChatGPT, Claude, Gemini, Codex, Cursor, or another AI assistant.",
    )
    st.success("Prompt ready. Copy this into your preferred AI tool.")


def render_save_controls(workflow: Workflow) -> tuple[str, str]:
    artifact_title = st.text_input("Artifact title", value="Untitled artifact")
    target_folder = get_workflow_folder(workflow.id)
    filename_preview = safe_filename(workflow.id, artifact_title)
    st.markdown(f'<div class="pdos-meta-row">Target folder: <code>{target_folder}</code></div>', unsafe_allow_html=True)
    st.markdown(f'<div class="pdos-meta-row">Filename preview: <code>{filename_preview}</code></div>', unsafe_allow_html=True)
    ai_output = st.text_area("AI Response", height=300)
    return artifact_title, ai_output


def render_artifact_success_message(path: Path) -> None:
    st.success(f"Saved artifact: {path}")
    st.info("Open Export Center to review, preview, and download saved artifacts.")


def render_workflow_page(workflow: Workflow) -> None:
    render_sidebar()
    render_privacy_warning()
    render_workflow_header(workflow)

    user_input_key = f"{workflow.id}_user_input"
    optional_context_key = f"{workflow.id}_optional_context"
    prompt_key = f"{workflow.id}_prompt"
    compose_tab, prompt_tab, save_tab, reference_tab = st.tabs(["Compose", "Prompt", "Save Artifact", "Workflow Reference"])

    with compose_tab:
        left, right = st.columns([1.25, 1])
        with left:
            user_input = st.text_area("Stakeholder Input", height=260, key=user_input_key)
        with right:
            optional_context = st.text_area("Project Context", height=260, key=optional_context_key)

        if st.button("Generate self-contained prompt", type="primary"):
            st.session_state[prompt_key] = build_prompt(
                workflow,
                st.session_state.get(user_input_key, user_input),
                st.session_state.get(optional_context_key, optional_context),
            )
            st.success("Prompt ready. Copy this into your preferred AI tool.")

    with prompt_tab:
        prompt = st.session_state.get(prompt_key)
        if prompt:
            render_prompt_box(prompt, key=f"{workflow.id}_prompt_box")
        else:
            st.info("Compose stakeholder input first, then generate the self-contained prompt.")

    with save_tab:
        st.subheader("Save Artifact")
        artifact_title, ai_output = render_save_controls(workflow)
        if st.button("Save AI response", key=f"{workflow.id}_save"):
            if not ai_output.strip():
                st.error("Paste AI response before saving.")
            else:
                path = save_artifact(workflow.id, artifact_title, ai_output, source_input_title=artifact_title)
                render_artifact_success_message(path)
                st.download_button(
                    "Download Markdown",
                    data=path.read_text(encoding="utf-8"),
                    file_name=safe_download_filename(artifact_title, workflow.id),
                    mime="text/markdown",
                )

    with reference_tab:
        ref_left, ref_right = st.columns(2)
        with ref_left:
            with st.expander("Workflow instructions", expanded=True):
                st.markdown(workflow.instructions or "_No instructions found._")
        with ref_right:
            with st.expander("Workflow checklist", expanded=True):
                st.markdown(workflow.checklist or "_No checklist found._")
