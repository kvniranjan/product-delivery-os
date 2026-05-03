from __future__ import annotations

import re
import shutil
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from app.components.markdown_exporter import export_markdown


REPO_ROOT = Path(__file__).resolve().parents[2]
WORKSPACE_DIR = REPO_ROOT / "workspace"
WORKSPACE_EXAMPLE_DIR = REPO_ROOT / "workspace.example"
WORKFLOW_FOLDER_MAP = {
    "requirement-intake": "requirements",
    "impact-analysis": "analysis",
    "story-builder": "backlog",
    "acceptance-criteria": "qa",
    "backlog-refinement": "backlog",
    "test-scenario-builder": "qa",
    "stakeholder-brief": "ceremonies",
    "traceability-check": "qa",
    "change-request-analysis": "analysis",
    "release-readiness": "analysis",
}


@dataclass(frozen=True)
class SavedArtifact:
    path: Path
    relative_path: str
    modified: datetime
    size: int


def ensure_workspace(workspace_dir: Path = WORKSPACE_DIR, example_dir: Path = WORKSPACE_EXAMPLE_DIR) -> Path:
    if workspace_dir.exists():
        return workspace_dir
    if example_dir.exists():
        shutil.copytree(example_dir, workspace_dir)
    else:
        workspace_dir.mkdir(parents=True, exist_ok=True)
    for folder in set(WORKFLOW_FOLDER_MAP.values()) | {"context", "decisions"}:
        (workspace_dir / folder).mkdir(parents=True, exist_ok=True)
    return workspace_dir


def get_workflow_folder(workflow_id: str, workspace_dir: Path = WORKSPACE_DIR) -> Path:
    folder_name = WORKFLOW_FOLDER_MAP.get(workflow_id, "analysis")
    return workspace_dir / folder_name


def safe_filename(workflow_id: str, title: str, created_at: datetime | None = None) -> str:
    timestamp = (created_at or datetime.now()).strftime("%Y%m%d-%H%M%S")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", title.strip().lower()).strip("-") or "artifact"
    return f"{timestamp}-{workflow_id}-{slug[:60]}.md"


def save_artifact(
    workflow_id: str,
    title: str,
    content: str,
    source_input_title: str | None = None,
    workspace_dir: Path = WORKSPACE_DIR,
) -> Path:
    workspace = ensure_workspace(workspace_dir=workspace_dir)
    target_dir = get_workflow_folder(workflow_id, workspace_dir=workspace)
    target_dir.mkdir(parents=True, exist_ok=True)
    created = datetime.now()
    metadata = {
        "workflow": workflow_id,
        "created": created.isoformat(timespec="seconds"),
        "source_input_title": source_input_title or title or "Untitled input",
    }
    filename = safe_filename(workflow_id, title, created_at=created)
    path = target_dir / filename
    path.write_text(export_markdown(content, metadata), encoding="utf-8")
    return path


def list_saved_artifacts(workspace_dir: Path = WORKSPACE_DIR) -> list[SavedArtifact]:
    workspace = ensure_workspace(workspace_dir=workspace_dir)
    artifacts = []
    for path in sorted(workspace.rglob("*.md")):
        if not path.is_file():
            continue
        relative_parts = path.relative_to(workspace).parts
        if relative_parts and relative_parts[0] in {"context", "decisions"}:
            continue
        stat = path.stat()
        artifacts.append(
            SavedArtifact(
                path=path,
                relative_path=str(path.relative_to(workspace)),
                modified=datetime.fromtimestamp(stat.st_mtime),
                size=stat.st_size,
            )
        )
    return sorted(artifacts, key=lambda artifact: artifact.modified, reverse=True)


def read_artifact(path: str | Path) -> str:
    return Path(path).read_text(encoding="utf-8")


def save_workspace_context(
    role: str,
    domain: str,
    product_name: str,
    stakeholders: str,
    systems: str,
    delivery_tools: str,
    definition_of_ready: str,
    definition_of_done: str,
    governance_notes: str,
    workspace_dir: Path = WORKSPACE_DIR,
) -> list[Path]:
    workspace = ensure_workspace(workspace_dir=workspace_dir)
    context_dir = workspace / "context"
    context_dir.mkdir(parents=True, exist_ok=True)
    files = {
        "product-context.md": f"""# Product Context

## Role

{role}

## Domain

{domain}

## Product or Platform Name

{product_name}

## Delivery Tools

{delivery_tools}
""",
        "stakeholder-map.md": f"""# Stakeholder Map

{stakeholders}
""",
        "system-landscape.md": f"""# System Landscape

{systems}
""",
        "domain-glossary.md": f"""# Domain Glossary

Add sanitized domain terms here as they become useful.
""",
        "delivery-priorities.md": f"""# Delivery Priorities

## Definition of Ready

{definition_of_ready}

## Definition of Done

{definition_of_done}

## Governance and Compliance Notes

{governance_notes}
""",
    }
    saved_paths = []
    for filename, content in files.items():
        path = context_dir / filename
        path.write_text(content.strip() + "\n", encoding="utf-8")
        saved_paths.append(path)
    return saved_paths
