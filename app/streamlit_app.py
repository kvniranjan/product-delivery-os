from __future__ import annotations

import streamlit as st

from app.components.ui_helpers import render_privacy_warning, render_sidebar
from app.components.workflow_loader import list_available_workflows


st.set_page_config(page_title="Product Delivery OS", layout="wide")
render_sidebar()

st.title("Product Delivery OS")
st.subheader("Local-first GUI for Business Analysts and Product Owners")

st.write(
    "This Streamlit app helps you select workflows, compose self-contained prompts, save local artifacts, "
    "and export Markdown. It does not call OpenAI, Claude, Gemini, or any other AI API."
)

render_privacy_warning()

st.header("How to Use")
st.markdown(
    """
1. Select a workflow page from the sidebar.
2. Enter raw input or project context.
3. Generate a self-contained prompt.
4. Copy the prompt into any AI tool: ChatGPT, Claude, Gemini, Codex, Cursor, or another assistant.
5. Paste the AI output back into the app.
6. Save the artifact locally under `workspace/`.
"""
)

st.header("Available Workflows")
for workflow in list_available_workflows():
    st.markdown(f"- **{workflow['title']}** (`{workflow['id']}`): {workflow['description']}")

st.info("Use the Home and Export Center pages for orientation and saved artifact review.")
