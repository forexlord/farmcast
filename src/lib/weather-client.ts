import type {
  DailyForecast,
  ForecastDay,
  Observation,
  RiskFlag,
} from "@/types/ui";
import { deriveRiskFlags, type ForecastRiskInput } from "@/lib/risk-engine";

export type ApiError = {
  status: number;
  message: string;
  resetAt?: string;
};

export type GeoMeta = {
  city?: string;
  region?: string;
  country?: string;
  lat?: number;
  lon?: number;
};

export type WeatherCurrent = {
  time?: string;
  temperature?: number;
  temp?: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  wind?: number;
  wind_direction?: number;
  condition?: string;
  condition_code?: string | number;
  description?: string;
  weather?: string;
  icon?: string;
  icon_path?: string;
  uv_index?: number;
};

export type WeatherForecastDay = ForecastRiskInput & {
  day?: string;
  date?: string;
  condition?: string;
  condition_code?: string | number;
  description?: string;
  weather?: string;
  icon?: string;
  icon_path?: string;
  temp_min?: number;
  temp_max?: number;
  precipitation_sum?: number;
  wind_max?: number;
};

export type WeatherHourly = {
  time?: string;
  datetime?: string;
  hour?: string;
  temperature?: number;
  temp?: number;
  feels_like?: number;
  humidity?: number;
  precipitation_probability?: number;
  precip_probability?: number;
  precipitation?: number;
  uv_index?: number;
  wind_speed?: number;
  condition_code?: string | number;
};

export type WeatherLocation = {
  lat?: number;
  lon?: number;
  timezone?: string;
  country?: string;
};

export type WeatherResponse = {
  current?: WeatherCurrent;
  forecast?: WeatherForecastDay[];
  daily?: WeatherForecastDay[];
  hourly?: WeatherHourly[];
  location?: WeatherLocation;
  ip_geo?: GeoMeta;
  ai_summary?: string;
  ai?: { summary?: string; text?: string };
  summary?: string;
  lat?: number;
  lon?: number;
};

export type GeoWeatherResponse = WeatherResponse & {
  geo?: GeoMeta;
};

export type TreeHealth = {
  healthy: number;
  needs_care: number;
  needs_replacement: number;
};

export type FieldScanResponse = {
  analysis_id: string;
  total_tree_count: number;
  tree_density_per_acre?: number;
  canopy_coverage_pct?: number;
  tree_health: TreeHealth;
  observations: string[];
  recommendations: string[];
  overlay_image_url: string;
  original_image_url: string;
  confidence_score: number;
  low_confidence?: boolean;
  gemini_error?: string | boolean | null;
};

export const NO_TREES_MESSAGE =
  "We couldn't detect any trees in this image. For best results, upload a top-down drone or aerial photo with clearly visible tree crowns.";

export function isNoTreesDetected(data: FieldScanResponse): boolean {
  return data.low_confidence === true || data.total_tree_count === 0;
}

export function hasGeminiError(data: FieldScanResponse): boolean {
  const { gemini_error: geminiError } = data;
  if (geminiError == null || geminiError === false) return false;
  if (typeof geminiError === "string") return geminiError.length > 0;
  return true;
}

export type StoredCoords = {
  lat: number;
  lon: number;
  city?: string;
  region?: string;
  country?: string;
};

export const COORDS_STORAGE_KEY = "farmcast_coords";

export type WeatherCache = {
  data: GeoWeatherResponse;
  locationLabel?: string;
};

let weatherCache: WeatherCache | null = null;

export function getWeatherCache(): WeatherCache | null {
  return weatherCache;
}

export function setWeatherCache(
  data: GeoWeatherResponse,
  locationLabel?: string,
) {
  weatherCache = { data, locationLabel };
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

export type CurrentWeatherView = {
  location: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  wind: number;
  icon: string;
};

export type FarmAdvisoryView = {
  crop: string;
  message: string;
  soilMoisture: number;
};

export type HourlyChartPoint = {
  time: string;
  temperature: number;
  precip: number;
  x: number;
  y: number;
};

export type HourlyChartView = {
  title: string;
  status: string;
  yAxisLabels: string[];
  xAxisLabels: string[];
  temperaturePath: string;
  points: HourlyChartPoint[];
  defaultIndex: number;
  legend: Array<{ label: string; color: "primary" | "secondary" }>;
};

export type AiInsightView = {
  message: string;
  highlight: string;
};

export type SoilDynamicsView = {
  surfaceMoisture: { label: string; value: number };
  metrics: Array<{ label: string; value: string }>;
};

export type ComparisonViewData = {
  title: string;
  badge: string;
  originalLabel: string;
  aiLabel: string;
  originalImage: string;
  aiImage: string;
  overlayMarkers: Array<{
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    pulse?: boolean;
  }>;
};

export type HealthDistributionView = {
  segments: Array<{
    label: string;
    value: number;
    color: "primary" | "secondary" | "error";
  }>;
};

export type FieldStatsView = {
  treeCount: string;
  density: { value: string; unit: string };
};

class WeatherClientError extends Error {
  status: number;
  resetAt?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.status = error.status;
    this.resetAt = error.resetAt;
  }
}

async function parseClientError(response: Response): Promise<ApiError> {
  const resetAt = response.headers.get("X-RateLimit-Reset") ?? undefined;
  try {
    const data = (await response.json()) as ApiError;
    return {
      status: data.status ?? response.status,
      message: data.message ?? "Request failed",
      resetAt: data.resetAt ?? resetAt,
    };
  } catch {
    if (response.status === 401) {
      return { status: 401, message: "Invalid API key", resetAt };
    }
    if (response.status === 429) {
      return { status: 429, message: "Quota exceeded", resetAt };
    }
    if (response.status >= 500) {
      return {
        status: response.status,
        message: "Service unavailable, please try again",
        resetAt,
      };
    }
    return {
      status: response.status,
      message: "No connection",
      resetAt,
    };
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new WeatherClientError(await parseClientError(response));
  }
  return response.json() as Promise<T>;
}

export function isApiError(error: unknown): error is WeatherClientError {
  return error instanceof WeatherClientError;
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
  return {
    ...data,
    geo: {
      city:
        response.headers.get("X-City") ||
        data.ip_geo?.city ||
        data.geo?.city,
      region:
        response.headers.get("X-Region") ||
        data.ip_geo?.region ||
        data.geo?.region,
      country:
        response.headers.get("X-Country") ||
        data.ip_geo?.country ||
        data.geo?.country,
      lat:
        data.location?.lat ??
        data.ip_geo?.lat ??
        data.lat ??
        data.geo?.lat,
      lon:
        data.location?.lon ??
        data.ip_geo?.lon ??
        data.lon ??
        data.geo?.lon,
    },
  };
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
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { "User-Agent": "FarmCast/1.0" },
  });
  if (!response.ok) return null;

  const results = (await response.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;

  if (!results[0]) return null;

  return {
    lat: Number.parseFloat(results[0].lat),
    lon: Number.parseFloat(results[0].lon),
    label: results[0].display_name,
  };
}

function getAiSummary(data: WeatherResponse): string {
  return (
    data.ai_summary ??
    data.ai?.summary ??
    data.ai?.text ??
    data.summary ??
    "No AI advisory available for this location."
  );
}

function getForecastDays(data: WeatherResponse): WeatherForecastDay[] {
  return data.forecast ?? data.daily ?? [];
}

function getHourly(data: WeatherResponse): WeatherHourly[] {
  return data.hourly ?? [];
}

function isIconUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

export function conditionCodeToLabel(code: string | number): string {
  const value = Number(code);
  if (Number.isNaN(value)) return "Unknown";
  if (value === 0) return "Clear Sky";
  if (value === 1) return "Mainly Clear";
  if (value === 2) return "Partly Cloudy";
  if (value === 3) return "Overcast";
  if (value >= 51 && value <= 55) return "Drizzle";
  if (value >= 56 && value <= 57) return "Freezing Drizzle";
  if (value >= 61 && value <= 65) return "Rain";
  if (value >= 66 && value <= 67) return "Freezing Rain";
  if (value >= 71 && value <= 77) return "Snow";
  if (value >= 80 && value <= 82) return "Rain Showers";
  if (value === 85 || value === 86) return "Snow Showers";
  if (value >= 95 && value <= 99) return "Thunderstorm";
  if (value === 45 || value === 48) return "Fog";
  return "Unknown";
}

export function conditionCodeToMaterialIcon(
  code: string | number,
  nameHint = "",
): string {
  const hint = nameHint.toLowerCase();
  const value = Number(code);
  if (Number.isNaN(value)) return "partly_cloudy_day";
  if (value >= 95) return "thunderstorm";
  if (value >= 80 && value <= 82) return "rainy";
  if (value >= 61 && value <= 67) return "rainy";
  if (value >= 51 && value <= 57) return "rainy";
  if (value >= 71 && value <= 77) return "ac_unit";
  if (value === 45 || value === 48) return "foggy";
  if (value === 0 || value === 1) {
    return hint.includes("night") ? "nights_stay" : "sunny";
  }
  if (value === 2) return "partly_cloudy_day";
  if (value === 3) return "cloud";
  return "partly_cloudy_day";
}

function parseIconHintFromUrl(iconUrl: string): {
  code?: string;
  hint?: string;
} {
  const match = iconUrl.match(/\/(\d+)_([^./]+)/);
  if (!match) return {};
  return { code: match[1], hint: match[2] };
}

export function resolveMaterialIcon(
  icon?: string,
  conditionCode?: string | number,
  condition?: string,
): string {
  if (icon && !isIconUrl(icon)) return icon;

  if (icon && isIconUrl(icon)) {
    const parsed = parseIconHintFromUrl(icon);
    if (parsed.code) {
      return conditionCodeToMaterialIcon(parsed.code, parsed.hint ?? "");
    }
  }

  if (conditionCode != null) {
    return conditionCodeToMaterialIcon(conditionCode);
  }

  if (condition) {
    return conditionToIcon(condition);
  }

  return "partly_cloudy_day";
}

export function conditionToIcon(condition: string): string {
  const value = condition.toLowerCase();
  if (value.includes("thunder")) return "thunderstorm";
  if (value.includes("shower") || value.includes("rain") || value.includes("drizzle")) {
    return "rainy";
  }
  if (value.includes("snow")) return "ac_unit";
  if (value.includes("fog") || value.includes("mist")) return "foggy";
  if (value.includes("overcast")) return "cloud";
  if (value.includes("partly")) return "partly_cloudy_day";
  if (value.includes("cloud")) return "cloud";
  if (value.includes("clear") || value.includes("sunny")) return "sunny";
  return "partly_cloudy_day";
}

function resolveConditionLabel(
  conditionCode?: string | number,
  condition?: string,
  description?: string,
  weather?: string,
): string {
  if (condition && condition !== "Unknown") return condition;
  if (description) return description;
  if (weather) return weather;
  if (conditionCode != null) return conditionCodeToLabel(conditionCode);
  return "Unknown";
}

function findCurrentHourly(data: WeatherResponse): WeatherHourly | undefined {
  const currentTime = data.current?.time;
  if (!currentTime || !data.hourly?.length) return data.hourly?.[0];

  const exact = data.hourly.find((entry) => entry.time === currentTime);
  if (exact) return exact;

  const hourPrefix = currentTime.slice(0, 13);
  return (
    data.hourly.find((entry) => entry.time?.startsWith(hourPrefix)) ??
    data.hourly[0]
  );
}

function getDayHigh(day: WeatherForecastDay): number {
  return Math.round(day.temp_max ?? day.high ?? day.max ?? 0);
}

function getDayLow(day: WeatherForecastDay): number {
  return Math.round(day.temp_min ?? day.low ?? day.min ?? 0);
}

function getDayWind(day: WeatherForecastDay): number {
  return Math.round(day.wind_max ?? day.wind_speed ?? day.wind ?? 0);
}

function formatLocation(geo?: GeoMeta, fallback = "Current Location"): string {
  const parts = [geo?.city, geo?.region, geo?.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : fallback;
}

export function mapCurrentWeather(
  data: GeoWeatherResponse,
  locationOverride?: string,
): CurrentWeatherView {
  const current = data.current ?? {};
  const hourlyMatch = findCurrentHourly(data);
  const condition = resolveConditionLabel(
    current.condition_code,
    current.condition,
    current.description,
    current.weather,
  );

  return {
    location: locationOverride ?? formatLocation(data.geo),
    temperature: Math.round(current.temperature ?? current.temp ?? 0),
    condition,
    feelsLike: Math.round(
      hourlyMatch?.feels_like ??
        current.feels_like ??
        current.temperature ??
        current.temp ??
        0,
    ),
    humidity: Math.round(hourlyMatch?.humidity ?? current.humidity ?? 0),
    wind: Math.round(current.wind_speed ?? current.wind ?? 0),
    icon: resolveMaterialIcon(
      current.icon,
      current.condition_code,
      condition,
    ),
  };
}

export function mapFarmAdvisory(data: WeatherResponse): FarmAdvisoryView {
  const summary = getAiSummary(data);
  const hourlyMatch = findCurrentHourly(data);
  const humidity = Math.round(
    hourlyMatch?.humidity ?? data.current?.humidity ?? 0,
  );

  return {
    crop: "crops",
    message: summary,
    soilMoisture: humidity,
  };
}

function barMetaFromRain(probability: number): {
  barWidth: string;
  barColor: "secondary" | "primary" | "error";
  iconColor: "secondary" | "primary";
} {
  if (probability >= 70) {
    return { barWidth: "w-3/4", barColor: "error", iconColor: "primary" };
  }
  if (probability >= 40) {
    return { barWidth: "w-1/2", barColor: "primary", iconColor: "primary" };
  }
  if (probability >= 20) {
    return { barWidth: "w-4/5", barColor: "secondary", iconColor: "secondary" };
  }
  return { barWidth: "w-full", barColor: "secondary", iconColor: "secondary" };
}

export function mapDashboardForecast(data: WeatherResponse): ForecastDay[] {
  return getForecastDays(data).slice(0, 7).map((day, index) => {
    const condition = resolveConditionLabel(
      day.condition_code,
      day.condition,
      day.description,
      day.weather,
    );
    const probability = Math.round(
      day.precipitation_probability ?? day.precip_probability ?? 0,
    );
    const meta = barMetaFromRain(probability);

    return {
      day:
        day.day ??
        (day.date
          ? new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })
          : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index % 7]),
      icon: resolveMaterialIcon(day.icon, day.condition_code, condition),
      high: getDayHigh(day),
      low: getDayLow(day),
      barWidth: meta.barWidth,
      barColor: meta.barColor,
      iconColor: meta.iconColor,
    };
  });
}

export function mapDailyForecasts(data: WeatherResponse): DailyForecast[] {
  return getForecastDays(data).slice(0, 7).map((day, index) => {
    const condition = resolveConditionLabel(
      day.condition_code,
      day.condition,
      day.description,
      day.weather,
    );
    const rainChance = Math.round(
      day.precipitation_probability ?? day.precip_probability ?? 0,
    );
    const wind = getDayWind(day);
    const code = Number(day.condition_code);
    const isStorm =
      condition.toLowerCase().includes("thunder") ||
      (!Number.isNaN(code) && code >= 95) ||
      rainChance >= 70;

    return {
      day:
        day.day ??
        (day.date
          ? new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })
          : `Day ${index + 1}`),
      icon: resolveMaterialIcon(day.icon, day.condition_code, condition),
      high: getDayHigh(day),
      low: getDayLow(day),
      rain: `${rainChance}%`,
      wind: `${wind}k/h`,
      iconColor: isStorm ? "error" : "primary",
      dayColor: isStorm ? "primary" : undefined,
      filled: isStorm,
    };
  });
}

function buildTemperaturePath(
  values: number[],
  minValue: number,
  maxValue: number,
): string {
  if (values.length === 0) return "M 0,60 L 100,60";
  const range = Math.max(maxValue - minValue, 1);

  const points = values.map((value, index) => {
    const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
    const y = 90 - ((value - minValue) / range) * 70;
    return { x, y };
  });

  return points
    .map((point, index) =>
      index === 0
        ? `M ${point.x},${point.y}`
        : `L ${point.x},${point.y}`,
    )
    .join(" ");
}

export function mapHourlyChart(data: WeatherResponse): HourlyChartView {
  const hourly = getHourly(data).slice(0, 24);
  const temps = hourly.map((entry) =>
    Math.round(entry.temperature ?? entry.temp ?? 0),
  );
  const precip = hourly.map((entry) =>
    Math.round(
      entry.precipitation_probability ??
        entry.precip_probability ??
        entry.precipitation ??
        0,
    ),
  );

  const maxTemp = Math.max(...temps, 40);
  const minTemp = Math.min(...temps, 0);
  const peakIndex = temps.indexOf(Math.max(...temps));
  const peak = hourly[peakIndex];

  const labels = hourly.map((entry) => {
    const raw = entry.time ?? entry.datetime ?? entry.hour ?? "";
    if (!raw) return "";
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    return raw;
  });

  const tickCount = 6;
  const step = Math.max(Math.floor(labels.length / tickCount), 1);
  const xAxisLabels = labels.filter((_, index) => index % step === 0);
  const range = Math.max(maxTemp - minTemp, 1);

  const points: HourlyChartPoint[] = temps.map((temperature, index) => ({
    time: labels[index] || `Hour ${index + 1}`,
    temperature,
    precip: precip[index] ?? 0,
    x: temps.length === 1 ? 50 : (index / (temps.length - 1)) * 100,
    y: 90 - ((temperature - minTemp) / range) * 70,
  }));

  return {
    title: "24H Dynamics",
    status: "Live Feed: Active",
    yAxisLabels: [
      `${maxTemp}°`,
      `${Math.round(maxTemp * 0.75)}°`,
      `${Math.round(maxTemp * 0.5)}°`,
      `${Math.round(maxTemp * 0.25)}°`,
      `${minTemp}°`,
    ],
    xAxisLabels: xAxisLabels.length > 0 ? xAxisLabels : ["Now"],
    temperaturePath: buildTemperaturePath(temps, minTemp, maxTemp),
    points,
    defaultIndex: peakIndex >= 0 ? peakIndex : 0,
    legend: [{ label: "Temp (°C)", color: "primary" }],
  };
}

export function mapRiskFlags(data: WeatherResponse): RiskFlag[] {
  return deriveRiskFlags(getForecastDays(data));
}

export function mapAiInsight(data: WeatherResponse): AiInsightView {
  const message = getAiSummary(data);
  const highlightMatch = message.match(
    /([^.!?]*(?:before|within|apply|complete|irrigation)[^.!?]*)/i,
  );

  return {
    message,
    highlight: highlightMatch?.[1]?.trim() ?? message.split(".")[0] ?? message,
  };
}

export function mapSoilDynamics(data: WeatherResponse): SoilDynamicsView {
  const hourlyMatch = findCurrentHourly(data);
  const humidity = Math.round(
    hourlyMatch?.humidity ?? data.current?.humidity ?? 0,
  );
  const dewPoint = Math.round(
    (data.current?.temperature ?? data.current?.temp ?? 0) -
      ((100 - humidity) / 5),
  );

  return {
    surfaceMoisture: { label: "Surface Moisture", value: humidity },
    metrics: [
      { label: "Evapotranspiration", value: "4.2 mm/d" },
      { label: "Dew Point", value: `${dewPoint}°C` },
    ],
  };
}

export type FieldScanMappedResults = {
  comparison: ComparisonViewData;
  health: HealthDistributionView;
  stats: FieldStatsView;
  observations: Observation[];
  geminiUnavailable: boolean;
};

export function mapFieldScanResults(data: FieldScanResponse): FieldScanMappedResults {
  const total = Math.max(data.total_tree_count, 1);
  const healthyPct = Math.round((data.tree_health.healthy / total) * 100);
  const carePct = Math.round((data.tree_health.needs_care / total) * 100);
  const replacePct = Math.max(
    0,
    100 - healthyPct - carePct,
  );

  const observations: Observation[] = [
    ...data.observations.map((text, index) => ({
      icon: index === 0 ? "warning" : "coronavirus",
      title: text.split(".")[0] ?? text,
      detail: text,
      severity: index === 0 ? ("secondary" as const) : ("error" as const),
    })),
    ...data.recommendations.map((text) => ({
      icon: "check_circle",
      title: text.split(".")[0] ?? text,
      detail: text,
      severity: "primary" as const,
    })),
  ];

  return {
    comparison: {
      title: "Post-Analysis Comparison",
      badge: `Analysis ID: ${data.analysis_id}`,
      originalLabel: "Original View",
      aiLabel: "AI Vision Active",
      originalImage: data.original_image_url,
      aiImage: data.overlay_image_url,
      overlayMarkers: [
        { top: "25%", left: "25%", pulse: true },
        { top: "50%", left: "33%", pulse: false },
        { top: "33%", right: "25%", pulse: false },
        { bottom: "25%", right: "33%", pulse: true },
      ],
    },
    health: {
      segments: [
        { label: "Healthy", value: healthyPct, color: "primary" },
        { label: "Needs Care", value: carePct, color: "secondary" },
        { label: "Replacement", value: replacePct, color: "error" },
      ],
    },
    stats: {
      treeCount: data.total_tree_count.toLocaleString(),
      density: {
        value: String(Math.round(data.tree_density_per_acre ?? 0)),
        unit: "per acre",
      },
    },
    observations,
    geminiUnavailable: hasGeminiError(data),
  };
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
