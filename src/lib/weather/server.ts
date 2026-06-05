import { fetchUpstreamWeather, getWeatherApiKey } from "@/lib/api-utils";
import { mergeGeoResponse } from "./cache";
import type { GeoWeatherResponse, WeatherResponse } from "./types";

async function fetchUpstream(url: string): Promise<Response> {
  const apiKey = getWeatherApiKey();
  if (!apiKey) {
    throw new Error("Weather API key is not configured");
  }
  return fetchUpstreamWeather(url, apiKey);
}

export async function fetchWeatherGeoServer(): Promise<GeoWeatherResponse | null> {
  try {
    const upstream = await fetchUpstream(
      "https://api.weather-ai.co/v1/weather-geo?ip=auto&days=7&ai=true&units=metric",
    );
    if (!upstream.ok) return null;
    const data = (await upstream.json()) as GeoWeatherResponse;
    return mergeGeoResponse(data, upstream.headers);
  } catch {
    return null;
  }
}

export async function fetchWeatherServer(
  lat: number,
  lon: number,
  days = 7,
): Promise<WeatherResponse | null> {
  try {
    const url = new URL("https://api.weather-ai.co/v1/weather");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("days", String(days));
    url.searchParams.set("ai", "true");
    url.searchParams.set("units", "metric");
    const upstream = await fetchUpstream(url.toString());
    if (!upstream.ok) return null;
    return (await upstream.json()) as WeatherResponse;
  } catch {
    return null;
  }
}
