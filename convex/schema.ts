import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    role: v.optional(v.string()),
    organizationType: v.optional(v.string()),
    aiDefaultProvider: v.optional(v.string()),
    tokenIdentifier: v.string(),
    createdAt: v.number()
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),
  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    domain: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_user", ["userId"]),
  workflowRuns: defineTable({
    userId: v.id("users"),
    projectId: v.id("projects"),
    workflowId: v.string(),
    workflowTitle: v.string(),
    inputText: v.string(),
    optionalContext: v.optional(v.string()),
    generatedPrompt: v.string(),
    aiToolUsed: v.optional(v.string()),
    aiOutput: v.optional(v.string()),
    rawInput: v.optional(v.string()),
    aiOutputJson: v.optional(v.any()),
    finalOutputJson: v.optional(v.any()),
    aiProvider: v.optional(v.string()),
    aiModel: v.optional(v.string()),
    aiGenerated: v.optional(v.boolean()),
    reviewedByUser: v.optional(v.boolean()),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_workflow", ["workflowId"]),
  artifacts: defineTable({
    userId: v.id("users"),
    projectId: v.id("projects"),
    workflowRunId: v.id("workflowRuns"),
    artifactType: v.string(),
    title: v.string(),
    content: v.string(),
    rawInput: v.optional(v.string()),
    aiOutputJson: v.optional(v.any()),
    finalOutputJson: v.optional(v.any()),
    aiProvider: v.optional(v.string()),
    aiModel: v.optional(v.string()),
    aiGenerated: v.optional(v.boolean()),
    reviewedByUser: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"]),
  feedback: defineTable({
    userId: v.id("users"),
    projectId: v.id("projects"),
    workflowRunId: v.id("workflowRuns"),
    workflowId: v.string(),
    usefulnessScore: v.number(),
    easeOfUseScore: v.number(),
    outputQualityScore: v.number(),
    wouldUseAgain: v.boolean(),
    strongestPart: v.optional(v.string()),
    weakestPart: v.optional(v.string()),
    missingFeature: v.optional(v.string()),
    comments: v.optional(v.string()),
    createdAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_workflow", ["workflowId"]),
  events: defineTable({
    userId: v.optional(v.id("users")),
    eventType: v.string(),
    workflowId: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    metadata: v.optional(v.any()),
    createdAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_event_type", ["eventType"]),
  aiProviderSettings: defineTable({
    userId: v.id("users"),
    provider: v.string(),
    encryptedApiKey: v.string(),
    keyPreview: v.string(),
    model: v.optional(v.string()),
    validatedAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_user_provider", ["userId", "provider"])
});
