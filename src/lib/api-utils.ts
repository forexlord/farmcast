import { NextResponse } from "next/server";

export type ApiErrorBody = {
  status: number;
  message: string;
  resetAt?: string;
};

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
  const resetAt = response.headers.get("X-RateLimit-Reset") ?? undefined;
  let message = "Request failed";

  try {
    const data = (await response.json()) as { message?: string; error?: string };
    message = data.message ?? data.error ?? message;
  } catch {
    message = response.statusText || message;
  }

  if (response.status === 401) {
    message = "Invalid API key";
  } else if (response.status === 429) {
    message = "Quota exceeded";
  } else if (response.status >= 500) {
    message = "Service unavailable, please try again";
  }

  return { status: response.status, message, resetAt };
}
