import { afterEach, describe, expect, it, vi } from "vitest";
import { buildDeliveryAnalysisPrompt } from "./prompts";
import { DeliveryAnalysisSchema } from "./schemas";
import { parseJsonResponse, validateDeliveryAnalysisResponse } from "./validate";
import type { AnalyzeDeliveryInputResponse } from "./types";

const validResponse: AnalyzeDeliveryInputResponse = {
  summary: "Refund approvals need routing.",
  problemStatement: "Refund changes need review and audit clarity.",
  businessObjective: "Improve control over high-value refunds.",
  confirmedFacts: ["Refund approval routing is requested."],
  assumptions: ["Finance reporting may be impacted."],
  openQuestions: ["Who approves refunds above the threshold?"],
  functionalRequirements: [
    {
      id: "FR-1",
      requirement: "Route refunds above the configured threshold for approval.",
      priority: "High",
      rationale: "High-value refunds need review."
    }
  ],
  nonFunctionalRequirements: [{ requirement: "Audit changes must be traceable.", category: "Audit", priority: "High" }],
  impactedSystems: [{ system: "Refunds", impact: "Approval flow change", confidence: "Confirmed" }],
  dependencies: [{ dependency: "Finance reporting review", owner: "Finance", status: "Open" }],
  risks: [{ risk: "Reporting impact may be missed.", impact: "Medium", mitigation: "Confirm reporting scope with Finance." }],
  acceptanceCriteria: [{ scenario: "High-value refund approval", given: "A refund is above $500", when: "It is submitted", then: "It requires approval" }],
  testScenarios: ["Verify high-value refunds require approval."],
  jiraStories: [
    {
      title: "Route high-value refunds for approval",
      userStory: "As an Ops user, I want high-value refunds routed for approval so that refund risk is controlled.",
      acceptanceCriteria: ["Given a refund above $500, when submitted, then it requires approval."],
      priority: "High"
    }
  ],
  stakeholderUpdate: {
    executiveSummary: "Approval routing draft is ready for review.",
    deliveryStatus: "Unknown",
    keyUpdates: ["Requirements draft generated."],
    decisionsNeeded: ["Confirm approval owner."],
    escalations: []
  },
  nextBestActions: ["Confirm approver and threshold."],
  confidenceNotes: ["Some reporting details are assumptions."]
};

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
});

describe("DeliveryAnalysisSchema", () => {
  it("validates a complete delivery analysis response", () => {
    expect(DeliveryAnalysisSchema.parse(validResponse)).toEqual(validResponse);
  });

  it("rejects invalid enum values", () => {
    expect(() =>
      validateDeliveryAnalysisResponse({
        ...validResponse,
        functionalRequirements: [{ ...validResponse.functionalRequirements[0], priority: "Critical" }]
      })
    ).toThrow("required delivery artifact schema");
  });
});

describe("delivery AI prompt builder", () => {
  it("includes workflow context and raw input without markdown output instructions", () => {
    const prompt = buildDeliveryAnalysisPrompt({
      rawInput: "Stakeholder asks for refund approval routing.",
      workflowType: "requirement_intake",
      projectContext: "Checkout modernization",
      impactedSystemsHint: ["Refunds", "Reporting"]
    });

    expect(prompt).toContain("Workflow Type:\nrequirement_intake");
    expect(prompt).toContain("Checkout modernization");
    expect(prompt).toContain("Refunds, Reporting");
    expect(prompt).toContain("Return valid JSON only");
  });
});

describe("delivery AI response parsing", () => {
  it("parses fenced JSON responses", () => {
    expect(parseJsonResponse(`\`\`\`json\n${JSON.stringify(validResponse)}\n\`\`\``)).toEqual(validResponse);
  });

  it("throws a controlled error for invalid JSON", () => {
    expect(() => parseJsonResponse("{nope")).toThrow("could not be parsed");
  });
});

describe("provider selection", () => {
  it("uses an explicit provider before environment defaults", async () => {
    vi.resetModules();
    vi.stubEnv("AI_DEFAULT_PROVIDER", "openai");
    vi.stubEnv("OPENAI_API_KEY", "");
    vi.stubEnv("ANTHROPIC_API_KEY", "anthropic-key");
    vi.stubEnv("GOOGLE_GEMINI_API_KEY", "");

    const { getProviderConfig } = await import("./provider");
    expect(getProviderConfig({ provider: "anthropic" }).provider).toBe("anthropic");
  });

  it("falls back to OpenAI when configured and no default provider is set", async () => {
    vi.resetModules();
    vi.stubEnv("AI_DEFAULT_PROVIDER", "");
    vi.stubEnv("OPENAI_API_KEY", "openai-key");
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("GOOGLE_GEMINI_API_KEY", "");

    const { getProviderConfig } = await import("./provider");
    expect(getProviderConfig().provider).toBe("openai");
  });

  it("throws a clear configuration error when the selected provider key is missing", async () => {
    vi.resetModules();
    vi.stubEnv("AI_DEFAULT_PROVIDER", "gemini");
    vi.stubEnv("OPENAI_API_KEY", "openai-key");
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("GOOGLE_GEMINI_API_KEY", "");

    const { getProviderConfig } = await import("./provider");
    expect(() => getProviderConfig()).toThrow("AI provider is not configured");
  });
});
