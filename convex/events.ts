import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireCurrentUser } from "./lib";

const allowedEvents = new Set([
  "user_signed_up",
  "project_created",
  "workflow_selected",
  "prompt_generated",
  "prompt_copied",
  "output_saved",
  "feedback_submitted",
  "artifact_exported"
]);

export const track = mutation({
  args: {
    eventType: v.string(),
    workflowId: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    metadata: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    if (!allowedEvents.has(args.eventType)) return null;

    if (args.projectId) {
      const project = await ctx.db.get(args.projectId);
      if (!project || project.userId !== user._id) return null;
    }

    return await ctx.db.insert("events", {
      userId: user._id,
      eventType: args.eventType,
      workflowId: args.workflowId,
      projectId: args.projectId,
      metadata: args.metadata,
      createdAt: Date.now()
    });
  }
});
