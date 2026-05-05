import { AnthropicDeliveryAIClient } from "./clients/anthropic";
import { GeminiDeliveryAIClient } from "./clients/gemini";
import { OpenAIDeliveryAIClient } from "./clients/openai";
import { AIProviderSchema } from "./schemas";
import { DeliveryAIError } from "./types";
import type { AIAnalyzeOptions, AIProvider, DeliveryAIClient } from "./types";

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: process.env.OPENAI_MODEL || "gpt-4o-mini",
  anthropic: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
  gemini: process.env.GEMINI_MODEL || "gemini-1.5-pro"
};

const PROVIDER_KEYS: Record<AIProvider, string | undefined> = {
  openai: process.env.OPENAI_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
  gemini: process.env.GOOGLE_GEMINI_API_KEY
};

export function resolveAIProvider(explicitProvider?: AIProvider): AIProvider {
  if (explicitProvider) return explicitProvider;

  if (process.env.AI_DEFAULT_PROVIDER) {
    const parsed = AIProviderSchema.safeParse(process.env.AI_DEFAULT_PROVIDER);
    if (!parsed.success) {
      throw new DeliveryAIError("PROVIDER_NOT_CONFIGURED", "Configured default AI provider is not supported.");
    }
    return parsed.data;
  }

  if (PROVIDER_KEYS.openai) return "openai";

  throw new DeliveryAIError("PROVIDER_NOT_CONFIGURED", "AI provider is not configured. Please set the required API key.");
}

export function getProviderConfig(options?: AIAnalyzeOptions) {
  const provider = resolveAIProvider(options?.provider);
  const apiKey = options?.apiKey || PROVIDER_KEYS[provider];

  if (!apiKey) {
    throw new DeliveryAIError("PROVIDER_NOT_CONFIGURED", "AI provider is not configured. Please set the required API key.");
  }

  return {
    provider,
    apiKey,
    model: options?.model || DEFAULT_MODELS[provider],
    temperature: options?.temperature ?? 0.2
  };
}

export function createDeliveryAIClient(options?: AIAnalyzeOptions): {
  provider: AIProvider;
  model: string;
  client: DeliveryAIClient;
} {
  const config = getProviderConfig(options);

  if (config.provider === "openai") {
    return { provider: config.provider, model: config.model, client: new OpenAIDeliveryAIClient(config.apiKey, config.model, config.temperature) };
  }

  if (config.provider === "anthropic") {
    return {
      provider: config.provider,
      model: config.model,
      client: new AnthropicDeliveryAIClient(config.apiKey, config.model, config.temperature)
    };
  }

  return { provider: config.provider, model: config.model, client: new GeminiDeliveryAIClient(config.apiKey, config.model, config.temperature) };
}
