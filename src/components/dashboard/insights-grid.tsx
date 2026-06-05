import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import {
  forecastAccuracy,
  satelliteScan,
  soilMetrics,
} from "@/data/dashboard";
import Image from "next/image";

export function InsightsGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      <Card variant="low" className="p-stack-md flex flex-col">
        <h4 className="text-label-md text-on-surface-variant uppercase mb-4">
          Soil Risk Index
        </h4>
        <div className="flex items-center justify-between mb-4">
          <span className="text-headline-md text-on-surface">
            {soilMetrics.riskLevel}
          </span>
          <Badge variant="stable">{soilMetrics.status}</Badge>
        </div>
        <div className="flex-1 bg-surface-container rounded-lg p-3">
          <MetricBar
            label={soilMetrics.nitrogen.label}
            value={soilMetrics.nitrogen.value}
            width={soilMetrics.nitrogen.width}
            valueColor="text-primary"
            barColor="bg-primary"
          />
          <MetricBar
            label={soilMetrics.potassium.label}
            value={soilMetrics.potassium.value}
            width={soilMetrics.potassium.width}
            valueColor="text-secondary"
            barColor="bg-secondary"
            className="mt-3"
          />
        </div>
      </Card>

      <Card variant="interactive" className="p-stack-md relative">
        <Image
          src={satelliteScan.imageUrl}
          alt="Field overview"
          fill
          className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="relative z-10 flex flex-col h-full justify-between min-h-[180px]">
          <div>
            <h4 className="text-label-md text-on-surface mb-2">
              {satelliteScan.title}
            </h4>
            <p className="text-body-sm text-on-surface-variant">
              Update: {satelliteScan.updatedAt}
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary text-label-md">
            <span>{satelliteScan.linkLabel}</span>
            <Icon name="arrow_forward" size="sm" />
          </div>
        </div>
      </Card>

      <Card variant="low" className="p-stack-md flex flex-col justify-between">
        <div>
          <h4 className="text-label-md text-on-surface-variant uppercase mb-4">
            AI Forecast Accuracy
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg md:text-display-lg text-primary">
              {forecastAccuracy.value}%
            </span>
            <span className="text-body-sm text-on-surface-variant">
              {forecastAccuracy.delta}
            </span>
          </div>
        </div>
        <div className="flex gap-1 items-end h-16">
          {forecastAccuracy.bars.map((height, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-t-sm",
                index === forecastAccuracy.bars.length - 1
                  ? "bg-primary"
                  : "bg-primary/20",
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </Card>
    </section>
  );
}

type MetricBarProps = {
  label: string;
  value: string;
  width: string;
  valueColor: string;
  barColor: string;
  className?: string;
};

function MetricBar({
  label,
  value,
  width,
  valueColor,
  barColor,
  className,
}: MetricBarProps) {
  return (
    <div className={className}>
      <div className="flex justify-between text-body-sm mb-2">
        <span>{label}</span>
        <span className={valueColor}>{value}</span>
      </div>
      <div className="w-full bg-background h-2 rounded-full">
        <div className={cn("h-full rounded-full", barColor, width)} />
      </div>
    </div>
  );
}
