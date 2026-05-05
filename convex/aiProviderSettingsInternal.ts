import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getCurrentUserSettings = internalQuery({
  args: {
    tokenIdentifier: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) return null;

    const settings = await ctx.db
      .query("aiProviderSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      user,
      settings
    };
  }
});

export const saveEncryptedProviderKey = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    provider: v.union(v.literal("openai"), v.literal("anthropic"), v.literal("gemini")),
    encryptedApiKey: v.string(),
    keyPreview: v.string(),
    model: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User profile not found. Refresh the page and try again.");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("aiProviderSettings")
      .withIndex("by_user_provider", (q) => q.eq("userId", user._id).eq("provider", args.provider))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        encryptedApiKey: args.encryptedApiKey,
        keyPreview: args.keyPreview,
        model: args.model,
        validatedAt: now,
        updatedAt: now
      });
      return existing._id;
    }

    return await ctx.db.insert("aiProviderSettings", {
      userId: user._id,
      provider: args.provider,
      encryptedApiKey: args.encryptedApiKey,
      keyPreview: args.keyPreview,
      model: args.model,
      validatedAt: now,
      createdAt: now,
      updatedAt: now
    });
  }
});
