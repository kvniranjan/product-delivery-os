import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireCurrentUser } from "./lib";

const providerValidator = v.union(v.literal("openai"), v.literal("anthropic"), v.literal("gemini"));

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    const settings = await ctx.db
      .query("aiProviderSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      defaultProvider: user.aiDefaultProvider,
      providers: settings.map((setting) => ({
        provider: setting.provider,
        keyPreview: setting.keyPreview,
        model: setting.model,
        validatedAt: setting.validatedAt,
        updatedAt: setting.updatedAt
      }))
    };
  }
});

export const remove = mutation({
  args: { provider: providerValidator },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const existing = await ctx.db
      .query("aiProviderSettings")
      .withIndex("by_user_provider", (q) => q.eq("userId", user._id).eq("provider", args.provider))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  }
});
