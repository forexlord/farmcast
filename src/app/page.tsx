import { DashboardView } from "@/app/dashboard-view";
import { fetchWeatherGeoServer } from "@/lib/weather/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FarmCast | Dashboard",
  description:
    "AI-powered farm weather intelligence with location-aware advisory and 7-day forecast.",
};

export default async function DashboardPage() {
  const initialData = await fetchWeatherGeoServer();
  return <DashboardView initialData={initialData} />;
}
