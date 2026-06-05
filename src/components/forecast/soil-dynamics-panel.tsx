import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { SoilDynamicsView } from "@/lib/weather-client";

type SoilDynamicsPanelProps = {
  data: SoilDynamicsView;
};

export function SoilDynamicsPanel({ data }: SoilDynamicsPanelProps) {
  return (
    <Card variant="elevated" className="p-stack-lg">
      <h3 className="text-label-md text-on-surface-variant uppercase tracking-widest mb-4">
        Soil Dynamics
      </h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-body-sm mb-2">
            <span className="text-outline">{data.surfaceMoisture.label}</span>
            <span className="text-primary">{data.surfaceMoisture.value}%</span>
          </div>
          <ProgressBar value={data.surfaceMoisture.value} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {data.metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-surface-container-low p-3 rounded-lg"
            >
              <span className="text-label-md text-outline block mb-1">
                {metric.label}
              </span>
              <span className="text-body-lg font-bold">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
