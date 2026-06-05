import type { GeoWeatherResponse, StoredCoords, WeatherCache } from "./types";

export const COORDS_STORAGE_KEY = "farmcast_coords";

let weatherCache: WeatherCache | null = null;

export function getWeatherCache(): WeatherCache | null {
  return weatherCache;
}

export function setWeatherCache(
  data: GeoWeatherResponse,
  locationLabel?: string,
) {
  weatherCache = { data, locationLabel, fetchedAt: Date.now() };
}

export function getLastSyncLabel(): string | null {
  if (!weatherCache?.fetchedAt) return null;
  const minutes = Math.max(
    1,
    Math.round((Date.now() - weatherCache.fetchedAt) / 60_000),
  );
  return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
}

export function saveCoords(coords: StoredCoords) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(coords));
}

export function loadCoords(): StoredCoords | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COORDS_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredCoords;
  } catch {
    return null;
  }
}

export function extractCoords(data: GeoWeatherResponse): StoredCoords | null {
  const lat =
    data.location?.lat ?? data.ip_geo?.lat ?? data.lat ?? data.geo?.lat;
  const lon =
    data.location?.lon ?? data.ip_geo?.lon ?? data.lon ?? data.geo?.lon;
  if (lat == null || lon == null) return null;

  return {
    lat,
    lon,
    city: data.geo?.city || data.ip_geo?.city,
    region: data.geo?.region || data.ip_geo?.region,
    country: data.geo?.country || data.ip_geo?.country,
  };
}

export function buildForecastSubtitle(
  data: GeoWeatherResponse,
  locationLabel?: string,
): string {
  if (locationLabel) {
    return `${locationLabel} • Updated just now`;
  }
  const coords = extractCoords(data);
  if (coords?.city) {
    return `${coords.city}${coords.region ? `, ${coords.region}` : ""} • Updated just now`;
  }
  return "Current location • Updated just now";
}

export function mergeGeoResponse(
  data: GeoWeatherResponse,
  headers: Headers,
): GeoWeatherResponse {
  return {
    ...data,
    geo: {
      city:
        headers.get("X-City") || data.ip_geo?.city || data.geo?.city,
      region:
        headers.get("X-Region") || data.ip_geo?.region || data.geo?.region,
      country:
        headers.get("X-Country") || data.ip_geo?.country || data.geo?.country,
      lat:
        data.location?.lat ?? data.ip_geo?.lat ?? data.lat ?? data.geo?.lat,
      lon:
        data.location?.lon ?? data.ip_geo?.lon ?? data.lon ?? data.geo?.lon,
    },
  };
}
