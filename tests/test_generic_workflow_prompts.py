from pathlib import Path

from scripts.validate_repo import REQUIRED_PROMPT_SECTIONS, WORKFLOWS


ROOT = Path(__file__).resolve().parents[1]
PROMPT_DIR = ROOT / "prompt-packs" / "generic-chat" / "workflow-prompts"


def test_generic_workflow_prompts_are_self_contained():
    for workflow in WORKFLOWS:
        path = PROMPT_DIR / f"{workflow}.md"
        text = path.read_text()
        positions = []
        for section in REQUIRED_PROMPT_SECTIONS:
            assert section in text, f"{path} missing {section}"
            positions.append(text.index(section))
        assert positions == sorted(positions), f"{path} sections are out of order"
        assert "```text" in text
        assert "Protect privacy" in text
        assert "client data" in text
        assert "customer data" in text
        assert "credentials" in text
        assert "production data" in text
        assert f"Use the `{workflow}` workflow" not in text
        assert "Use the Product Delivery OS workflow" not in text


def test_manual_test_plan_exists_and_requires_full_prompt():
    text = (ROOT / "tests" / "manual-test-plan.md").read_text()
    assert "paste the full workflow prompt" in text
    assert "Do not merely type" in text
    for tool in ["ChatGPT", "Claude web", "Gemini", "generic AI"]:
        assert tool in text
