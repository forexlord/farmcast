import { DailyForecastCard } from "@/components/forecast/daily-forecast-card";
import type { DailyForecast } from "@/types/ui";

type DailyForecastGridProps = {
  forecasts: DailyForecast[];
};

export function DailyForecastGrid({ forecasts }: DailyForecastGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-stack-md">
      {forecasts.map((forecast) => (
        <DailyForecastCard key={forecast.day} forecast={forecast} />
      ))}
    </div>
  );
}
