import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireCurrentUser } from "./lib";

export const upsertCurrentUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    role: v.optional(v.string()),
    organizationType: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Authentication required.");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name ?? identity.name ?? existing.name,
        email: args.email,
        role: args.role ?? existing.role,
        organizationType: args.organizationType ?? existing.organizationType
      });
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      name: args.name ?? identity.name,
      email: args.email,
      role: args.role,
      organizationType: args.organizationType,
      tokenIdentifier: identity.tokenIdentifier,
      createdAt: Date.now()
    });

    await ctx.db.insert("events", {
      userId,
      eventType: "user_signed_up",
      createdAt: Date.now()
    });

    return userId;
  }
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await requireCurrentUser(ctx);
  }
});

export const setAiDefaultProvider = mutation({
  args: {
    provider: v.optional(v.union(v.literal("openai"), v.literal("anthropic"), v.literal("gemini")))
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    await ctx.db.patch(user._id, {
      aiDefaultProvider: args.provider
    });
  }
});
