from __future__ import annotations

import streamlit as st

from app.components.ui_helpers import render_artifact_success_message, render_privacy_warning, render_sidebar
from app.components.workspace_manager import save_workspace_context


st.set_page_config(page_title="Onboard Workspace", layout="wide")
render_sidebar()
st.title("Onboard Workspace")
render_privacy_warning()
st.info("Do not enter confidential data unless you are running locally and following your company policies.")

role = st.selectbox("Role", ["Business Analyst", "Product Owner", "Hybrid BA/PO", "Systems Analyst", "Delivery Lead"])
domain = st.text_input("Domain")
product_name = st.text_input("Product/platform name")
stakeholders = st.text_area("Stakeholders", height=160)
systems = st.text_area("Systems/applications", height=160)
delivery_tools = st.text_area("Delivery tools", height=120)
definition_of_ready = st.text_area("Definition of Ready", height=120)
definition_of_done = st.text_area("Definition of Done", height=120)
governance_notes = st.text_area("Governance/compliance notes", height=120)

if st.button("Save workspace context", type="primary"):
    paths = save_workspace_context(
        role=role,
        domain=domain,
        product_name=product_name,
        stakeholders=stakeholders,
        systems=systems,
        delivery_tools=delivery_tools,
        definition_of_ready=definition_of_ready,
        definition_of_done=definition_of_done,
        governance_notes=governance_notes,
    )
    for path in paths:
        render_artifact_success_message(path)
