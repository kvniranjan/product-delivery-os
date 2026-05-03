from pathlib import Path

from app.components.workspace_manager import (
    WORKFLOW_FOLDER_MAP,
    ensure_workspace,
    get_workflow_folder,
    list_saved_artifacts,
    read_artifact,
    save_artifact,
)


def test_workspace_manager_maps_workflows_to_expected_folders(tmp_path):
    for workflow_id, folder in WORKFLOW_FOLDER_MAP.items():
        assert get_workflow_folder(workflow_id, workspace_dir=tmp_path) == tmp_path / folder


def test_workspace_manager_saves_and_lists_artifacts(tmp_path):
    ensure_workspace(workspace_dir=tmp_path, example_dir=Path("missing-example"))
    path = save_artifact(
        "requirement-intake",
        "Payment hold intake",
        "# AI Output\n\nDraft artifact.",
        workspace_dir=tmp_path,
    )

    assert path.parent == tmp_path / "requirements"
    assert path.name.endswith(".md")
    content = read_artifact(path)
    assert "generated_by: Product Delivery OS GUI" in content
    assert "# AI Output" in content

    artifacts = list_saved_artifacts(workspace_dir=tmp_path)
    assert any(artifact.path == path for artifact in artifacts)


def test_workspace_is_gitignored():
    assert "workspace/" in Path(".gitignore").read_text(encoding="utf-8")
