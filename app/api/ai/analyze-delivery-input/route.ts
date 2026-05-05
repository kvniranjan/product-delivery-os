import { NextResponse } from "next/server";
import { analyzeDeliveryInput } from "@/lib/ai";
import { AnalyzeDeliveryInputRequestSchema } from "@/lib/ai/schemas";
import { DeliveryAIError } from "@/lib/ai/types";
import type { AIErrorCode } from "@/lib/ai/types";

export const runtime = "nodejs";

function failure(code: AIErrorCode, message: string, status = 400) {
  return NextResponse.json(
    {
      ok: false,
      error: { code, message }
    },
    { status }
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return failure("INVALID_REQUEST", "Request body must be valid JSON.");
  }

  const parsed = AnalyzeDeliveryInputRequestSchema.safeParse(body);
  if (!parsed.success) {
    const rawInputIssue = parsed.error.issues.find((issue) => issue.path.join(".") === "rawInput");
    if (rawInputIssue) {
      return failure("MISSING_RAW_INPUT", "Raw delivery input is required.");
    }
    return failure("INVALID_REQUEST", "Request body is not valid.");
  }

  try {
    const result = await analyzeDeliveryInput(parsed.data, {
      provider: parsed.data.provider
    });

    return NextResponse.json({
      ok: true,
      provider: result.provider,
      model: result.model,
      data: result.data
    });
  } catch (error) {
    if (error instanceof DeliveryAIError) {
      const status = error.code === "PROVIDER_NOT_CONFIGURED" ? 503 : error.code === "INVALID_AI_RESPONSE" ? 502 : 500;
      console.error("[delivery-ai]", error.code, error.message);
      return failure(error.code, error.message, status);
    }

    console.error("[delivery-ai] UNKNOWN_AI_ERROR", error);
    return failure("UNKNOWN_AI_ERROR", "AI analysis failed unexpectedly.", 500);
  }
}
