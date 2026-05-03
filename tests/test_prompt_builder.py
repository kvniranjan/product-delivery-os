from app.components.prompt_builder import build_prompt
from app.components.workflow_loader import load_workflow


def test_prompt_builder_creates_self_contained_prompt():
    workflow = load_workflow("story-builder")
    prompt = build_prompt(workflow, "Create a story for payment hold release.", "Core banking context.")

    assert "## Role" in prompt
    assert "## Workflow Name" in prompt
    assert "Story Builder" in prompt
    assert "## Step-by-Step Instructions" in prompt
    assert "## Output Format" in prompt
    assert "## Checklist" in prompt
    assert "Create a story for payment hold release." in prompt
    assert "Core banking context." in prompt
    assert "Separate confirmed facts, assumptions, dependencies, risks, and open questions." in prompt
    assert "Do not assume the user has provided any Product Delivery OS context beyond this prompt." in prompt


def test_prompt_builder_includes_workflow_source_material():
    workflow = load_workflow("impact-analysis")
    prompt = build_prompt(workflow, "Assess this change.")

    assert workflow.description in prompt
    assert workflow.instructions.strip() in prompt
    assert workflow.output_template.strip() in prompt
    assert workflow.checklist.strip() in prompt
    assert "Assess this change." in prompt
