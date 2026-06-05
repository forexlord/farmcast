"use client";

import type { ForecastDay } from "@/types/ui";
import {
  extractCoords,
  geocodeCity,
  getWeather,
  getWeatherCache,
  getWeatherGeo,
  isApiError,
  loadCoords,
  mapCurrentWeather,
  mapDashboardForecast,
  mapFarmAdvisory,
  saveCoords,
  setWeatherCache,
  type CurrentWeatherView,
  type FarmAdvisoryView,
  type GeoWeatherResponse,
} from "@/lib/weather-client";
import { useCallback, useEffect, useState } from "react";

type DashboardState = {
  loading: boolean;
  error: string | null;
  resetAt?: string;
  currentWeather: CurrentWeatherView | null;
  farmAdvisory: FarmAdvisoryView | null;
  forecastDays: ForecastDay[];
};

function buildStateFromData(
  data: GeoWeatherResponse,
  locationLabel?: string,
): DashboardState {
  return {
    loading: false,
    error: null,
    currentWeather: mapCurrentWeather(data, locationLabel),
    farmAdvisory: mapFarmAdvisory(data),
    forecastDays: mapDashboardForecast(data),
  };
}

function getInitialState(initialData?: GeoWeatherResponse | null): DashboardState {
  const cached = getWeatherCache();
  if (cached) {
    return buildStateFromData(cached.data, cached.locationLabel);
  }
  if (initialData) {
    return buildStateFromData(initialData);
  }
  return {
    loading: true,
    error: null,
    currentWeather: null,
    farmAdvisory: null,
    forecastDays: [],
  };
}

export function useDashboardWeather(initialData?: GeoWeatherResponse | null) {
  const [state, setState] = useState<DashboardState>(() =>
    getInitialState(initialData),
  );

  const applyWeather = useCallback(
    (data: GeoWeatherResponse, locationLabel?: string) => {
      const coords = extractCoords(data);
      if (coords) saveCoords(coords);
      setWeatherCache(data, locationLabel);
      setState(buildStateFromData(data, locationLabel));
    },
    [],
  );

  const loadWeather = useCallback(async (loader: () => Promise<void>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await loader();
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
  }, []);

  const loadGeo = useCallback(async () => {
    await loadWeather(async () => {
      const data = await getWeatherGeo();
      applyWeather(data);
    });
  }, [applyWeather, loadWeather]);

  const retryWeather = useCallback(async () => {
    const cached = getWeatherCache();
    const coords = loadCoords();

    if (coords) {
      await loadWeather(async () => {
        const data = await getWeather(coords.lat, coords.lon, 7);
        const label =
          cached?.locationLabel ??
          [coords.city, coords.region].filter(Boolean).join(", ");
        applyWeather(
          { ...data, geo: { city: coords.city, region: coords.region, country: coords.country, lat: coords.lat, lon: coords.lon } },
          label || undefined,
        );
      });
      return;
    }

    if (cached) {
      applyWeather(cached.data, cached.locationLabel);
      return;
    }

    await loadGeo();
  }, [applyWeather, loadGeo, loadWeather]);

  useEffect(() => {
    const cached = getWeatherCache();
    if (cached) {
      applyWeather(cached.data, cached.locationLabel);
      return;
    }
    if (initialData) {
      applyWeather(initialData);
      return;
    }
    void loadGeo();
  }, [applyWeather, initialData, loadGeo]);

  const searchLocation = useCallback(
    async (query: string) => {
      await loadWeather(async () => {
        const location = await geocodeCity(query);
        if (!location) {
          throw new Error("Location not found");
        }
        const data = await getWeather(location.lat, location.lon, 7);
        saveCoords({
          lat: location.lat,
          lon: location.lon,
          city: location.label,
        });
        applyWeather({ ...data, geo: { city: location.label } }, location.label);
      });
    },
    [applyWeather, loadWeather],
  );

  return { state, loadGeo, retryWeather, searchLocation };
}
