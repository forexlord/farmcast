import { DailyForecastCard } from "@/components/forecast/daily-forecast-card";
import { dailyForecasts } from "@/data/forecast";

export function DailyForecastGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-stack-md">
      {dailyForecasts.map((forecast) => (
        <DailyForecastCard key={forecast.day} forecast={forecast} />
      ))}
    </div>
  );
}
