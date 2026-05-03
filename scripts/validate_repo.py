from __future__ import annotations

import sys
from pathlib import Path

try:
    import yaml
except Exception:
    yaml = None

ROOT = Path(__file__).resolve().parents[1]

WORKFLOWS = [
    "requirement-intake",
    "impact-analysis",
    "story-builder",
    "acceptance-criteria",
    "backlog-refinement",
    "test-scenario-builder",
    "stakeholder-brief",
    "traceability-check",
    "change-request-analysis",
    "release-readiness",
]
REQUIRED_WORKFLOW_FILES = ["workflow.yaml", "instructions.md", "output-template.md", "checklist.md"]
REQUIRED_WORKFLOW_KEYS = {
    "id",
    "title",
    "description",
    "trigger_phrases",
    "input_types",
    "outputs",
    "quality_gates",
    "related_templates",
    "recommended_role_packs",
}
REQUIRED_TEMPLATES = [
    "brd-template.md",
    "frd-template.md",
    "jira-story-template.md",
    "acceptance-criteria-template.md",
    "impact-analysis-template.md",
    "data-mapping-template.md",
    "traceability-matrix-template.md",
    "stakeholder-update-template.md",
    "change-request-template.md",
    "test-scenario-template.md",
    "uat-signoff-template.md",
    "release-readiness-template.md",
]
SUPPORTED_TOOL_MARKERS = [
    "ChatGPT",
    "Claude web",
    "Gemini",
    "Codex",
    "Claude Code",
    "Cursor",
    "Generic AI",
]
PRIVACY_MARKERS = [
    "client data",
    "company data",
    "customer data",
    "production data",
    "credentials",
    "workspace/",
]
REQUIRED_PROMPT_SECTIONS = [
    "## Role Definition",
    "## Workflow Name",
    "## Purpose",
    "## When to Use",
    "## Required Inputs",
    "## Step-by-Step Workflow Instructions",
    "## Quality Rules",
    "## Output Format",
    "## Checklist",
    "## User Input Placeholders",
]
PROMPT_PRIVACY_MARKERS = [
    "Protect privacy",
    "client data",
    "customer data",
    "credentials",
    "production data",
]
REQUIRED_APP_COMPONENTS = [
    "workflow_loader.py",
    "prompt_builder.py",
    "workspace_manager.py",
    "markdown_exporter.py",
    "ui_helpers.py",
]
REQUIRED_APP_PAGES = [
    "01_Home.py",
    "02_Onboard_Workspace.py",
    "03_Requirement_Intake.py",
    "04_Impact_Analysis.py",
    "05_Story_Builder.py",
    "06_Acceptance_Criteria.py",
    "07_Backlog_Refinement.py",
    "08_Test_Scenario_Builder.py",
    "09_Stakeholder_Brief.py",
    "10_Traceability_Check.py",
    "11_Change_Request_Analysis.py",
    "12_Release_Readiness.py",
    "13_Export_Center.py",
]


def read_manifest(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if yaml:
        data = yaml.safe_load(text)
        return data if isinstance(data, dict) else {}
    data: dict[str, object] = {}
    for line in text.splitlines():
        if line and not line.startswith(" ") and ":" in line:
            key, value = line.split(":", 1)
            data[key.strip()] = value.strip()
    return data


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def validate() -> list[str]:
    errors: list[str] = []
    for folder in ["core", "role-packs", "workflows", "templates", "prompt-packs", "adapters", "workspace.example", "examples", "scripts", "tests"]:
        if not (ROOT / folder).is_dir():
            fail(errors, f"Missing folder: {folder}")
    if not (ROOT / "app").is_dir():
        fail(errors, "Missing folder: app")
    if not (ROOT / "app" / "streamlit_app.py").is_file():
        fail(errors, "Missing app/streamlit_app.py")
    for component in REQUIRED_APP_COMPONENTS:
        if not (ROOT / "app" / "components" / component).is_file():
            fail(errors, f"Missing app component: {component}")
    for page in REQUIRED_APP_PAGES:
        if not (ROOT / "app" / "pages" / page).is_file():
            fail(errors, f"Missing app page: {page}")
    requirements = ROOT / "requirements.txt"
    pyproject = ROOT / "pyproject.toml"
    has_streamlit_requirement = requirements.is_file() and "streamlit" in requirements.read_text(encoding="utf-8")
    has_streamlit_pyproject = pyproject.is_file() and "streamlit" in pyproject.read_text(encoding="utf-8")
    if not has_streamlit_requirement and not has_streamlit_pyproject:
        fail(errors, "Missing streamlit dependency in requirements.txt or pyproject.toml")
    for workflow in WORKFLOWS:
        base = ROOT / "workflows" / workflow
        if not base.is_dir():
            fail(errors, f"Missing workflow folder: {workflow}")
            continue
        for filename in REQUIRED_WORKFLOW_FILES:
            if not (base / filename).is_file():
                fail(errors, f"Missing {filename} in {workflow}")
        manifest = base / "workflow.yaml"
        if manifest.is_file():
            keys = set(read_manifest(manifest).keys())
            missing = REQUIRED_WORKFLOW_KEYS - keys
            if missing:
                fail(errors, f"{workflow} workflow.yaml missing keys: {sorted(missing)}")
    for template in REQUIRED_TEMPLATES:
        if not (ROOT / "templates" / template).is_file():
            fail(errors, f"Missing template: {template}")
    adapter_files = [
        "adapters/codex/README.md",
        "adapters/codex/AGENTS.md.template",
        "adapters/claude-code/README.md",
        "adapters/claude-code/CLAUDE.md.template",
        "adapters/cursor/README.md",
        "adapters/generic/README.md",
        "adapters/generic/single-file-prompt.template.md",
    ]
    for adapter in adapter_files:
        if not (ROOT / adapter).is_file():
            fail(errors, f"Missing adapter file: {adapter}")
    gitignore = (ROOT / ".gitignore").read_text(encoding="utf-8") if (ROOT / ".gitignore").is_file() else ""
    if "workspace/" not in gitignore:
        fail(errors, "workspace/ is not gitignored")
    readme = (ROOT / "README.md").read_text(encoding="utf-8") if (ROOT / "README.md").is_file() else ""
    if "## Inspiration" not in readme or "Nate Herk" not in readme:
        fail(errors, "README missing Inspiration attribution")
    if "Privacy Warning" not in readme:
        fail(errors, "README missing Privacy warning")
    if "Optional Local GUI" not in readme or "streamlit run app/streamlit_app.py" not in readme:
        fail(errors, "README missing Optional Local GUI run instructions")
    for marker in SUPPORTED_TOOL_MARKERS:
        if marker not in readme:
            fail(errors, f"README missing supported tool marker: {marker}")
    for marker in PRIVACY_MARKERS:
        if marker not in readme:
            fail(errors, f"README privacy section missing marker: {marker}")
    if "not affiliated with Nate Herk" not in readme:
        fail(errors, "README missing non-affiliation statement")
    generic_phrases = [
        "Use when the team needs a structured document that can be reviewed",
        "Example placeholder title",
        "Use this workflow when a delivery team needs a structured, reviewable artifact",
    ]
    for path in list((ROOT / "templates").glob("*.md")) + list((ROOT / "workflows").glob("*/instructions.md")):
        text = path.read_text(encoding="utf-8")
        for phrase in generic_phrases:
            if phrase in text:
                fail(errors, f"{path.relative_to(ROOT)} still contains generic placeholder phrase: {phrase}")
    prompt_dir = ROOT / "prompt-packs" / "generic-chat" / "workflow-prompts"
    for workflow in WORKFLOWS:
        prompt = prompt_dir / f"{workflow}.md"
        if not prompt.is_file():
            fail(errors, f"Missing generic workflow prompt: {prompt.relative_to(ROOT)}")
            continue
        text = prompt.read_text(encoding="utf-8")
        section_positions = []
        for section in REQUIRED_PROMPT_SECTIONS:
            position = text.find(section)
            if position == -1:
                fail(errors, f"{prompt.relative_to(ROOT)} missing section: {section}")
            section_positions.append(position)
        found_positions = [position for position in section_positions if position >= 0]
        if found_positions != sorted(found_positions):
            fail(errors, f"{prompt.relative_to(ROOT)} required sections are out of order")
        for marker in PROMPT_PRIVACY_MARKERS:
            if marker not in text:
                fail(errors, f"{prompt.relative_to(ROOT)} missing privacy marker: {marker}")
        if "```text" not in text:
            fail(errors, f"{prompt.relative_to(ROOT)} missing fenced user input placeholder")
        old_dependency_phrases = [
            f"Use the `{workflow}` workflow",
            "Use the Product Delivery OS workflow",
        ]
        for phrase in old_dependency_phrases:
            if phrase in text:
                fail(errors, f"{prompt.relative_to(ROOT)} relies on old dependency-style wording: {phrase}")
    manual_test_plan = ROOT / "tests" / "manual-test-plan.md"
    if not manual_test_plan.is_file():
        fail(errors, "Missing tests/manual-test-plan.md")
    else:
        manual_text = manual_test_plan.read_text(encoding="utf-8")
        if "paste the full workflow prompt" not in manual_text:
            fail(errors, "tests/manual-test-plan.md must tell users to paste the full workflow prompt")
        if "Do not merely type" not in manual_text:
            fail(errors, "tests/manual-test-plan.md must warn against referencing only the workflow name")
    if not (ROOT / "LICENSE").is_file():
        fail(errors, "LICENSE missing")
    return errors


if __name__ == "__main__":
    errors = validate()
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        sys.exit(1)
    print("Product Delivery OS validation passed.")
