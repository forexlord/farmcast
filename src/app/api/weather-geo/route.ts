import {
  buildWeatherGeoUpstreamUrl,
  enforceRateLimit,
  errorResponse,
  fetchUpstreamWeather,
  getClientIp,
  getWeatherApiKey,
  parseUpstreamError,
} from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

  const apiKey = getWeatherApiKey();
  if (!apiKey) {
    return errorResponse(500, "Weather API key is not configured");
  }

  const clientIp = getClientIp(request);
  const url = buildWeatherGeoUpstreamUrl(clientIp);

  try {
    const upstream = await fetchUpstreamWeather(url, apiKey);

    if (!upstream.ok) {
      const error = await parseUpstreamError(upstream);
      return errorResponse(error.status, error.message, error.resetAt);
    }

    const data = await upstream.json();
    const body =
      typeof data === "object" && data !== null
        ? (data as {
            geo?: { city?: string; region?: string; country?: string };
            ip_geo?: {
              city?: string;
              region?: string;
              country?: string;
              lat?: number;
              lon?: number;
            };
            location?: { lat?: number; lon?: number };
          })
        : {};

    const city =
      upstream.headers.get("X-City") ||
      body.ip_geo?.city ||
      body.geo?.city ||
      "";
    const region =
      upstream.headers.get("X-Region") ||
      body.ip_geo?.region ||
      body.geo?.region ||
      "";
    const country =
      upstream.headers.get("X-Country") ||
      body.ip_geo?.country ||
      body.geo?.country ||
      "";

    return NextResponse.json(
      {
        ...data,
        geo: {
          city,
          region,
          country,
          lat: body.location?.lat ?? body.ip_geo?.lat,
          lon: body.location?.lon ?? body.ip_geo?.lon,
        },
      },
      {
        headers: {
          "X-City": city,
          "X-Region": region,
          "X-Country": country,
        },
      },
    );
  } catch {
    return errorResponse(500, "Service unavailable, please try again");
  }
}
