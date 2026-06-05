export type ApiErrorBody = {
  status: number;
  message: string;
  resetAt?: string;
};

export function mapHttpStatusToMessage(
  status: number,
  fallback = "Request failed",
): string {
  if (status === 401) return "Invalid API key";
  if (status === 404) return "Weather service unavailable — try again shortly";
  if (status === 429) return "Quota exceeded";
  if (status >= 500) return "Weather service unavailable — try again shortly";
  return fallback;
}

export async function parseErrorFromResponse(
  response: Response,
): Promise<ApiErrorBody> {
  const resetAt = response.headers.get("X-RateLimit-Reset") ?? undefined;
  let message = response.statusText || "Request failed";

  try {
    const data = (await response.json()) as {
      message?: string;
      error?: string;
      status?: number;
      resetAt?: string;
    };
    message = data.message ?? data.error ?? message;
    const status = data.status ?? response.status;
    return {
      status,
      message: mapHttpStatusToMessage(status, message),
      resetAt: data.resetAt ?? resetAt,
    };
  } catch {
    return {
      status: response.status,
      message: mapHttpStatusToMessage(response.status, message),
      resetAt,
    };
  }
}
