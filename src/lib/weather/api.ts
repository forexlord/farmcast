import { mergeGeoResponse } from "./cache";
import { handleResponse } from "./errors";
import type { FieldScanResponse, GeoWeatherResponse, WeatherResponse } from "./types";

export async function getWeather(
  lat: number,
  lon: number,
  days = 7,
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    days: String(days),
  });
  const response = await fetch(`/api/weather?${params.toString()}`);
  return handleResponse<WeatherResponse>(response);
}

export async function getWeatherGeo(): Promise<GeoWeatherResponse> {
  const response = await fetch("/api/weather-geo");
  const data = await handleResponse<GeoWeatherResponse>(response);
  return mergeGeoResponse(data, response.headers);
}

export async function analyzeField(
  formData: FormData,
): Promise<FieldScanResponse> {
  const response = await fetch("/api/field-scan", {
    method: "POST",
    body: formData,
  });
  return handleResponse<FieldScanResponse>(response);
}

export async function geocodeCity(
  query: string,
): Promise<{ lat: number; lon: number; label: string } | null> {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/api/geocode?${params.toString()}`);
  if (!response.ok) return null;
  const data = (await response.json()) as {
    lat: number;
    lon: number;
    label: string;
  } | null;
  return data;
}
