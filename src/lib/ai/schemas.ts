import { z } from "zod";

export const AIProviderSchema = z.enum(["openai", "anthropic", "gemini"]);

export const AnalyzeDeliveryInputRequestSchema = z.object({
  rawInput: z.string().trim().min(1).max(20000),
  workflowType: z
    .enum([
      "requirement_intake",
      "impact_analysis",
      "story_generation",
      "acceptance_criteria",
      "uat_analysis",
      "defect_analysis",
      "release_update",
      "stakeholder_update"
    ])
    .optional(),
  projectContext: z.string().trim().max(10000).optional(),
  userRole: z
    .enum([
      "Business Analyst",
      "Product Manager",
      "Product Owner",
      "QA Lead",
      "Delivery Manager",
      "Engineering Lead",
      "Stakeholder"
    ])
    .optional(),
  artifactType: z.string().trim().max(200).optional(),
  impactedSystemsHint: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
  existingArtifactContext: z.string().trim().max(10000).optional(),
  provider: AIProviderSchema.optional()
});

const PrioritySchema = z.enum(["High", "Medium", "Low"]);

export const DeliveryAnalysisSchema = z.object({
  summary: z.string(),
  problemStatement: z.string(),
  businessObjective: z.string(),
  confirmedFacts: z.array(z.string()),
  assumptions: z.array(z.string()),
  openQuestions: z.array(z.string()),
  functionalRequirements: z.array(
    z.object({
      id: z.string(),
      requirement: z.string(),
      priority: PrioritySchema,
      rationale: z.string()
    })
  ),
  nonFunctionalRequirements: z.array(
    z.object({
      requirement: z.string(),
      category: z.string(),
      priority: PrioritySchema
    })
  ),
  impactedSystems: z.array(
    z.object({
      system: z.string(),
      impact: z.string(),
      confidence: z.enum(["Confirmed", "Assumed"])
    })
  ),
  dependencies: z.array(
    z.object({
      dependency: z.string(),
      owner: z.string(),
      status: z.enum(["Open", "In Progress", "Resolved", "Unknown"])
    })
  ),
  risks: z.array(
    z.object({
      risk: z.string(),
      impact: PrioritySchema,
      mitigation: z.string()
    })
  ),
  acceptanceCriteria: z.array(
    z.object({
      scenario: z.string(),
      given: z.string(),
      when: z.string(),
      then: z.string()
    })
  ),
  testScenarios: z.array(z.string()),
  jiraStories: z.array(
    z.object({
      title: z.string(),
      userStory: z.string(),
      acceptanceCriteria: z.array(z.string()),
      priority: PrioritySchema
    })
  ),
  stakeholderUpdate: z.object({
    executiveSummary: z.string(),
    deliveryStatus: z.enum(["Green", "Amber", "Red", "Unknown"]),
    keyUpdates: z.array(z.string()),
    decisionsNeeded: z.array(z.string()),
    escalations: z.array(z.string())
  }),
  nextBestActions: z.array(z.string()),
  confidenceNotes: z.array(z.string())
});

export type DeliveryAnalysis = z.infer<typeof DeliveryAnalysisSchema>;
