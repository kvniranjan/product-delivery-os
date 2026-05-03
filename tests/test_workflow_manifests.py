from pathlib import Path

from scripts.validate_repo import REQUIRED_WORKFLOW_KEYS, WORKFLOWS, read_manifest


ROOT = Path(__file__).resolve().parents[1]


def test_workflow_manifests_have_required_keys():
    for workflow in WORKFLOWS:
        manifest = read_manifest(ROOT / "workflows" / workflow / "workflow.yaml")
        assert REQUIRED_WORKFLOW_KEYS <= set(manifest)
        assert manifest["id"] == workflow


def test_each_workflow_has_required_docs():
    for workflow in WORKFLOWS:
        base = ROOT / "workflows" / workflow
        for name in ["instructions.md", "output-template.md", "checklist.md"]:
            assert (base / name).is_file()
