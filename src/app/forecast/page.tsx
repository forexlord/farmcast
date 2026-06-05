"use client";

import { AiInsightPanel } from "@/components/forecast/ai-insight-panel";
import { DailyForecastGrid } from "@/components/forecast/daily-forecast-grid";
import { ForecastPageHeader } from "@/components/forecast/forecast-page-header";
import { HourlyChart } from "@/components/forecast/hourly-chart";
import { RiskFlagsPanel } from "@/components/forecast/risk-flags-panel";
import { SoilDynamicsPanel } from "@/components/forecast/soil-dynamics-panel";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DailyForecast, RiskFlag } from "@/types/ui";
import {
  buildForecastSubtitle,
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
  extractCoords,
  setWeatherCache,
  type AiInsightView,
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

function ForecastSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-gutter animate-pulse">
      <div className="col-span-12 lg:col-span-8 space-y-gutter">
        <Card variant="elevated" className="p-stack-lg h-[420px]">{null}</Card>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-stack-md">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} variant="elevated" className="h-40">{null}</Card>
          ))}
        </div>
      </div>
      <aside className="col-span-12 lg:col-span-4 space-y-gutter">
        <Card variant="elevated" className="p-stack-lg h-64">{null}</Card>
        <Card variant="elevated" className="p-stack-lg h-56">{null}</Card>
        <Card variant="elevated" className="p-stack-lg h-48">{null}</Card>
      </aside>
    </div>
  );
}

function getInitialForecastState(): ForecastState {
  const cached = getWeatherCache();
  if (cached) {
    return {
      loading: false,
      error: null,
      subtitle: buildForecastSubtitle(cached.data, cached.locationLabel),
      hourlyChart: mapHourlyChart(cached.data),
      dailyForecasts: mapDailyForecasts(cached.data),
      riskFlags: mapRiskFlags(cached.data),
      aiInsight: mapAiInsight(cached.data),
      soilDynamics: mapSoilDynamics(cached.data),
    };
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

export default function ForecastPage() {
  const [state, setState] = useState<ForecastState>(getInitialForecastState);

  const applyForecastData = useCallback(
    (data: Awaited<ReturnType<typeof getWeather>>, locationLabel?: string) => {
      setWeatherCache(data, locationLabel);
      setState({
        loading: false,
        error: null,
        subtitle: buildForecastSubtitle(data, locationLabel),
        hourlyChart: mapHourlyChart(data),
        dailyForecasts: mapDailyForecasts(data),
        riskFlags: mapRiskFlags(data),
        aiInsight: mapAiInsight(data),
        soilDynamics: mapSoilDynamics(data),
      });
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
  }, [applyForecastData]);

  useEffect(() => {
    const cached = getWeatherCache();
    if (cached) {
      applyForecastData(cached.data, cached.locationLabel);
      return;
    }
    void loadForecast();
  }, [applyForecastData, loadForecast]);

  return (
    <>
      <Header pathname="/forecast" variant="compact" />
      <main className="pt-header pb-8 md:pb-12 px-margin-desktop max-w-container-max mx-auto space-y-stack-lg flex-1 w-full">
        <ForecastPageHeader
          title="Detailed Weather Forecast"
          subtitle={state.subtitle}
        />

        {state.loading && <ForecastSkeleton />}

        {!state.loading && state.error && (
          <Card variant="elevated" className="p-stack-lg">
            <Badge variant="error" className="mb-4">
              Error
            </Badge>
            <p className="text-body-md text-on-surface mb-2">{state.error}</p>
            {state.resetAt && (
              <p className="text-body-sm text-on-surface-variant mb-4">
                Quota resets:{" "}
                {new Date(Number(state.resetAt) * 1000).toLocaleString()}
              </p>
            )}
            <Button onClick={() => void loadForecast()}>Retry</Button>
          </Card>
        )}

        {!state.loading &&
          !state.error &&
          state.hourlyChart &&
          state.aiInsight &&
          state.soilDynamics && (
            <div className="grid grid-cols-12 gap-gutter">
              <div className="col-span-12 lg:col-span-8 space-y-gutter">
                <HourlyChart data={state.hourlyChart} />
                <DailyForecastGrid forecasts={state.dailyForecasts} />
              </div>

              <aside className="col-span-12 lg:col-span-4 space-y-gutter">
                <RiskFlagsPanel flags={state.riskFlags} />
                <AiInsightPanel insight={state.aiInsight} />
                <SoilDynamicsPanel data={state.soilDynamics} />
              </aside>
            </div>
          )}
      </main>
      <Footer variant="stacked" />
    </>
  );
}
