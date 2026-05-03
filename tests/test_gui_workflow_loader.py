from app.components.workflow_loader import EXPECTED_WORKFLOWS, list_available_workflows, load_workflow


def test_loader_lists_all_expected_workflows():
    workflows = list_available_workflows()
    assert [workflow["id"] for workflow in workflows] == EXPECTED_WORKFLOWS


def test_loader_loads_all_workflow_source_files():
    for workflow_id in EXPECTED_WORKFLOWS:
        workflow = load_workflow(workflow_id)
        assert workflow.id == workflow_id
        assert workflow.title
        assert workflow.description
        assert workflow.instructions
        assert workflow.output_template
        assert workflow.checklist
        assert workflow.missing_files == ()
