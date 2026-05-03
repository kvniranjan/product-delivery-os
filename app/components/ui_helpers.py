from __future__ import annotations

from pathlib import Path

import streamlit as st

from app.components.markdown_exporter import safe_download_filename
from app.components.prompt_builder import build_prompt
from app.components.workflow_loader import Workflow
from app.components.workspace_manager import save_artifact


def render_privacy_warning() -> None:
    st.warning(
        "Local-first privacy reminder: this app does not call AI APIs. It saves artifacts locally under workspace/. "
        "Do not enter confidential data unless you are running locally and following your company policies."
    )


def render_sidebar() -> None:
    st.sidebar.title("Product Delivery OS")
    st.sidebar.caption("Local-first GUI for BA/PO workflows.")
    st.sidebar.info("No AI API keys. No login. Copy prompts into your preferred AI tool.")


def render_workflow_header(workflow: Workflow) -> None:
    st.title(workflow.title)
    st.write(workflow.description)
    if workflow.missing_files:
        st.error(f"Missing workflow files: {', '.join(workflow.missing_files)}")
    with st.expander("Workflow instructions"):
        st.markdown(workflow.instructions or "_No instructions found._")
    with st.expander("Workflow checklist"):
        st.markdown(workflow.checklist or "_No checklist found._")


def render_prompt_box(prompt: str, key: str = "generated_prompt") -> None:
    st.text_area(
        "Generated self-contained prompt",
        value=prompt,
        height=420,
        key=key,
        help="Select all text and copy it into ChatGPT, Claude, Gemini, Codex, Cursor, or another AI assistant.",
    )
    st.caption("Copy the full prompt above into any AI tool. Streamlit clipboard support varies, so this uses a copy-friendly text area.")


def render_save_controls() -> tuple[str, str]:
    artifact_title = st.text_input("Artifact title", value="Untitled artifact")
    ai_output = st.text_area("Paste AI output here", height=300)
    return artifact_title, ai_output


def render_artifact_success_message(path: Path) -> None:
    st.success(f"Saved artifact: {path}")


def render_workflow_page(workflow: Workflow) -> None:
    render_sidebar()
    render_privacy_warning()
    render_workflow_header(workflow)

    user_input = st.text_area("Raw input or project context", height=220)
    optional_context = st.text_area("Optional additional context", height=140)

    if st.button("Generate self-contained prompt", type="primary"):
        st.session_state[f"{workflow.id}_prompt"] = build_prompt(workflow, user_input, optional_context)

    prompt = st.session_state.get(f"{workflow.id}_prompt")
    if prompt:
        render_prompt_box(prompt, key=f"{workflow.id}_prompt_box")

    st.divider()
    st.subheader("Save AI Output")
    artifact_title, ai_output = render_save_controls()
    if st.button("Save AI output", key=f"{workflow.id}_save"):
        if not ai_output.strip():
            st.error("Paste AI output before saving.")
        else:
            path = save_artifact(workflow.id, artifact_title, ai_output, source_input_title=artifact_title)
            render_artifact_success_message(path)
            st.download_button(
                "Download Markdown",
                data=path.read_text(encoding="utf-8"),
                file_name=safe_download_filename(artifact_title, workflow.id),
                mime="text/markdown",
            )
