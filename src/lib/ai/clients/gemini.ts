import { GoogleGenAI } from "@google/genai";
import { buildDeliveryAnalysisPrompt, DELIVERY_AI_SYSTEM_PROMPT } from "../prompts";
import { DeliveryAIError } from "../types";
import { parseJsonResponse, validateDeliveryAnalysisResponse } from "../validate";
import type { AIAnalyzeOptions, AnalyzeDeliveryInputRequest, AnalyzeDeliveryInputResponse, DeliveryAIClient } from "../types";

export class GeminiDeliveryAIClient implements DeliveryAIClient {
  private client: GoogleGenAI;

  constructor(
    apiKey: string,
    private model: string,
    private temperature: number
  ) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async analyzeDeliveryInput(
    request: AnalyzeDeliveryInputRequest,
    options?: AIAnalyzeOptions
  ): Promise<AnalyzeDeliveryInputResponse> {
    try {
      const response = await this.client.models.generateContent({
        model: options?.model || this.model,
        contents: `${DELIVERY_AI_SYSTEM_PROMPT}\n\n${buildDeliveryAnalysisPrompt(request)}`,
        config: {
          temperature: options?.temperature ?? this.temperature,
          responseMimeType: "application/json"
        }
      });

      const content = response.text?.trim();
      if (!content) {
        throw new DeliveryAIError("INVALID_AI_RESPONSE", "AI provider returned an empty response.");
      }

      return validateDeliveryAnalysisResponse(parseJsonResponse(content));
    } catch (error) {
      if (error instanceof DeliveryAIError) throw error;
      throw new DeliveryAIError("PROVIDER_API_ERROR", geminiErrorMessage(error));
    }
  }
}

function geminiErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("API key")) return "Gemini rejected the API key. Validate and save a working Gemini key.";
  if (message.includes("not found")) return "Gemini model was not found or is not available to this key.";
  if (message.includes("quota") || message.includes("429")) return "Gemini rate limit or quota was exceeded.";

  return "Gemini request failed. Check the saved key, model, project permissions, and quota.";
}
