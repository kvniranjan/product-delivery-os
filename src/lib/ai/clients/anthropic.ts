import Anthropic from "@anthropic-ai/sdk";
import { buildDeliveryAnalysisPrompt, DELIVERY_AI_SYSTEM_PROMPT } from "../prompts";
import { DeliveryAIError } from "../types";
import { parseJsonResponse, validateDeliveryAnalysisResponse } from "../validate";
import type { AIAnalyzeOptions, AnalyzeDeliveryInputRequest, AnalyzeDeliveryInputResponse, DeliveryAIClient } from "../types";

export class AnthropicDeliveryAIClient implements DeliveryAIClient {
  private client: Anthropic;

  constructor(
    apiKey: string,
    private model: string,
    private temperature: number
  ) {
    this.client = new Anthropic({ apiKey, timeout: 60000 });
  }

  async analyzeDeliveryInput(
    request: AnalyzeDeliveryInputRequest,
    options?: AIAnalyzeOptions
  ): Promise<AnalyzeDeliveryInputResponse> {
    try {
      const response = await this.client.messages.create({
        model: options?.model || this.model,
        max_tokens: 6000,
        temperature: options?.temperature ?? this.temperature,
        system: DELIVERY_AI_SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildDeliveryAnalysisPrompt(request) }]
      });

      const content = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("\n")
        .trim();

      if (!content) {
        throw new DeliveryAIError("INVALID_AI_RESPONSE", "AI provider returned an empty response.");
      }

      return validateDeliveryAnalysisResponse(parseJsonResponse(content));
    } catch (error) {
      if (error instanceof DeliveryAIError) throw error;
      throw new DeliveryAIError("PROVIDER_API_ERROR", anthropicErrorMessage(error));
    }
  }
}

function anthropicErrorMessage(error: unknown) {
  if (error instanceof Anthropic.APIError) {
    if (error.status === 401) return "Anthropic rejected the API key. Validate and save a working Anthropic key.";
    if (error.status === 403) return "Anthropic denied access for this key or workspace.";
    if (error.status === 404) return "Anthropic model was not found or is not available to this key.";
    if (error.status === 429) return "Anthropic rate limit or quota was exceeded.";
  }

  return "Anthropic request failed. Check the saved key, model, workspace permissions, and quota.";
}
