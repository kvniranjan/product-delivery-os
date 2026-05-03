from pathlib import Path

from scripts.validate_repo import validate


ROOT = Path(__file__).resolve().parents[1]


def test_repo_validates():
    assert validate() == []


def test_workspace_is_gitignored():
    assert "workspace/" in (ROOT / ".gitignore").read_text()


def test_readme_attribution_and_privacy():
    readme = (ROOT / "README.md").read_text()
    assert "## Inspiration" in readme
    assert "Nate Herk" in readme
    assert "Privacy Warning" in readme
