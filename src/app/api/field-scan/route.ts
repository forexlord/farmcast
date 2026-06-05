import {
  enforceRateLimit,
  errorResponse,
  getWeatherApiKey,
  parseUpstreamError,
  validateFieldScanUpload,
} from "@/lib/api-utils";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request);
  if (limited) return limited;

  const apiKey = getWeatherApiKey();
  if (!apiKey) {
    return errorResponse(500, "Weather API key is not configured");
  }

  try {
    const incoming = await request.formData();
    const upstreamForm = new FormData();

    const image = incoming.get("image");
    const uploadError = validateFieldScanUpload(
      image instanceof File ? image : null,
    );
    if (uploadError) {
      return errorResponse(400, uploadError);
    }

    upstreamForm.append("image", image as File, (image as File).name);

    for (const field of [
      "farmerId",
      "county",
      "landAcres",
      "location",
      "notes",
    ] as const) {
      const value = incoming.get(field);
      if (typeof value === "string" && value.length > 0) {
        upstreamForm.append(field, value);
      }
    }

    const upstream = await fetch("https://api.weather-ai.co/v1/trees/analyze", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: upstreamForm,
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
