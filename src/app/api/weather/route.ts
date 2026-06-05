import {
  errorResponse,
  getWeatherApiKey,
  parseUpstreamError,
} from "@/lib/api-utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = getWeatherApiKey();
  if (!apiKey) {
    return errorResponse(500, "Weather API key is not configured");
  }

  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const days = searchParams.get("days") ?? "7";

  if (!lat || !lon) {
    return errorResponse(400, "Missing required parameters: lat and lon");
  }

  const url = new URL("https://api.weather-ai.co/v1/weather");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("days", days);
  url.searchParams.set("ai", "true");
  url.searchParams.set("units", "metric");

  try {
    const upstream = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!upstream.ok) {
      const error = await parseUpstreamError(upstream);
      return errorResponse(error.status, error.message, error.resetAt);
    }

    const data = await upstream.json();
    return Response.json(data);
  } catch {
    return errorResponse(500, "Service unavailable, please try again");
  }
}
