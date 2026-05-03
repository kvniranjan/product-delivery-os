from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.components.ui_helpers import WORKFLOW_PAGE_MAP, WORKFLOW_PHASES, render_privacy_warning, render_sidebar
from app.components.workflow_loader import list_available_workflows
from app.components.workspace_manager import WORKSPACE_DIR, list_saved_artifacts


st.set_page_config(page_title="Product Delivery OS Home", layout="wide")
render_sidebar()

workflows = list_available_workflows()
workflow_by_id = {workflow["id"]: workflow for workflow in workflows}
artifacts = list_saved_artifacts()
context_dir = WORKSPACE_DIR / "context"
context_files = list(context_dir.glob("*.md")) if context_dir.exists() else []

st.markdown('<div class="pdos-kicker">Enterprise delivery command desk</div>', unsafe_allow_html=True)
st.title("Product Delivery OS")
st.markdown(
    '<p class="pdos-lede">A polished local-first BA/PO workbench for turning stakeholder input into structured, AI-agnostic delivery artifacts.</p>',
    unsafe_allow_html=True,
)

tile_a, tile_b, tile_c = st.columns(3)
with tile_a:
    st.markdown('<div class="pdos-tile"><div class="pdos-tile-value">10</div><div class="pdos-tile-label">Workflows across discovery, backlog, quality, and communication</div></div>', unsafe_allow_html=True)
with tile_b:
    st.markdown('<div class="pdos-tile"><div class="pdos-tile-value">Local-only</div><div class="pdos-tile-label">No SaaS workspace, login, database, or external service</div></div>', unsafe_allow_html=True)
with tile_c:
    st.markdown('<div class="pdos-tile"><div class="pdos-tile-value">0 API keys</div><div class="pdos-tile-label">Copy prompts into the AI tool you choose</div></div>', unsafe_allow_html=True)

render_privacy_warning()

st.header("Start Here")
selector_col, status_col = st.columns([1.3, 1])
with selector_col:
    selected_title = st.selectbox("Workflow selector", [workflow["title"] for workflow in workflows])
    selected = next(workflow for workflow in workflows if workflow["title"] == selected_title)
    st.page_link(WORKFLOW_PAGE_MAP[selected["id"]], label=f"Open {selected['title']}")
with status_col:
    st.markdown(
        f"""
        <div class="pdos-panel" style="padding:1rem;">
            <div class="pdos-card-title">Workspace Status</div>
            <div class="pdos-meta-row">Workspace exists: <strong>{"Yes" if WORKSPACE_DIR.exists() else "No"}</strong></div>
            <div class="pdos-meta-row">Context files found: <strong>{len(context_files)}</strong></div>
            <div class="pdos-meta-row">Artifacts saved: <strong>{len(artifacts)}</strong></div>
        </div>
        """,
        unsafe_allow_html=True,
    )

st.header("Workflow Library")
for phase, workflow_ids in WORKFLOW_PHASES.items():
    st.subheader(phase)
    columns = st.columns(3)
    for index, workflow_id in enumerate(workflow_ids):
        workflow = workflow_by_id[workflow_id]
        with columns[index % 3]:
            st.markdown(
                f"""
                <div class="pdos-workflow-card">
                    <div class="pdos-card-title">{workflow["title"]}</div>
                    <div class="pdos-card-body">{workflow["description"]}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
            st.page_link(WORKFLOW_PAGE_MAP[workflow_id], label="Open workflow")

st.header("Recent Artifacts")
if artifacts:
    for artifact in artifacts[:5]:
        st.markdown(
            f'<div class="pdos-artifact-preview"><strong>{artifact.relative_path}</strong><div class="pdos-meta-row">Modified {artifact.modified.strftime("%Y-%m-%d %H:%M")} | {artifact.size} bytes</div></div>',
            unsafe_allow_html=True,
        )
    st.page_link("pages/13_Export_Center.py", label="Open Export Center")
else:
    st.info("No artifacts yet. Saved Markdown files will appear here after a workflow output is captured.")
