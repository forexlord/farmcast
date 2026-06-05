import {
  parseErrorFromResponse,
  type ApiErrorBody,
} from "@/lib/api-errors";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export type { ApiErrorBody };

export function errorResponse(
  status: number,
  message: string,
  resetAt?: string,
) {
  const body: ApiErrorBody = { status, message, resetAt };
  const headers = resetAt ? { "X-RateLimit-Reset": resetAt } : undefined;
  return NextResponse.json(body, { status, headers });
}

export function getWeatherApiKey(): string | undefined {
  return process.env.WEATHERAI_API_KEY;
}

export async function parseUpstreamError(
  response: Response,
): Promise<ApiErrorBody> {
  return parseErrorFromResponse(response);
}

const RETRYABLE_UPSTREAM_STATUSES = new Set([404, 500, 502, 503]);

export async function fetchUpstreamWeather(
  url: string,
  apiKey: string,
  retries = 2,
): Promise<Response> {
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    lastResponse = response;

    if (
      response.ok ||
      !RETRYABLE_UPSTREAM_STATUSES.has(response.status) ||
      attempt === retries
    ) {
      return response;
    }

    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }

  return lastResponse!;
}

export function enforceRateLimit(request: Request): NextResponse | null {
  const ip = getClientIp(request);
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return errorResponse(
      429,
      "Too many requests. Please try again shortly.",
      retryAfter ? String(Math.floor(Date.now() / 1000) + retryAfter) : undefined,
    );
  }
  return null;
}

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
]);

export function validateFieldScanUpload(file: File | null): string | null {
  if (!file) return "Image file is required";
  if (file.size > MAX_UPLOAD_BYTES) return "Image must be 50MB or smaller";
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only JPEG, PNG, WebP, or TIFF images are supported";
  }
  return null;
}
