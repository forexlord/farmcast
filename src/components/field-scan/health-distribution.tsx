import { Card } from "@/components/ui/card";
import { SegmentedBar } from "@/components/ui/segmented-bar";
import { healthDistribution } from "@/data/field-scan";

export function HealthDistribution() {
  return (
    <Card variant="elevated" className="col-span-1 md:col-span-2 p-stack-lg">
      <h3 className="text-label-md text-on-surface-variant mb-stack-sm">
        Health Distribution
      </h3>
      <SegmentedBar segments={healthDistribution.segments} />
    </Card>
  );
}
