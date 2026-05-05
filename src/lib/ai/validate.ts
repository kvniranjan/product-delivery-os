import { ZodError } from "zod";
import { DeliveryAIError } from "./types";
import { DeliveryAnalysisSchema } from "./schemas";
import type { AnalyzeDeliveryInputResponse } from "./types";

export function parseJsonResponse(raw: string): unknown {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new DeliveryAIError("INVALID_AI_RESPONSE", "AI response could not be parsed as JSON.");
  }
}

export function validateDeliveryAnalysisResponse(response: unknown): AnalyzeDeliveryInputResponse {
  try {
    return DeliveryAnalysisSchema.parse(response);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new DeliveryAIError("INVALID_AI_RESPONSE", "AI response did not match the required delivery artifact schema.");
    }
    throw error;
  }
}
