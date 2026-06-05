import { deriveRiskFlags } from "@/lib/risk-engine";
import type { DailyForecast, ForecastDay, Observation, RiskFlag } from "@/types/ui";
import { hasGeminiError } from "./field-scan";
import {
  conditionCodeToLabel,
  resolveConditionLabel,
  resolveMaterialIcon,
} from "./icons";
import type {
  AiInsightView,
  ComparisonViewData,
  CurrentWeatherView,
  FarmAdvisoryView,
  FieldScanMappedResults,
  FieldScanResponse,
  FieldStatsView,
  GeoMeta,
  GeoWeatherResponse,
  HealthDistributionView,
  HourlyChartPoint,
  HourlyChartView,
  SoilDynamicsView,
  WeatherForecastDay,
  WeatherHourly,
  WeatherResponse,
} from "./types";

export const WEATHER_AI_UNAVAILABLE =
  "AI insights temporarily unavailable. Weather data is still current.";

function hasWeatherGeminiError(data: WeatherResponse): boolean {
  const { gemini_error: geminiError } = data;
  if (geminiError == null || geminiError === false) return false;
  if (typeof geminiError === "string") return geminiError.length > 0;
  return true;
}

function getAiSummary(data: WeatherResponse): {
  message: string;
  aiUnavailable: boolean;
} {
  const summary =
    data.ai_summary ??
    data.ai?.summary ??
    data.ai?.advisory ??
    data.ai?.text ??
    data.summary;

  if (summary?.trim()) {
    return { message: summary.trim(), aiUnavailable: false };
  }

  if (hasWeatherGeminiError(data)) {
    return { message: WEATHER_AI_UNAVAILABLE, aiUnavailable: true };
  }

  return {
    message: "No AI summary available for this location.",
    aiUnavailable: false,
  };
}

function getForecastDays(data: WeatherResponse): WeatherForecastDay[] {
  return data.forecast ?? data.daily ?? [];
}

function getHourly(data: WeatherResponse): WeatherHourly[] {
  return data.hourly ?? [];
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
      index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`,
    )
    .join(" ");
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
    icon: resolveMaterialIcon(current.icon, current.condition_code, condition),
  };
}

export function mapFarmAdvisory(data: WeatherResponse): FarmAdvisoryView {
  const { message, aiUnavailable } = getAiSummary(data);
  const hourlyMatch = findCurrentHourly(data);
  const humidity = Math.round(
    hourlyMatch?.humidity ?? data.current?.humidity ?? 0,
  );
  const actionRequired =
    !aiUnavailable &&
    !message.includes("No AI summary") &&
    /irrigation|plant|harvest|spray|fertiliz|pest|rain|wind|frost|drought/i.test(
      message,
    );

  return {
    message,
    soilMoisture: humidity,
    actionRequired,
    aiUnavailable,
  };
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
      wind: `${wind} km/h`,
      iconColor: isStorm ? "error" : "primary",
      dayColor: isStorm ? "primary" : undefined,
      filled: isStorm,
    };
  });
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
  const { message } = getAiSummary(data);
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
  const temp = data.current?.temperature ?? data.current?.temp ?? 0;
  const dewPoint = Math.round(temp - (100 - humidity) / 5);
  const wind = Math.round(data.current?.wind_speed ?? data.current?.wind ?? 0);

  return {
    surfaceMoisture: { label: "Surface Moisture", value: humidity },
    metrics: [
      { label: "Dew Point", value: `${dewPoint}°C` },
      { label: "Wind Speed", value: `${wind} km/h` },
    ],
  };
}

export function mapFieldScanResults(
  data: FieldScanResponse,
): FieldScanMappedResults {
  const total = Math.max(data.total_tree_count, 1);
  const healthyPct = Math.round((data.tree_health.healthy / total) * 100);
  const carePct = Math.round((data.tree_health.needs_care / total) * 100);
  const replacePct = Math.max(0, 100 - healthyPct - carePct);

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

  const comparison: ComparisonViewData = {
    title: "Post-Analysis Comparison",
    badge: `Analysis ID: ${data.analysis_id}`,
    originalLabel: "Original View",
    aiLabel: "AI Vision Active",
    originalImage: data.original_image_url,
    aiImage: data.overlay_image_url,
  };

  return {
    comparison,
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

export { conditionCodeToLabel, resolveMaterialIcon, conditionToIcon } from "./icons";
