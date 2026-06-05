"use client";

import { AiInsightPanel } from "@/components/forecast/ai-insight-panel";
import { DailyForecastGrid } from "@/components/forecast/daily-forecast-grid";
import { ForecastPageHeader } from "@/components/forecast/forecast-page-header";
import { ForecastSkeleton } from "@/components/forecast/forecast-skeleton";
import { HourlyChart } from "@/components/forecast/hourly-chart";
import { RiskFlagsPanel } from "@/components/forecast/risk-flags-panel";
import { SoilDynamicsPanel } from "@/components/forecast/soil-dynamics-panel";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ErrorCard } from "@/components/ui/error-card";
import { useForecastWeather } from "@/hooks/use-forecast-weather";
import type { GeoWeatherResponse } from "@/lib/weather-client";

type ForecastViewProps = {
  initialData?: GeoWeatherResponse | null;
};

export function ForecastView({ initialData }: ForecastViewProps) {
  const { state, loadForecast, loadGeo } = useForecastWeather(initialData);

  return (
    <>
      <Header
        pathname="/forecast"
        variant="compact"
        onUseMyLocation={() => void loadGeo()}
      />
      <main className="pt-header pb-8 md:pb-12 px-margin-desktop max-w-container-max mx-auto space-y-stack-lg flex-1 w-full">
        <ForecastPageHeader
          title="Detailed Weather Forecast"
          subtitle={state.subtitle}
        />

        {state.loading && <ForecastSkeleton />}

        {!state.loading && state.error && (
          <ErrorCard
            message={state.error}
            resetAt={state.resetAt}
            onRetry={() => void loadForecast()}
          />
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
