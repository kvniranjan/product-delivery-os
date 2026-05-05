export type AIProvider = "openai" | "anthropic" | "gemini";

export type WorkflowType =
  | "requirement_intake"
  | "impact_analysis"
  | "story_generation"
  | "acceptance_criteria"
  | "uat_analysis"
  | "defect_analysis"
  | "release_update"
  | "stakeholder_update";

export type DeliveryUserRole =
  | "Business Analyst"
  | "Product Manager"
  | "Product Owner"
  | "QA Lead"
  | "Delivery Manager"
  | "Engineering Lead"
  | "Stakeholder";

export type AIAnalyzeOptions = {
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  apiKey?: string;
};

export type AnalyzeDeliveryInputRequest = {
  rawInput: string;
  workflowType?: WorkflowType;
  projectContext?: string;
  userRole?: DeliveryUserRole;
  artifactType?: string;
  impactedSystemsHint?: string[];
  existingArtifactContext?: string;
  provider?: AIProvider;
};

export type Priority = "High" | "Medium" | "Low";

export type AnalyzeDeliveryInputResponse = {
  summary: string;
  problemStatement: string;
  businessObjective: string;
  confirmedFacts: string[];
  assumptions: string[];
  openQuestions: string[];
  functionalRequirements: {
    id: string;
    requirement: string;
    priority: Priority;
    rationale: string;
  }[];
  nonFunctionalRequirements: {
    requirement: string;
    category: string;
    priority: Priority;
  }[];
  impactedSystems: {
    system: string;
    impact: string;
    confidence: "Confirmed" | "Assumed";
  }[];
  dependencies: {
    dependency: string;
    owner: string;
    status: "Open" | "In Progress" | "Resolved" | "Unknown";
  }[];
  risks: {
    risk: string;
    impact: Priority;
    mitigation: string;
  }[];
  acceptanceCriteria: {
    scenario: string;
    given: string;
    when: string;
    then: string;
  }[];
  testScenarios: string[];
  jiraStories: {
    title: string;
    userStory: string;
    acceptanceCriteria: string[];
    priority: Priority;
  }[];
  stakeholderUpdate: {
    executiveSummary: string;
    deliveryStatus: "Green" | "Amber" | "Red" | "Unknown";
    keyUpdates: string[];
    decisionsNeeded: string[];
    escalations: string[];
  };
  nextBestActions: string[];
  confidenceNotes: string[];
};

export interface DeliveryAIClient {
  analyzeDeliveryInput(
    request: AnalyzeDeliveryInputRequest,
    options?: AIAnalyzeOptions
  ): Promise<AnalyzeDeliveryInputResponse>;
}

export type AIProviderResult = {
  provider: AIProvider;
  model: string;
  data: AnalyzeDeliveryInputResponse;
};

export type AIErrorCode =
  | "MISSING_RAW_INPUT"
  | "INVALID_REQUEST"
  | "PROVIDER_NOT_CONFIGURED"
  | "PROVIDER_API_ERROR"
  | "INVALID_AI_RESPONSE"
  | "AI_TIMEOUT"
  | "UNKNOWN_AI_ERROR";

export class DeliveryAIError extends Error {
  code: AIErrorCode;

  constructor(code: AIErrorCode, message: string) {
    super(message);
    this.name = "DeliveryAIError";
    this.code = code;
  }
}
