import { parseErrorFromResponse } from "@/lib/api-errors";
import type { ApiError } from "./types";

export class WeatherClientError extends Error {
  status: number;
  resetAt?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.status = error.status;
    this.resetAt = error.resetAt;
  }
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new WeatherClientError(await parseErrorFromResponse(response));
  }
  return response.json() as Promise<T>;
}

export function isApiError(error: unknown): error is WeatherClientError {
  return error instanceof WeatherClientError;
}
