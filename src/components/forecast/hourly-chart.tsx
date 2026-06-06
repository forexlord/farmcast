"use client";

import { Card } from "@/components/ui/card";
import { LegendDot } from "@/components/ui/legend-dot";
import type { HourlyChartView } from "@/lib/weather-client";
import { useCallback, useEffect, useRef, useState } from "react";

type HourlyChartProps = {
  data: HourlyChartView;
};

function findNearestIndex(
  points: HourlyChartView["points"],
  xPercent: number,
): number {
  if (points.length === 0) return 0;

  let nearest = 0;
  let minDistance = Infinity;

  points.forEach((point, index) => {
    const distance = Math.abs(point.x - xPercent);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = index;
    }
  });

  return nearest;
}

export function HourlyChart({ data }: HourlyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(data.defaultIndex);

  useEffect(() => {
    setActiveIndex(data.defaultIndex);
  }, [data.defaultIndex]);

  const updateActivePoint = useCallback(
    (clientX: number) => {
      const rect = chartRef.current?.getBoundingClientRect();
      if (!rect || data.points.length === 0) return;

      const xRatio = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1,
      );
      setActiveIndex(findNearestIndex(data.points, xRatio * 100));
    },
    [data.points],
  );

  const activePoint =
    data.points[activeIndex] ?? data.points[data.defaultIndex];

  if (!activePoint) {
    return null;
  }

  return (
    <Card variant="elevated" className="p-stack-lg overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-stack-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
          <h2 className="text-headline-md shrink-0">{data.title}</h2>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {data.legend.map((item) => (
              <LegendDot
                key={item.label}
                color={item.color}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="text-label-md text-on-surface-variant shrink-0">
          {data.status}
        </div>
      </div>

      <div className="h-[260px] sm:h-[320px] md:h-[400px] w-full relative pt-4">
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-body-sm text-outline pr-2 sm:pr-4 border-r border-outline-variant">
          {data.yAxisLabels.map((label) => (
            <span key={label} className="text-xs sm:text-body-sm">
              {label}
            </span>
          ))}
        </div>

        <div
          ref={chartRef}
          className="ml-8 sm:ml-10 h-full relative chart-container cursor-crosshair"
          onMouseMove={(event) => updateActivePoint(event.clientX)}
          onMouseLeave={() => setActiveIndex(data.defaultIndex)}
          onTouchMove={(event) => {
            const touch = event.touches[0];
            if (touch) updateActivePoint(touch.clientX);
          }}
          onTouchEnd={() => setActiveIndex(data.defaultIndex)}
        >
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {data.yAxisLabels.map((label) => (
              <div
                key={label}
                className="h-px w-full bg-outline-variant opacity-20"
              />
            ))}
          </div>

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <line
              x1={activePoint.x}
              x2={activePoint.x}
              y1="0"
              y2="100"
              stroke="var(--color-primary)"
              strokeOpacity="0.25"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <path
              className="drop-shadow-[0_0_8px_rgba(152,229,94,0.4)]"
              d={data.temperaturePath}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
            {data.points.map((point, index) => (
              <circle
                key={`${point.time}-${index}`}
                cx={point.x}
                cy={point.y}
                fill="var(--color-primary)"
                r={index === activeIndex ? "2.5" : "0"}
                opacity={index === activeIndex ? 1 : 0}
              />
            ))}
          </svg>

          <div
            className="absolute -translate-x-1/2 -translate-y-full mb-3 bg-surface-container-highest border border-primary p-2 sm:p-3 rounded-lg shadow-2xl z-10 pointer-events-none transition-[left,top] duration-75"
            style={{
              left: `${activePoint.x}%`,
              top: `${activePoint.y}%`,
            }}
          >
            <div className="text-label-md text-primary mb-1 whitespace-nowrap">
              {activePoint.time}
            </div>
            <div className="text-headline-md text-on-surface whitespace-nowrap">
              {activePoint.temperature}°C
            </div>
            <div className="text-body-sm text-secondary whitespace-nowrap">
              {activePoint.precip}% Precip Chance
            </div>
          </div>
        </div>

        <div className="ml-8 sm:ml-10 mt-4 flex justify-between text-[10px] sm:text-label-md text-outline gap-1 pointer-events-none">
          {data.xAxisLabels.map((label) => (
            <span key={label} className="truncate">
              {label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
