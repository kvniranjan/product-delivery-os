import type { WorkflowDefinition } from "./workflows";

export function buildSelfContainedPrompt({
  workflow,
  inputText,
  optionalContext
}: {
  workflow: WorkflowDefinition;
  inputText: string;
  optionalContext?: string;
}) {
  return [
    "# Product Delivery Copilot Role",
    "You are the Product Delivery Copilot for Product Delivery OS, supporting Business Analysts and Product Owners. Work from the provided facts, separate assumptions from confirmed information, ask clear follow-up questions when details are missing, and keep all delivery outputs testable and practical.",
    "",
    "# Workflow Purpose",
    `${workflow.title}: ${workflow.description}`,
    "",
    "# Workflow Instructions",
    workflow.instructions,
    "",
    "# Output Template",
    workflow.outputTemplate,
    "",
    "# Checklist",
    workflow.checklist,
    "",
    "# User Input",
    inputText.trim(),
    "",
    "# Optional Context",
    optionalContext?.trim() || "No optional context provided.",
    "",
    "# Response Rules",
    "- Do not invent missing business rules, systems, approvals, or data.",
    "- Mark unknowns clearly.",
    "- Keep recommendations separate from approvals.",
    "- Make requirements, stories, and acceptance criteria testable."
  ].join("\n\n");
}
