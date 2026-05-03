from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.components.ui_helpers import render_privacy_warning, render_sidebar
from app.components.workspace_manager import save_workspace_context


st.set_page_config(page_title="Onboard Workspace", layout="wide")
render_sidebar()
st.markdown('<div class="pdos-kicker">Local workspace setup</div>', unsafe_allow_html=True)
st.title("Workspace Profile")
st.markdown(
    '<p class="pdos-lede">Capture sanitized delivery context once, then use it when composing workflow prompts.</p>',
    unsafe_allow_html=True,
)
render_privacy_warning()
st.info("Use this saved context when composing workflow prompts. Keep it sanitized and local-policy compliant.")

profile_left, profile_right = st.columns(2)
with profile_left:
    role = st.selectbox("Role", ["Business Analyst", "Product Owner", "Hybrid BA/PO", "Systems Analyst", "Delivery Lead"])
    domain = st.text_input("Domain")
with profile_right:
    product_name = st.text_input("Product/platform name")
    delivery_tools = st.text_area("Delivery tools", height=120)

context_left, context_right = st.columns(2)
with context_left:
    stakeholders = st.text_area("Stakeholders", height=170)
    definition_of_ready = st.text_area("Definition of Ready", height=130)
with context_right:
    systems = st.text_area("Systems/applications", height=170)
    definition_of_done = st.text_area("Definition of Done", height=130)

governance_notes = st.text_area("Governance/compliance notes", height=130)

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
    st.success("Workspace profile saved.")
    st.markdown("Created or updated:")
    for path in paths:
        st.markdown(f"- `{path}`")
