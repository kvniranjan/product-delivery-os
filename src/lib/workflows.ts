import fs from "node:fs";
import path from "node:path";

export type WorkflowDefinition = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  outputTemplate: string;
  checklist: string;
};

function read(filePath: string) {
  return fs.readFileSync(filePath, "utf8").trim();
}

function yamlValue(source: string, key: string) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? "";
}

export function getWorkflow(id: string): WorkflowDefinition | null {
  const workflowDir = path.join(process.cwd(), "workflows", id);
  if (!fs.existsSync(path.join(workflowDir, "workflow.yaml"))) return null;
  if (!fs.existsSync(path.join(workflowDir, "instructions.md"))) return null;
  if (!fs.existsSync(path.join(workflowDir, "output-template.md"))) return null;
  if (!fs.existsSync(path.join(workflowDir, "checklist.md"))) return null;

  const meta = read(path.join(workflowDir, "workflow.yaml"));
  return {
    id,
    title: yamlValue(meta, "title"),
    description: yamlValue(meta, "description"),
    instructions: read(path.join(workflowDir, "instructions.md")),
    outputTemplate: read(path.join(workflowDir, "output-template.md")),
    checklist: read(path.join(workflowDir, "checklist.md"))
  };
}

export function getWorkflows() {
  const workflowRoot = path.join(process.cwd(), "workflows");
  const workflows = fs
    .readdirSync(workflowRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => getWorkflow(entry.name))
    .filter((workflow): workflow is WorkflowDefinition => workflow !== null);

  return workflows.sort((a, b) => a.title.localeCompare(b.title));
}
