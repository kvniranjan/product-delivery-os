import { createDeliveryAIClient } from "./provider";
import type { AIAnalyzeOptions, AIProviderResult, AnalyzeDeliveryInputRequest } from "./types";

export async function analyzeDeliveryInput(
  request: AnalyzeDeliveryInputRequest,
  options?: AIAnalyzeOptions
): Promise<AIProviderResult> {
  const { provider, model, client } = createDeliveryAIClient(options);
  const data = await client.analyzeDeliveryInput(request, { ...options, provider, model });

  return {
    provider,
    model,
    data
  };
}

export type {
  AIAnalyzeOptions,
  AIProvider,
  AIProviderResult,
  AnalyzeDeliveryInputRequest,
  AnalyzeDeliveryInputResponse,
  DeliveryAIClient,
  WorkflowType
} from "./types";
