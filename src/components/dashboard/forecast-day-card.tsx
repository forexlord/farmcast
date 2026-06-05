import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ForecastDay } from "@/data/dashboard";

type ForecastDayCardProps = {
  day: ForecastDay;
};

const barColorClasses = {
  secondary: "bg-secondary",
  primary: "bg-primary",
  error: "bg-error",
} as const;

const iconColorClasses = {
  secondary: "text-secondary",
  primary: "text-primary",
} as const;

export function ForecastDayCard({ day }: ForecastDayCardProps) {
  return (
    <Card
      variant="high"
      className="min-w-[140px] sm:min-w-[160px] p-3 sm:p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform shrink-0"
    >
      <p className="text-label-md text-on-surface-variant mb-3 uppercase">
        {day.day}
      </p>
      <Icon
        name={day.icon}
        size="lg"
        className={cn("mb-3", iconColorClasses[day.iconColor])}
      />
      <div className="flex flex-col">
        <span className="text-headline-md text-on-surface">{day.high}°</span>
        <span className="text-body-sm text-on-surface-variant">{day.low}°</span>
      </div>
      <div className="mt-3 w-full h-1 bg-surface-container rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            barColorClasses[day.barColor],
            day.barWidth,
          )}
        />
      </div>
    </Card>
  );
}
