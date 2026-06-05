"use client";

import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { FarmAdvisory } from "@/components/dashboard/farm-advisory";
import { ForecastStrip } from "@/components/dashboard/forecast-strip";
import { WeatherHero } from "@/components/dashboard/weather-hero";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ErrorCard } from "@/components/ui/error-card";
import { useDashboardWeather } from "@/hooks/use-dashboard-weather";
import type { GeoWeatherResponse } from "@/lib/weather-client";
import { useState } from "react";

type DashboardViewProps = {
  initialData?: GeoWeatherResponse | null;
};

export function DashboardView({ initialData }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { state, loadGeo, retryWeather, searchLocation } =
    useDashboardWeather(initialData);

  return (
    <>
      <Header
        pathname="/"
        onLocationSearch={searchLocation}
        onUseMyLocation={() => void loadGeo()}
        searchValue={searchQuery}
        onSearchValueChange={setSearchQuery}
      />
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg space-y-gutter flex-1 w-full min-w-0 pb-8">
        {state.loading && <DashboardSkeleton />}

        {!state.loading && state.error && (
          <ErrorCard
            message={state.error}
            resetAt={state.resetAt}
            onRetry={() => void retryWeather()}
          />
        )}

        {!state.loading &&
          !state.error &&
          state.currentWeather &&
          state.farmAdvisory && (
            <>
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter min-w-0">
                <WeatherHero data={state.currentWeather} />
                <FarmAdvisory data={state.farmAdvisory} />
              </section>
              <ForecastStrip days={state.forecastDays} />
            </>
          )}
      </main>
      <Footer />
    </>
  );
}
