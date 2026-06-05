import { Fab } from "@/components/dashboard/fab";
import { FarmAdvisory } from "@/components/dashboard/farm-advisory";
import { ForecastStrip } from "@/components/dashboard/forecast-strip";
import { InsightsGrid } from "@/components/dashboard/insights-grid";
import { WeatherHero } from "@/components/dashboard/weather-hero";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function DashboardPage() {
  return (
    <>
      <Header pathname="/" />
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg space-y-gutter flex-1 w-full pb-20 sm:pb-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <WeatherHero />
          <FarmAdvisory />
        </section>
        <ForecastStrip />
        <InsightsGrid />
      </main>
      <Footer />
      <Fab />
    </>
  );
}
