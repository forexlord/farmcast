import { Card } from "@/components/ui/card";
import { LegendDot } from "@/components/ui/legend-dot";
import { hourlyChart } from "@/data/forecast";

export function HourlyChart() {
  return (
    <Card variant="elevated" className="p-stack-lg overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-stack-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
          <h2 className="text-headline-md shrink-0">{hourlyChart.title}</h2>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {hourlyChart.legend.map((item) => (
              <LegendDot key={item.label} color={item.color} label={item.label} />
            ))}
          </div>
        </div>
        <div className="text-label-md text-on-surface-variant shrink-0">
          {hourlyChart.status}
        </div>
      </div>

      <div className="h-[260px] sm:h-[320px] md:h-[400px] w-full relative pt-4">
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-body-sm text-outline pr-2 sm:pr-4 border-r border-outline-variant">
          {hourlyChart.yAxisLabels.map((label) => (
            <span key={label} className="text-xs sm:text-body-sm">
              {label}
            </span>
          ))}
        </div>

        <div className="ml-8 sm:ml-10 h-full relative chart-container">
          <div className="absolute inset-0 flex flex-col justify-between">
            {hourlyChart.yAxisLabels.map((label) => (
              <div
                key={label}
                className="h-px w-full bg-outline-variant opacity-20"
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-end gap-0.5 sm:gap-1 px-2 sm:px-4">
            {hourlyChart.precipBars.map((height, index) => (
              <div
                key={index}
                className="w-full bg-secondary opacity-20 rounded-t-sm"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              className="drop-shadow-[0_0_8px_rgba(152,229,94,0.4)]"
              d={hourlyChart.temperaturePath}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
            <circle
              cx={hourlyChart.peakPoint.x}
              cy={hourlyChart.peakPoint.y}
              fill="var(--color-primary)"
              r="1.5"
            />
          </svg>

          <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-full mb-4 bg-surface-container-highest border border-primary p-2 sm:p-3 rounded-lg shadow-2xl z-10 pointer-events-none hidden sm:block">
            <div className="text-label-md text-primary mb-1">
              {hourlyChart.tooltip.time}
            </div>
            <div className="text-headline-md text-on-surface">
              {hourlyChart.tooltip.temperature}
            </div>
            <div className="text-body-sm text-secondary">
              {hourlyChart.tooltip.precip}
            </div>
          </div>
        </div>

        <div className="ml-8 sm:ml-10 mt-4 flex justify-between text-[10px] sm:text-label-md text-outline gap-1">
          {hourlyChart.xAxisLabels.map((label) => (
            <span key={label} className="truncate">
              {label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
