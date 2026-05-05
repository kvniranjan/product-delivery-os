import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireCurrentUser, requireOwnedWorkflowRun } from "./lib";

export const submit = mutation({
  args: {
    workflowRunId: v.id("workflowRuns"),
    usefulnessScore: v.number(),
    easeOfUseScore: v.number(),
    outputQualityScore: v.number(),
    wouldUseAgain: v.boolean(),
    strongestPart: v.optional(v.string()),
    weakestPart: v.optional(v.string()),
    missingFeature: v.optional(v.string()),
    comments: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { user, run } = await requireOwnedWorkflowRun(ctx, args.workflowRunId);
    const now = Date.now();
    const feedbackId = await ctx.db.insert("feedback", {
      userId: user._id,
      projectId: run.projectId,
      workflowRunId: run._id,
      workflowId: run.workflowId,
      usefulnessScore: args.usefulnessScore,
      easeOfUseScore: args.easeOfUseScore,
      outputQualityScore: args.outputQualityScore,
      wouldUseAgain: args.wouldUseAgain,
      strongestPart: args.strongestPart,
      weakestPart: args.weakestPart,
      missingFeature: args.missingFeature,
      comments: args.comments,
      createdAt: now
    });

    await ctx.db.insert("events", {
      userId: user._id,
      eventType: "feedback_submitted",
      workflowId: run.workflowId,
      projectId: run.projectId,
      createdAt: now
    });

    return feedbackId;
  }
});

export const adminSummary = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (!adminEmails.includes(user.email.toLowerCase())) {
      return null;
    }

    const [users, projects, runs, feedback] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("projects").collect(),
      ctx.db.query("workflowRuns").collect(),
      ctx.db.query("feedback").collect()
    ]);

    const avg = (field: "usefulnessScore" | "easeOfUseScore" | "outputQualityScore") =>
      feedback.length ? feedback.reduce((sum, row) => sum + row[field], 0) / feedback.length : 0;

    const workflowUsage = runs.reduce<Record<string, number>>((acc, run) => {
      acc[run.workflowTitle] = (acc[run.workflowTitle] ?? 0) + 1;
      return acc;
    }, {});

    return {
      totalUsers: users.length,
      totalProjects: projects.length,
      totalWorkflowRuns: runs.length,
      workflowUsage,
      averageUsefulnessScore: avg("usefulnessScore"),
      averageEaseOfUseScore: avg("easeOfUseScore"),
      averageOutputQualityScore: avg("outputQualityScore"),
      recentFeedback: feedback
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10)
        .map((item) => ({
          workflowId: item.workflowId,
          comments: item.comments,
          weakestPart: item.weakestPart,
          missingFeature: item.missingFeature,
          createdAt: item.createdAt
        }))
    };
  }
});
