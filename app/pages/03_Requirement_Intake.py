from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.components.ui_helpers import render_workflow_page
from app.components.workflow_loader import load_workflow


st.set_page_config(page_title="Requirement Intake", layout="wide")
render_workflow_page(load_workflow("requirement-intake"))
