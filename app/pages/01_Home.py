from __future__ import annotations

import streamlit as st

from app.components.ui_helpers import render_privacy_warning, render_sidebar
from app.components.workflow_loader import list_available_workflows


st.set_page_config(page_title="Product Delivery OS Home", layout="wide")
render_sidebar()

st.title("Product Delivery OS Local GUI")
st.write("A lightweight local app for composing AI-agnostic BA/PO workflow prompts and saving Markdown artifacts.")
render_privacy_warning()

st.header("Primary Flow")
st.markdown(
    """
1. Pick a workflow.
2. Enter sanitized input.
3. Generate a complete prompt.
4. Copy the prompt into your preferred AI tool.
5. Paste the AI response back into the app.
6. Save and export the artifact as Markdown.
"""
)

st.header("Workflows")
for workflow in list_available_workflows():
    st.markdown(f"- **{workflow['title']}**: {workflow['description']}")
