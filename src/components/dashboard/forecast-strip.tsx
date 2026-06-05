import { ForecastDayCard } from "@/components/dashboard/forecast-day-card";
import { forecastDays } from "@/data/dashboard";
import Link from "next/link";

export function ForecastStrip() {
  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-stack-md">
        <h3 className="text-headline-md text-on-surface">7-Day Outlook</h3>
        <Link
          href="/forecast"
          className="text-primary text-label-md hover:underline shrink-0"
        >
          View Detailed Trends
        </Link>
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-1 px-1">
        {forecastDays.map((day) => (
          <ForecastDayCard key={day.day} day={day} />
        ))}
      </div>
    </section>
  );
}
