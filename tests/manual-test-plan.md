# Manual Test Plan

Use this plan to confirm that generic workflow prompts work in a fresh AI chat with no prior Product Delivery OS context.

## Scope

Test the files under `prompt-packs/generic-chat/workflow-prompts/`.

## Tools to Check

- ChatGPT
- Claude web
- Gemini
- A generic AI chat tool

## Steps

1. Open a fresh chat session in the AI tool.
2. Open one workflow prompt file, such as `prompt-packs/generic-chat/workflow-prompts/story-builder.md`.
3. Copy the entire file content.
4. Paste the full workflow prompt into the fresh chat.
5. Replace the fenced user input placeholder block with sanitized sample context.
6. Submit the prompt.
7. Verify the AI produces the expected output sections without needing any other repo file or prior conversation context.

Do not merely type "run the story-builder workflow" or reference the workflow by name. The manual test must paste the full workflow prompt because the prompt is designed to be self-contained.

## Expected Result

- The AI understands its role without additional setup.
- The AI understands the workflow name, purpose, usage, required inputs, steps, quality rules, output format, and checklist.
- The AI separates confirmed facts, assumptions, dependencies, risks, and open questions.
- The AI asks clarifying questions when critical information is missing.
- The AI does not invent business rules.
- The AI preserves privacy and avoids asking for sensitive data.

## Minimum Spot Check Set

- `story-builder.md`
- `impact-analysis.md`
- `release-readiness.md`
