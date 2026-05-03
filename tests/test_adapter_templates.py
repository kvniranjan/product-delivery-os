from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_adapter_templates_exist():
    paths = [
        "adapters/codex/AGENTS.md.template",
        "adapters/claude-code/CLAUDE.md.template",
        "adapters/generic/single-file-prompt.template.md",
        "adapters/cursor/rules/product-delivery-os-core.mdc",
    ]
    for path in paths:
        assert (ROOT / path).is_file()


def test_codex_skills_have_frontmatter():
    for skill in (ROOT / "adapters" / "codex" / "skills").glob("*/SKILL.md"):
        text = skill.read_text()
        assert text.startswith("---")
        assert "name:" in text
        assert "description:" in text
