import { enforceRateLimit, errorResponse } from "@/lib/api-utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return errorResponse(400, "Missing required parameter: q");
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "FarmCast/1.0" },
      cache: "no-store",
    });

    if (!response.ok) {
      return errorResponse(502, "Geocoding service unavailable");
    }

    const results = (await response.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;

    if (!results[0]) {
      return errorResponse(404, "Location not found");
    }

    return Response.json({
      lat: Number.parseFloat(results[0].lat),
      lon: Number.parseFloat(results[0].lon),
      label: results[0].display_name,
    });
  } catch {
    return errorResponse(500, "Service unavailable, please try again");
  }
}
