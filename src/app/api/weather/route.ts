import {
  enforceRateLimit,
  errorResponse,
  fetchUpstreamWeather,
  getWeatherApiKey,
  parseUpstreamError,
} from "@/lib/api-utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

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

  const latNum = Number.parseFloat(lat);
  const lonNum = Number.parseFloat(lon);
  if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
    return errorResponse(400, "Invalid lat or lon");
  }

  const url = new URL("https://api.weather-ai.co/v1/weather");
  url.searchParams.set("lat", String(latNum));
  url.searchParams.set("lon", String(lonNum));
  url.searchParams.set("days", days);
  url.searchParams.set("ai", "true");
  url.searchParams.set("units", "metric");

  try {
    const upstream = await fetchUpstreamWeather(url.toString(), apiKey);

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
