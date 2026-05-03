from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    import yaml
except Exception:  # pragma: no cover - fallback is for minimal environments
    yaml = None


REPO_ROOT = Path(__file__).resolve().parents[2]
WORKFLOWS_DIR = REPO_ROOT / "workflows"
EXPECTED_WORKFLOWS = [
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


@dataclass(frozen=True)
class Workflow:
    id: str
    title: str
    description: str
    metadata: dict[str, Any]
    instructions: str
    output_template: str
    checklist: str
    path: Path
    missing_files: tuple[str, ...] = ()


def _read_text(path: Path, missing: list[str]) -> str:
    if not path.is_file():
        missing.append(path.name)
        return ""
    return path.read_text(encoding="utf-8")


def _read_manifest(path: Path, missing: list[str]) -> dict[str, Any]:
    if not path.is_file():
        missing.append(path.name)
        return {}
    text = path.read_text(encoding="utf-8")
    if yaml is not None:
        data = yaml.safe_load(text)
        return data if isinstance(data, dict) else {}

    data: dict[str, Any] = {}
    current_key: str | None = None
    for line in text.splitlines():
        if not line.strip():
            continue
        if not line.startswith(" ") and ":" in line:
            key, value = line.split(":", 1)
            current_key = key.strip()
            data[current_key] = value.strip() or []
        elif current_key and line.strip().startswith("- "):
            data.setdefault(current_key, [])
            if isinstance(data[current_key], list):
                data[current_key].append(line.strip()[2:])
    return data


def list_available_workflows(workflows_dir: Path = WORKFLOWS_DIR) -> list[dict[str, str]]:
    workflows = []
    for workflow_id in EXPECTED_WORKFLOWS:
        workflow = load_workflow(workflow_id, workflows_dir=workflows_dir)
        workflows.append(
            {
                "id": workflow.id,
                "title": workflow.title,
                "description": workflow.description,
            }
        )
    return workflows


def load_workflow(workflow_id: str, workflows_dir: Path = WORKFLOWS_DIR) -> Workflow:
    workflow_path = workflows_dir / workflow_id
    missing: list[str] = []
    metadata = _read_manifest(workflow_path / "workflow.yaml", missing)
    instructions = _read_text(workflow_path / "instructions.md", missing)
    output_template = _read_text(workflow_path / "output-template.md", missing)
    checklist = _read_text(workflow_path / "checklist.md", missing)

    title = str(metadata.get("title") or workflow_id.replace("-", " ").title())
    description = str(metadata.get("description") or "Workflow metadata is missing.")
    return Workflow(
        id=workflow_id,
        title=title,
        description=description,
        metadata=metadata,
        instructions=instructions,
        output_template=output_template,
        checklist=checklist,
        path=workflow_path,
        missing_files=tuple(missing),
    )
