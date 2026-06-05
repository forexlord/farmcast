import type { ForecastRiskInput } from "@/lib/risk-engine";
import type { DailyForecast, ForecastDay, Observation, RiskFlag } from "@/types/ui";

export type { DailyForecast, ForecastDay, Observation, RiskFlag };

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
  ai?: { summary?: string; text?: string; advisory?: string };
  summary?: string;
  gemini_error?: string | boolean | null;
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

export type StoredCoords = {
  lat: number;
  lon: number;
  city?: string;
  region?: string;
  country?: string;
};

export type WeatherCache = {
  data: GeoWeatherResponse;
  locationLabel?: string;
  fetchedAt: number;
};

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
  message: string;
  soilMoisture: number;
  actionRequired: boolean;
  aiUnavailable?: boolean;
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

export type FieldScanMappedResults = {
  comparison: ComparisonViewData;
  health: HealthDistributionView;
  stats: FieldStatsView;
  observations: Observation[];
  geminiUnavailable: boolean;
};
