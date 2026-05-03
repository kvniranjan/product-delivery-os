from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.components.markdown_exporter import safe_download_filename
from app.components.ui_helpers import render_privacy_warning, render_sidebar
from app.components.workspace_manager import list_saved_artifacts, read_artifact


st.set_page_config(page_title="Export Center", layout="wide")
render_sidebar()

def format_size(size: int) -> str:
    if size < 1024:
        return f"{size} B"
    return f"{size / 1024:.1f} KB"


def artifact_folder(relative_path: str) -> str:
    parts = relative_path.split("/", 1)
    return parts[0] if len(parts) > 1 else "workspace"


st.markdown('<div class="pdos-kicker">Local artifact browser</div>', unsafe_allow_html=True)
st.title("Export Center")
st.markdown(
    '<p class="pdos-lede">Review saved Markdown artifacts from the local workspace, preview content, and download the selected file.</p>',
    unsafe_allow_html=True,
)
render_privacy_warning()

artifacts = list_saved_artifacts()
st.metric("Saved artifacts", len(artifacts))

if not artifacts:
    st.info("No saved Markdown artifacts found under workspace/. Save an AI response from any workflow and it will appear here.")
else:
    folders = sorted({artifact_folder(artifact.relative_path) for artifact in artifacts})
    folder_filter = st.selectbox("Filter by folder", ["All folders", *folders])
    filtered = [
        artifact
        for artifact in artifacts
        if folder_filter == "All folders" or artifact_folder(artifact.relative_path) == folder_filter
    ]

    rows = [
        {
            "Relative path": artifact.relative_path,
            "Folder": artifact_folder(artifact.relative_path),
            "Modified": artifact.modified.strftime("%Y-%m-%d %H:%M:%S"),
            "Size": format_size(artifact.size),
        }
        for artifact in filtered
    ]

    st.subheader("Artifact List")
    st.dataframe(rows, width="stretch", hide_index=True)

    labels = [artifact.relative_path for artifact in filtered]
    selected_label = st.selectbox("Preview artifact", labels)
    selected = filtered[labels.index(selected_label)]
    content = read_artifact(selected.path)

    meta_left, meta_right, meta_third = st.columns(3)
    with meta_left:
        st.markdown(f'<span class="pdos-badge">{artifact_folder(selected.relative_path)}</span>', unsafe_allow_html=True)
    with meta_right:
        st.markdown(f'<div class="pdos-meta-row">Modified: {selected.modified.strftime("%Y-%m-%d %H:%M:%S")}</div>', unsafe_allow_html=True)
    with meta_third:
        st.markdown(f'<div class="pdos-meta-row">Size: {format_size(selected.size)}</div>', unsafe_allow_html=True)

    st.markdown(f'<div class="pdos-meta-row">Local path: <code>{selected.path}</code></div>', unsafe_allow_html=True)
    st.text_area("Artifact Preview", value=content, height=460)
    st.download_button(
        "Download selected Markdown",
        data=content,
        file_name=safe_download_filename(selected.path.stem, "export"),
        mime="text/markdown",
    )
