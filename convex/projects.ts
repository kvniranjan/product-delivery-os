import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireCurrentUser, requireOwnedProject } from "./lib";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  }
});

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const { project } = await requireOwnedProject(ctx, args.projectId);
    return project;
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    domain: v.optional(v.string()),
    description: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      userId: user._id,
      name: args.name.trim(),
      domain: args.domain?.trim(),
      description: args.description?.trim(),
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("events", {
      userId: user._id,
      eventType: "project_created",
      projectId,
      createdAt: now
    });

    return projectId;
  }
});
