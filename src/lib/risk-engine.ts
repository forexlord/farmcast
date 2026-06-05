import type { RiskFlag } from "@/data/forecast";

export type ForecastRiskInput = {
  date?: string;
  datetime?: string;
  high?: number;
  low?: number;
  min?: number;
  max?: number;
  temp_min?: number;
  temp_max?: number;
  precipitation_mm?: number;
  precip_mm?: number;
  precipitation?: number;
  precipitation_sum?: number;
  precipitation_probability?: number;
  precip_probability?: number;
  wind_speed?: number;
  wind?: number;
  wind_max?: number;
  uv_index?: number;
  uv?: number;
};

function getPrecipMm(day: ForecastRiskInput): number {
  return (
    day.precipitation_sum ??
    day.precipitation_mm ??
    day.precip_mm ??
    day.precipitation ??
    0
  );
}

function getWind(day: ForecastRiskInput): number {
  return day.wind_max ?? day.wind_speed ?? day.wind ?? 0;
}

function getUv(day: ForecastRiskInput): number {
  return day.uv_index ?? day.uv ?? 0;
}

function getMinTemp(day: ForecastRiskInput): number {
  return day.temp_min ?? day.low ?? day.min ?? day.high ?? day.max ?? 0;
}

function formatDayLabel(day: ForecastRiskInput, index: number): string {
  const raw = day.date ?? day.datetime;
  if (raw) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-US", { weekday: "short" });
    }
  }
  return `Day ${index + 1}`;
}

export function deriveRiskFlags(forecast: ForecastRiskInput[]): RiskFlag[] {
  const flags: RiskFlag[] = [];

  const heavyRainDay = forecast.find((day) => getPrecipMm(day) > 10);
  if (heavyRainDay) {
    const index = forecast.indexOf(heavyRainDay);
    flags.push({
      icon: "rainy_heavy",
      title: "Heavy Rain",
      detail: `Expected on ${formatDayLabel(heavyRainDay, index)} — ${getPrecipMm(heavyRainDay).toFixed(1)}mm forecast`,
      severity: "danger",
    });
  }

  const windDay = forecast.find((day) => getWind(day) > 40);
  if (windDay) {
    const index = forecast.indexOf(windDay);
    flags.push({
      icon: "air",
      title: "Strong Wind",
      detail: `Gusts up to ${Math.round(getWind(windDay))} km/h on ${formatDayLabel(windDay, index)}`,
      severity: "caution",
    });
  }

  const uvDay = forecast.find((day) => getUv(day) > 7);
  if (uvDay) {
    const index = forecast.indexOf(uvDay);
    flags.push({
      icon: "light_mode",
      title: "High UV Index",
      detail: `Level ${getUv(uvDay).toFixed(0)}/11 expected on ${formatDayLabel(uvDay, index)}`,
      severity: "caution",
    });
  }

  const frostDay = forecast.find((day) => getMinTemp(day) < 4);
  if (frostDay) {
    const index = forecast.indexOf(frostDay);
    flags.push({
      icon: "ac_unit",
      title: "Frost Risk",
      detail: `Low of ${getMinTemp(frostDay).toFixed(0)}°C on ${formatDayLabel(frostDay, index)}`,
      severity: "danger",
    });
  }

  let dryStreak = 0;
  let longestDry = 0;
  for (const day of forecast) {
    if (getPrecipMm(day) < 1) {
      dryStreak += 1;
      longestDry = Math.max(longestDry, dryStreak);
    } else {
      dryStreak = 0;
    }
  }

  if (longestDry >= 5) {
    flags.push({
      icon: "water_drop",
      title: "Drought Conditions",
      detail: "No significant rain forecast for 5+ consecutive days",
      severity: "caution",
    });
  }

  return flags;
}
