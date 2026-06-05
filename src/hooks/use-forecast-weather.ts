"use client";

import type { DailyForecast, RiskFlag } from "@/types/ui";
import {
  buildForecastSubtitle,
  extractCoords,
  getWeather,
  getWeatherCache,
  getWeatherGeo,
  isApiError,
  loadCoords,
  mapAiInsight,
  mapDailyForecasts,
  mapHourlyChart,
  mapRiskFlags,
  mapSoilDynamics,
  saveCoords,
  setWeatherCache,
  type AiInsightView,
  type GeoWeatherResponse,
  type HourlyChartView,
  type SoilDynamicsView,
} from "@/lib/weather-client";
import { useCallback, useEffect, useState } from "react";

type ForecastState = {
  loading: boolean;
  error: string | null;
  resetAt?: string;
  subtitle: string;
  hourlyChart: HourlyChartView | null;
  dailyForecasts: DailyForecast[];
  riskFlags: RiskFlag[];
  aiInsight: AiInsightView | null;
  soilDynamics: SoilDynamicsView | null;
};

function buildForecastState(
  data: GeoWeatherResponse,
  locationLabel?: string,
): ForecastState {
  return {
    loading: false,
    error: null,
    subtitle: buildForecastSubtitle(data, locationLabel),
    hourlyChart: mapHourlyChart(data),
    dailyForecasts: mapDailyForecasts(data),
    riskFlags: mapRiskFlags(data),
    aiInsight: mapAiInsight(data),
    soilDynamics: mapSoilDynamics(data),
  };
}

function getInitialForecastState(
  initialData?: GeoWeatherResponse | null,
): ForecastState {
  const cached = getWeatherCache();
  if (cached) {
    return buildForecastState(cached.data, cached.locationLabel);
  }
  if (initialData) {
    return buildForecastState(initialData);
  }
  return {
    loading: true,
    error: null,
    subtitle: "Loading forecast data...",
    hourlyChart: null,
    dailyForecasts: [],
    riskFlags: [],
    aiInsight: null,
    soilDynamics: null,
  };
}

export function useForecastWeather(initialData?: GeoWeatherResponse | null) {
  const [state, setState] = useState<ForecastState>(() =>
    getInitialForecastState(initialData),
  );

  const applyForecastData = useCallback(
    (data: GeoWeatherResponse, locationLabel?: string) => {
      setWeatherCache(data, locationLabel);
      setState(buildForecastState(data, locationLabel));
    },
    [],
  );

  const loadForecast = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const cached = getWeatherCache();
      if (cached) {
        applyForecastData(cached.data, cached.locationLabel);
        return;
      }

      let lat: number | undefined;
      let lon: number | undefined;
      let locationLabel: string | undefined;

      const stored = loadCoords();
      if (stored) {
        lat = stored.lat;
        lon = stored.lon;
        if (stored.city) {
          locationLabel = `${stored.city}${stored.region ? `, ${stored.region}` : ""}`;
        }
      } else if (initialData) {
        const coords = extractCoords(initialData);
        if (coords) {
          lat = coords.lat;
          lon = coords.lon;
          locationLabel = coords.city;
          applyForecastData(initialData, locationLabel);
          return;
        }
      } else {
        const geo = await getWeatherGeo();
        const coords = extractCoords(geo);
        if (coords) {
          saveCoords(coords);
          lat = coords.lat;
          lon = coords.lon;
          locationLabel = `${coords.city ?? "Detected location"}${coords.region ? `, ${coords.region}` : ""}`;
          setWeatherCache(geo, locationLabel);
        }
      }

      if (lat == null || lon == null) {
        throw new Error("Unable to determine location");
      }

      const data = await getWeather(lat, lon, 7);
      applyForecastData(data, locationLabel);
    } catch (error) {
      if (isApiError(error)) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
          resetAt: error.resetAt,
        }));
        return;
      }
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "No connection",
      }));
    }
  }, [applyForecastData, initialData]);

  useEffect(() => {
    const cached = getWeatherCache();
    if (cached) {
      applyForecastData(cached.data, cached.locationLabel);
      return;
    }
    if (initialData) {
      applyForecastData(initialData);
      return;
    }
    void loadForecast();
  }, [applyForecastData, initialData, loadForecast]);

  const loadGeo = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getWeatherGeo();
      const coords = extractCoords(data);
      if (coords) saveCoords(coords);
      const label = `${coords?.city ?? "Detected location"}${coords?.region ? `, ${coords.region}` : ""}`;
      applyForecastData(data, label);
    } catch (error) {
      if (isApiError(error)) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
          resetAt: error.resetAt,
        }));
        return;
      }
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "No connection",
      }));
    }
  }, [applyForecastData]);

  return { state, loadForecast, loadGeo };
}
