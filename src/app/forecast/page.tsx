import { AiInsightPanel } from "@/components/forecast/ai-insight-panel";
import { DailyForecastGrid } from "@/components/forecast/daily-forecast-grid";
import { ForecastPageHeader } from "@/components/forecast/forecast-page-header";
import { HourlyChart } from "@/components/forecast/hourly-chart";
import { RiskFlagsPanel } from "@/components/forecast/risk-flags-panel";
import { SoilDynamicsPanel } from "@/components/forecast/soil-dynamics-panel";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detailed Forecast | FarmCast AI",
  description: "Detailed weather forecast and farm intelligence for Northern Valley Sectors",
};

export default function ForecastPage() {
  return (
    <>
      <Header pathname="/forecast" variant="compact" />
      <main className="pt-header pb-8 md:pb-12 px-margin-desktop max-w-container-max mx-auto space-y-stack-lg flex-1 w-full">
        <ForecastPageHeader />

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-8 space-y-gutter">
            <HourlyChart />
            <DailyForecastGrid />
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-gutter">
            <RiskFlagsPanel />
            <AiInsightPanel />
            <SoilDynamicsPanel />
          </aside>
        </div>
      </main>
      <Footer variant="stacked" />
    </>
  );
}
