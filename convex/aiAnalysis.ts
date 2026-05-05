"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { analyzeDeliveryInput } from "../src/lib/ai";
import { DeliveryAIError } from "../src/lib/ai/types";
import type { AIProvider, AnalyzeDeliveryInputRequest, AnalyzeDeliveryInputResponse } from "../src/lib/ai";
import type { Doc } from "./_generated/dataModel";

const providerValidator = v.union(v.literal("openai"), v.literal("anthropic"), v.literal("gemini"));

const defaultModels: Record<AIProvider, string> = {
  openai: process.env.OPENAI_MODEL || "gpt-4o-mini",
  anthropic: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
  gemini: process.env.GEMINI_MODEL || "gemini-1.5-pro"
};

type AnalyzeActionResult =
  | {
      ok: true;
      provider: AIProvider;
      model: string;
      data: AnalyzeDeliveryInputResponse;
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };

export const analyzeDeliveryInputForCurrentUser = action({
  args: {
    rawInput: v.string(),
    workflowType: v.optional(
      v.union(
        v.literal("requirement_intake"),
        v.literal("impact_analysis"),
        v.literal("story_generation"),
        v.literal("acceptance_criteria"),
        v.literal("uat_analysis"),
        v.literal("defect_analysis"),
        v.literal("release_update"),
        v.literal("stakeholder_update")
      )
    ),
    projectContext: v.optional(v.string()),
    userRole: v.optional(
      v.union(
        v.literal("Business Analyst"),
        v.literal("Product Manager"),
        v.literal("Product Owner"),
        v.literal("QA Lead"),
        v.literal("Delivery Manager"),
        v.literal("Engineering Lead"),
        v.literal("Stakeholder")
      )
    ),
    artifactType: v.optional(v.string()),
    impactedSystemsHint: v.optional(v.array(v.string())),
    existingArtifactContext: v.optional(v.string()),
    provider: v.optional(providerValidator)
  },
  handler: async (ctx, args): Promise<AnalyzeActionResult> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return failure("INVALID_REQUEST", "Authentication required.");
    if (!args.rawInput.trim()) {
      return failure("MISSING_RAW_INPUT", "Raw delivery input is required.");
    }

    const account = (await ctx.runQuery(internal.aiProviderSettingsInternal.getCurrentUserSettings, {
      tokenIdentifier: identity.tokenIdentifier
    })) as { user: Doc<"users">; settings: Array<Doc<"aiProviderSettings">> } | null;

    if (!account) {
      return failure("INVALID_REQUEST", "User profile not found. Refresh the page and try again.");
    }

    try {
      const provider = resolveProvider(args.provider, account.user.aiDefaultProvider, account.settings);
      const setting = account.settings.find((item: Doc<"aiProviderSettings">) => item.provider === provider);
      const envApiKey = getEnvApiKey(provider);
      const apiKey: string | undefined = setting ? await decrypt(setting.encryptedApiKey) : envApiKey;

      if (!apiKey) {
        return failure("PROVIDER_NOT_CONFIGURED", "AI provider is not configured. Please set the required API key.");
      }

      const result = await analyzeDeliveryInput(args as AnalyzeDeliveryInputRequest, {
        provider,
        apiKey,
        model: resolveModel(provider, setting?.model)
      });

      return {
        ok: true,
        ...result
      };
    } catch (error) {
      if (error instanceof DeliveryAIError) {
        return failure(error.code, error.message);
      }
      if (error instanceof Error) {
        return failure("UNKNOWN_AI_ERROR", error.message);
      }
      return failure("UNKNOWN_AI_ERROR", "AI analysis failed unexpectedly.");
    }
  }
});

function resolveModel(provider: AIProvider, savedModel: string | undefined) {
  const trimmed = savedModel?.trim();
  if (provider === "openai" && (trimmed === "gpt-5.4-mini" || trimmed === "gpt-4.1-mini")) {
    return defaultModels.openai;
  }
  return trimmed || defaultModels[provider];
}

function resolveProvider(
  explicitProvider: AIProvider | undefined,
  userDefaultProvider: string | undefined,
  settings: Array<{ provider: string }>
): AIProvider {
  if (explicitProvider) return explicitProvider;
  if (isProvider(userDefaultProvider)) return userDefaultProvider;

  if (isProvider(process.env.AI_DEFAULT_PROVIDER)) return process.env.AI_DEFAULT_PROVIDER;
  if (settings.some((setting) => setting.provider === "openai") || process.env.OPENAI_API_KEY) return "openai";

  throw new DeliveryAIError("PROVIDER_NOT_CONFIGURED", "AI provider is not configured. Please set the required API key.");
}

function isProvider(value: string | undefined): value is AIProvider {
  return value === "openai" || value === "anthropic" || value === "gemini";
}

function getEnvApiKey(provider: AIProvider) {
  if (provider === "openai") return process.env.OPENAI_API_KEY;
  if (provider === "anthropic") return process.env.ANTHROPIC_API_KEY;
  return process.env.GOOGLE_GEMINI_API_KEY;
}

async function decrypt(value: string) {
  const crypto = await import("node:crypto");
  const secret = process.env.AI_KEY_ENCRYPTION_SECRET;
  if (!secret || secret.length < 32) {
    throw new DeliveryAIError("PROVIDER_NOT_CONFIGURED", "AI key encryption is not configured. Set AI_KEY_ENCRYPTION_SECRET to at least 32 characters.");
  }

  const [ivBase64, tagBase64, encryptedBase64] = value.split(":");
  if (!ivBase64 || !tagBase64 || !encryptedBase64) {
    throw new DeliveryAIError("PROVIDER_NOT_CONFIGURED", "Stored AI key is invalid. Re-enter and save the provider key.");
  }

  const key = crypto.createHash("sha256").update(secret).digest();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivBase64, "base64"));
  decipher.setAuthTag(Buffer.from(tagBase64, "base64"));

  return Buffer.concat([decipher.update(Buffer.from(encryptedBase64, "base64")), decipher.final()]).toString("utf8");
}

function failure(code: string, message: string): AnalyzeActionResult {
  return {
    ok: false,
    error: {
      code,
      message
    }
  };
}
