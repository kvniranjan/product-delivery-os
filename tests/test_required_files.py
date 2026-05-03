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
    assert "not affiliated with Nate Herk" in readme
    for tool in ["ChatGPT", "Claude web", "Gemini", "Codex", "Claude Code", "Cursor", "Generic AI"]:
        assert tool in readme


def test_templates_are_not_generic_placeholders():
    banned = [
        "Use when the team needs a structured document that can be reviewed",
        "Example placeholder title",
    ]
    for path in (ROOT / "templates").glob("*.md"):
        text = path.read_text()
        for phrase in banned:
            assert phrase not in text, f"{path} contains placeholder phrase: {phrase}"
