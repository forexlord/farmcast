import { Card } from "@/components/ui/card";
import { SegmentedBar } from "@/components/ui/segmented-bar";
import type { HealthDistributionView } from "@/lib/weather-client";

type HealthDistributionProps = {
  data: HealthDistributionView;
};

export function HealthDistribution({ data }: HealthDistributionProps) {
  return (
    <Card variant="elevated" className="col-span-1 md:col-span-2 p-stack-lg">
      <h3 className="text-label-md text-on-surface-variant mb-stack-sm">
        Health Distribution
      </h3>
      <SegmentedBar segments={data.segments} />
    </Card>
  );
}
