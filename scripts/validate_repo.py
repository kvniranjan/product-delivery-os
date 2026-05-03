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
