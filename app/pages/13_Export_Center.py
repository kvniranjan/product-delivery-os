from __future__ import annotations

import streamlit as st

from app.components.markdown_exporter import safe_download_filename
from app.components.ui_helpers import render_privacy_warning, render_sidebar
from app.components.workspace_manager import list_saved_artifacts, read_artifact


st.set_page_config(page_title="Export Center", layout="wide")
render_sidebar()
st.title("Export Center")
render_privacy_warning()

artifacts = list_saved_artifacts()
if not artifacts:
    st.info("No saved Markdown artifacts found under workspace/.")
else:
    labels = [f"{artifact.relative_path} | modified {artifact.modified.strftime('%Y-%m-%d %H:%M:%S')}" for artifact in artifacts]
    selected_label = st.selectbox("Saved artifacts", labels)
    selected = artifacts[labels.index(selected_label)]
    content = read_artifact(selected.path)

    st.write(f"Path: `{selected.path}`")
    st.write(f"Last modified: {selected.modified.strftime('%Y-%m-%d %H:%M:%S')}")
    st.text_area("Preview", value=content, height=420)
    st.download_button(
        "Download Markdown",
        data=content,
        file_name=safe_download_filename(selected.path.stem, "export"),
        mime="text/markdown",
    )
