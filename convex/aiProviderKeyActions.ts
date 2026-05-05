"use node";

import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { AIProvider } from "../src/lib/ai";

const providerValidator = v.union(v.literal("openai"), v.literal("anthropic"), v.literal("gemini"));

export const validateProviderKey = action({
  args: {
    provider: providerValidator,
    apiKey: v.string(),
    model: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return failure("Authentication required.");
    const validationError = await validateKey(args.provider, args.apiKey.trim(), resolveModel(args.provider, args.model));
    if (validationError) {
      return failure(validationError);
    }
    return {
      ok: true,
      keyPreview: previewKey(args.apiKey)
    };
  }
});

export const saveProviderKey = action({
  args: {
    provider: providerValidator,
    apiKey: v.string(),
    model: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return failure("Authentication required.");

    try {
      const apiKey = args.apiKey.trim();
      const selectedModel = resolveModel(args.provider, args.model);
      const validationError = await validateKey(args.provider, apiKey, selectedModel);
      if (validationError) {
        return failure(validationError);
      }
      const encryptedApiKey = await encrypt(apiKey);

      await ctx.runMutation(internal.aiProviderSettingsInternal.saveEncryptedProviderKey, {
        tokenIdentifier: identity.tokenIdentifier,
        provider: args.provider,
        encryptedApiKey,
        keyPreview: previewKey(apiKey),
        model: selectedModel
      });

      return {
        ok: true,
        keyPreview: previewKey(apiKey)
      };
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Could not save API key.");
    }
  }
});

async function validateKey(provider: AIProvider, apiKey: string, model: string) {
  if (!apiKey) {
    return "API key is required.";
  }

  try {
    if (provider === "openai") {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey, timeout: 30000 });
      await client.responses.create({
        model,
        max_output_tokens: 16,
        instructions: "Return valid JSON only.",
        input: "Return {\"ok\":true}.",
        text: {
          format: { type: "json_object" }
        }
      });
      return null;
    }

    if (provider === "anthropic") {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey, timeout: 30000 });
      await client.messages.countTokens({
        model,
        messages: [{ role: "user", content: "Validate API key and model." }]
      });
      return null;
    }

    const { GoogleGenAI } = await import("@google/genai");
    const client = new GoogleGenAI({ apiKey });
    await client.models.generateContent({
      model,
      contents: "Return ok.",
      config: { maxOutputTokens: 4 }
    });
    return null;
  } catch (error) {
    return validationMessage(provider, error);
  }
}

function validationMessage(provider: AIProvider, error: unknown) {
  const status = typeof error === "object" && error && "status" in error ? Number(error.status) : undefined;
  const message = error instanceof Error ? error.message : "";
  if (status === 401 || message.toLowerCase().includes("api key")) {
    return `${providerLabel(provider)} rejected the API key. Check that it was copied correctly.`;
  }
  if (status === 403) {
    return `${providerLabel(provider)} denied access for this key, project, or model. Try a different model or check project permissions.`;
  }
  if (status === 404 || message.toLowerCase().includes("not found")) {
    return `${providerLabel(provider)} could not find or access the selected model. Try a model your key can use.`;
  }
  if (status === 429 || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate limit")) {
    return `${providerLabel(provider)} quota or rate limit was hit. Check billing, usage limits, or try again later.`;
  }

  return `${providerLabel(provider)} validation failed. Check the key, selected model, permissions, and quota.`;
}

function providerLabel(provider: AIProvider) {
  if (provider === "openai") return "OpenAI";
  if (provider === "anthropic") return "Anthropic";
  return "Gemini";
}

function resolveModel(provider: AIProvider, model: string | undefined) {
  const trimmed = model?.trim();
  if (trimmed) return trimmed;
  if (provider === "openai") return process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (provider === "anthropic") return process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
  return process.env.GEMINI_MODEL || "gemini-1.5-pro";
}

function previewKey(apiKey: string) {
  const trimmed = apiKey.trim();
  return `•••• ${trimmed.slice(-4)}`;
}

async function encrypt(value: string) {
  const crypto = await import("node:crypto");
  const secret = process.env.AI_KEY_ENCRYPTION_SECRET;
  if (!secret || secret.length < 32) {
    throw new ConvexError("AI key encryption is not configured. Set AI_KEY_ENCRYPTION_SECRET to at least 32 characters.");
  }

  const key = crypto.createHash("sha256").update(secret).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(":");
}

function failure(message: string) {
  return {
    ok: false,
    error: { message }
  };
}
