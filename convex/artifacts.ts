import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwnedProject, requireOwnedWorkflowRun } from "./lib";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const { user } = await requireOwnedProject(ctx, args.projectId);
    return await ctx.db
      .query("artifacts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .order("desc")
      .collect();
  }
});

export const create = mutation({
  args: {
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
    reviewedByUser: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const { user, run } = await requireOwnedWorkflowRun(ctx, args.workflowRunId);
    const now = Date.now();
    return await ctx.db.insert("artifacts", {
      userId: user._id,
      projectId: run.projectId,
      workflowRunId: run._id,
      artifactType: args.artifactType,
      title: args.title.trim(),
      content: args.content,
      rawInput: args.rawInput,
      aiOutputJson: args.aiOutputJson,
      finalOutputJson: args.finalOutputJson,
      aiProvider: args.aiProvider,
      aiModel: args.aiModel,
      aiGenerated: args.aiGenerated,
      reviewedByUser: args.reviewedByUser,
      createdAt: now,
      updatedAt: now
    });
  }
});
