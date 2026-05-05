import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireCurrentUser, requireOwnedProject, requireOwnedWorkflowRun } from "./lib";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const { user } = await requireOwnedProject(ctx, args.projectId);
    return await ctx.db
      .query("workflowRuns")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .order("desc")
      .collect();
  }
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    workflowId: v.string(),
    workflowTitle: v.string(),
    inputText: v.string(),
    optionalContext: v.optional(v.string()),
    generatedPrompt: v.string()
  },
  handler: async (ctx, args) => {
    const { user } = await requireOwnedProject(ctx, args.projectId);
    const now = Date.now();
    return await ctx.db.insert("workflowRuns", {
      userId: user._id,
      projectId: args.projectId,
      workflowId: args.workflowId,
      workflowTitle: args.workflowTitle,
      inputText: args.inputText,
      optionalContext: args.optionalContext,
      generatedPrompt: args.generatedPrompt,
      status: "prompt_generated",
      createdAt: now,
      updatedAt: now
    });
  }
});

export const saveOutput = mutation({
  args: {
    workflowRunId: v.id("workflowRuns"),
    aiToolUsed: v.string(),
    aiOutput: v.string(),
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
    await ctx.db.patch(run._id, {
      aiToolUsed: args.aiToolUsed,
      aiOutput: args.aiOutput,
      rawInput: run.inputText,
      aiOutputJson: args.aiOutputJson,
      finalOutputJson: args.finalOutputJson,
      aiProvider: args.aiProvider,
      aiModel: args.aiModel,
      aiGenerated: args.aiGenerated,
      reviewedByUser: args.reviewedByUser,
      status: "output_saved",
      updatedAt: now
    });

    await ctx.db.insert("events", {
      userId: user._id,
      eventType: "output_saved",
      workflowId: run.workflowId,
      projectId: run.projectId,
      createdAt: now
    });
  }
});

export const markReviewed = mutation({
  args: {
    workflowRunId: v.id("workflowRuns"),
    finalOutputJson: v.any()
  },
  handler: async (ctx, args) => {
    const { run } = await requireOwnedWorkflowRun(ctx, args.workflowRunId);
    await ctx.db.patch(run._id, {
      finalOutputJson: args.finalOutputJson,
      reviewedByUser: true,
      status: "reviewed",
      updatedAt: Date.now()
    });
  }
});

export const usageSummary = query({
  args: {},
  handler: async (ctx) => {
    await requireCurrentUser(ctx);
    const runs = await ctx.db.query("workflowRuns").collect();
    return runs.reduce<Record<string, number>>((acc, run) => {
      acc[run.workflowTitle] = (acc[run.workflowTitle] ?? 0) + 1;
      return acc;
    }, {});
  }
});
