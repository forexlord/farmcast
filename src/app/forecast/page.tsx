import { ForecastView } from "@/app/forecast/forecast-view";
import { fetchWeatherGeoServer } from "@/lib/weather/server";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "FarmCast | Forecast",
  description:
    "Hourly and 7-day farm weather forecast with risk flags and soil dynamics.",
};

export default async function ForecastPage() {
  const requestHeaders = await headers();
  const initialData = await fetchWeatherGeoServer(requestHeaders);
  return <ForecastView initialData={initialData} />;
}
