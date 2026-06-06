import { DashboardView } from "@/app/dashboard-view";
import { fetchWeatherGeoServer } from "@/lib/weather/server";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "FarmCast | Dashboard",
  description:
    "AI-powered farm weather intelligence with location-aware advisory and 7-day forecast.",
};

export default async function DashboardPage() {
  const requestHeaders = await headers();
  const initialData = await fetchWeatherGeoServer(requestHeaders);
  return <DashboardView initialData={initialData} />;
}
