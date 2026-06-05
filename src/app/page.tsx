"use client";

import { FarmAdvisory } from "@/components/dashboard/farm-advisory";
import { ForecastStrip } from "@/components/dashboard/forecast-strip";
import { InsightsGrid } from "@/components/dashboard/insights-grid";
import { WeatherHero } from "@/components/dashboard/weather-hero";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  extractCoords,
  geocodeCity,
  getWeather,
  getWeatherCache,
  getWeatherGeo,
  isApiError,
  mapCurrentWeather,
  mapDashboardForecast,
  mapFarmAdvisory,
  saveCoords,
  setWeatherCache,
  type CurrentWeatherView,
  type FarmAdvisoryView,
} from "@/lib/weather-client";
import type { ForecastDay } from "@/data/dashboard";
import { useCallback, useEffect, useState } from "react";

type DashboardState = {
  loading: boolean;
  error: string | null;
  resetAt?: string;
  status?: number;
  currentWeather: CurrentWeatherView | null;
  farmAdvisory: FarmAdvisoryView | null;
  forecastDays: ForecastDay[];
};

function DashboardSkeleton() {
  return (
    <div className="space-y-gutter animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <Card variant="elevated" className="lg:col-span-8 p-stack-lg h-56">{null}</Card>
        <Card variant="advisory" className="lg:col-span-4 p-stack-lg h-56">{null}</Card>
      </div>
      <Card variant="elevated" className="p-stack-lg h-40">{null}</Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <Card variant="low" className="p-stack-md h-48">{null}</Card>
        <Card variant="low" className="p-stack-md h-48">{null}</Card>
        <Card variant="low" className="p-stack-md h-48">{null}</Card>
      </div>
    </div>
  );
}

function ErrorCard({
  message,
  resetAt,
  onRetry,
}: {
  message: string;
  resetAt?: string;
  onRetry: () => void;
}) {
  const resetLabel = resetAt
    ? new Date(Number(resetAt) * 1000).toLocaleString()
    : undefined;

  return (
    <Card variant="elevated" className="p-stack-lg">
      <Badge variant="error" className="mb-4">
        Error
      </Badge>
      <p className="text-body-md text-on-surface mb-2">{message}</p>
      {resetLabel && (
        <p className="text-body-sm text-on-surface-variant mb-4">
          Quota resets: {resetLabel}
        </p>
      )}
      <Button onClick={onRetry}>Retry</Button>
    </Card>
  );
}

function getInitialDashboardState(): DashboardState {
  const cached = getWeatherCache();
  if (cached) {
    return {
      loading: false,
      error: null,
      currentWeather: mapCurrentWeather(cached.data, cached.locationLabel),
      farmAdvisory: mapFarmAdvisory(cached.data),
      forecastDays: mapDashboardForecast(cached.data),
    };
  }
  return {
    loading: true,
    error: null,
    currentWeather: null,
    farmAdvisory: null,
    forecastDays: [],
  };
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [state, setState] = useState<DashboardState>(getInitialDashboardState);

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
          status: error.status,
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

  const applyWeather = useCallback(
    (data: Awaited<ReturnType<typeof getWeatherGeo>>, location?: string) => {
      const coords = extractCoords(data);
      if (coords) saveCoords(coords);
      setWeatherCache(data, location);

      setState({
        loading: false,
        error: null,
        currentWeather: mapCurrentWeather(data, location),
        farmAdvisory: mapFarmAdvisory(data),
        forecastDays: mapDashboardForecast(data),
      });
    },
    [],
  );

  const loadGeo = useCallback(async () => {
    await loadWeather(async () => {
      const data = await getWeatherGeo();
      applyWeather(data);
    });
  }, [applyWeather, loadWeather]);

  useEffect(() => {
    const cached = getWeatherCache();
    if (cached) {
      applyWeather(cached.data, cached.locationLabel);
      return;
    }
    void loadGeo();
  }, [applyWeather, loadGeo]);

  async function handleLocationSearch(query: string) {
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
  }

  return (
    <>
      <Header
        pathname="/"
        onLocationSearch={handleLocationSearch}
        searchValue={searchQuery}
        onSearchValueChange={setSearchQuery}
      />
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg space-y-gutter flex-1 w-full pb-8">
        {state.loading && <DashboardSkeleton />}

        {!state.loading && state.error && (
          <ErrorCard
            message={state.error}
            resetAt={state.resetAt}
            onRetry={() => void loadGeo()}
          />
        )}

        {!state.loading &&
          !state.error &&
          state.currentWeather &&
          state.farmAdvisory && (
            <>
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                <WeatherHero data={state.currentWeather} />
                <FarmAdvisory data={state.farmAdvisory} />
              </section>
              <ForecastStrip days={state.forecastDays} />
              <InsightsGrid />
            </>
          )}
      </main>
      <Footer />
    </>
  );
}
