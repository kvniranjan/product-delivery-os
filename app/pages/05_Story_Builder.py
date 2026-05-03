from __future__ import annotations

import streamlit as st

from app.components.ui_helpers import render_workflow_page
from app.components.workflow_loader import load_workflow


st.set_page_config(page_title="Story Builder", layout="wide")
render_workflow_page(load_workflow("story-builder"))
