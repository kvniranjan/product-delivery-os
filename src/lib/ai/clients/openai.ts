import OpenAI from "openai";
import { buildDeliveryAnalysisPrompt, DELIVERY_AI_SYSTEM_PROMPT } from "../prompts";
import { DeliveryAIError } from "../types";
import { parseJsonResponse, validateDeliveryAnalysisResponse } from "../validate";
import type { AIAnalyzeOptions, AnalyzeDeliveryInputRequest, AnalyzeDeliveryInputResponse, DeliveryAIClient } from "../types";

export class OpenAIDeliveryAIClient implements DeliveryAIClient {
  private client: OpenAI;

  constructor(
    apiKey: string,
    private model: string,
    private temperature: number
  ) {
    this.client = new OpenAI({ apiKey, timeout: 60000 });
  }

  async analyzeDeliveryInput(
    request: AnalyzeDeliveryInputRequest,
    options?: AIAnalyzeOptions
  ): Promise<AnalyzeDeliveryInputResponse> {
    try {
      const response = await this.client.responses.create({
        model: options?.model || this.model,
        temperature: options?.temperature ?? this.temperature,
        max_output_tokens: 6000,
        instructions: DELIVERY_AI_SYSTEM_PROMPT,
        input: buildDeliveryAnalysisPrompt(request),
        text: {
          format: { type: "json_object" }
        }
      });

      const content = response.output_text;
      if (!content) {
        throw new DeliveryAIError("INVALID_AI_RESPONSE", "AI provider returned an empty response.");
      }

      return validateDeliveryAnalysisResponse(parseJsonResponse(content));
    } catch (error) {
      if (error instanceof DeliveryAIError) throw error;
      throw new DeliveryAIError("PROVIDER_API_ERROR", openAIErrorMessage(error));
    }
  }
}

function openAIErrorMessage(error: unknown) {
      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) return "OpenAI rejected the API key. Validate and save a working OpenAI key.";
        if (error.status === 403) return "OpenAI denied access for this key, project, or model. Check the saved model and project permissions.";
        if (error.status === 404) return "OpenAI model was not found or is not available to this key. Try gpt-4.1-mini or gpt-4o-mini.";
        if (error.status === 429) return "OpenAI rate limit or quota was exceeded.";
      }

  return "OpenAI request failed. Check the saved key, model, project permissions, and quota.";
}
