import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { DailyForecast } from "@/types/ui";

type DailyForecastCardProps = {
  forecast: DailyForecast;
};

const iconColorClasses = {
  primary: "text-primary",
  error: "text-error",
} as const;

export function DailyForecastCard({ forecast }: DailyForecastCardProps) {
  const rainIsHigh = forecast.rain.includes("92");

  return (
    <Card
      variant="default"
      className="p-4 hover:border-primary transition-all group"
    >
      <span
        className={cn(
          "text-label-md block mb-3 uppercase",
          forecast.dayColor === "primary"
            ? "text-primary"
            : "text-on-surface-variant",
        )}
      >
        {forecast.day}
      </span>
      <Icon
        name={forecast.icon}
        size="lg"
        filled={forecast.filled}
        className={cn(
          "mb-2 block group-hover:scale-110 transition-transform",
          iconColorClasses[forecast.iconColor ?? "primary"],
        )}
      />
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-headline-md">{forecast.high}°</span>
        <span className="text-body-sm text-outline">{forecast.low}°</span>
      </div>
      <div className="space-y-1">
        <MetricRow label="Rain" value={forecast.rain} highlight={rainIsHigh} />
        <MetricRow label="Wind" value={forecast.wind} />
      </div>
    </Card>
  );
}

function MetricRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-body-sm">
      <span className="text-outline">{label}</span>
      <span
        className={cn(
          highlight ? "text-error font-bold" : "text-on-surface",
        )}
      >
        {value}
      </span>
    </div>
  );
}
