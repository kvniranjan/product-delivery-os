from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.components.ui_helpers import WORKFLOW_PAGE_MAP, WORKFLOW_PHASES, render_privacy_warning, render_sidebar
from app.components.workflow_loader import list_available_workflows
from app.components.workspace_manager import WORKSPACE_DIR, list_saved_artifacts


st.set_page_config(page_title="Product Delivery OS", layout="wide")
render_sidebar()

workflows = list_available_workflows()
workflow_by_id = {workflow["id"]: workflow for workflow in workflows}
artifacts = list_saved_artifacts()
context_dir = WORKSPACE_DIR / "context"
context_files = list(context_dir.glob("*.md")) if context_dir.exists() else []

st.markdown('<div class="pdos-kicker">Local delivery command desk</div>', unsafe_allow_html=True)
st.title("Product Delivery OS")
st.markdown(
    '<p class="pdos-lede">A local-first BA/PO workbench for composing AI-agnostic delivery prompts, saving Markdown artifacts, and keeping project context on your machine.</p>',
    unsafe_allow_html=True,
)

tile_1, tile_2, tile_3 = st.columns(3)
with tile_1:
    st.markdown('<div class="pdos-tile"><div class="pdos-tile-value">10</div><div class="pdos-tile-label">Delivery workflows</div></div>', unsafe_allow_html=True)
with tile_2:
    st.markdown('<div class="pdos-tile"><div class="pdos-tile-value">Local-only</div><div class="pdos-tile-label">Workspace artifacts stay under workspace/</div></div>', unsafe_allow_html=True)
with tile_3:
    st.markdown('<div class="pdos-tile"><div class="pdos-tile-value">0</div><div class="pdos-tile-label">API keys required</div></div>', unsafe_allow_html=True)

render_privacy_warning()

st.header("Start Here")
selected_title = st.selectbox("Choose a workflow", [workflow["title"] for workflow in workflows])
selected = next(workflow for workflow in workflows if workflow["title"] == selected_title)
st.page_link(WORKFLOW_PAGE_MAP[selected["id"]], label=f"Open {selected['title']}")

st.header("Delivery Phases")
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

st.header("Workspace Status")
status_a, status_b, status_c = st.columns(3)
with status_a:
    state = "Ready" if WORKSPACE_DIR.exists() else "Not created"
    st.markdown(f'<span class="pdos-badge success">Workspace: {state}</span>', unsafe_allow_html=True)
with status_b:
    st.markdown(f'<span class="pdos-badge">Context files: {len(context_files)}</span>', unsafe_allow_html=True)
with status_c:
    st.markdown(f'<span class="pdos-badge">Artifacts saved: {len(artifacts)}</span>', unsafe_allow_html=True)

st.header("Recent Artifacts")
if artifacts:
    for artifact in artifacts[:5]:
        st.markdown(
            f'<div class="pdos-meta-row"><strong>{artifact.relative_path}</strong> | {artifact.modified.strftime("%Y-%m-%d %H:%M")} | {artifact.size} bytes</div>',
            unsafe_allow_html=True,
        )
    st.page_link("pages/13_Export_Center.py", label="Review artifacts in Export Center")
else:
    st.info("No saved artifacts yet. Generate a prompt, paste the AI response, and save it locally.")
