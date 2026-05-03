import inspect
import re
from pathlib import Path

from app.components import ui_helpers
from app.components.workspace_manager import (
    WORKFLOW_FOLDER_MAP,
    ensure_workspace,
    get_workflow_folder,
    list_saved_artifacts,
    save_artifact,
)


def test_apply_app_theme_exists():
    assert callable(ui_helpers.apply_app_theme)


def test_workflow_page_helper_uses_build_prompt():
    source = inspect.getsource(ui_helpers.render_workflow_page)
    assert "build_prompt(" in source


def test_export_center_artifact_listing_uses_local_workspace(tmp_path):
    ensure_workspace(workspace_dir=tmp_path, example_dir=Path("missing-example"))
    context_dir = tmp_path / "context"
    context_dir.mkdir(parents=True, exist_ok=True)
    (context_dir / "product-context.md").write_text("# Product Context\n", encoding="utf-8")
    saved = save_artifact(
        "story-builder",
        "Checkout address story",
        "Draft story output.",
        workspace_dir=tmp_path,
    )

    artifacts = list_saved_artifacts(workspace_dir=tmp_path)

    assert artifacts
    assert artifacts[0].path == saved
    assert artifacts[0].relative_path.startswith("backlog/")
    assert all(not artifact.relative_path.startswith("context/") for artifact in artifacts)


def test_workspace_mapping_still_covers_all_configured_workflows(tmp_path):
    for workflow_id, folder in WORKFLOW_FOLDER_MAP.items():
        assert get_workflow_folder(workflow_id, workspace_dir=tmp_path) == tmp_path / folder


def test_app_does_not_import_ai_sdks():
    app_root = Path("app")
    forbidden_imports = re.compile(
        r"^\s*(from|import)\s+(openai|anthropic|google\.generativeai|google_genai|cohere|mistralai)\b",
        re.MULTILINE,
    )

    for path in app_root.rglob("*.py"):
        source = path.read_text(encoding="utf-8")
        assert not forbidden_imports.search(source), f"AI SDK import found in {path}"
