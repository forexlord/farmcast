import { ComparisonImage } from "@/components/field-scan/comparison-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ComparisonViewData } from "@/lib/weather-client";

type ComparisonViewProps = {
  data: ComparisonViewData;
};

export function ComparisonView({ data }: ComparisonViewProps) {
  return (
    <Card variant="elevated" className="p-stack-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-stack-md">
        <h2 className="text-label-md text-primary uppercase tracking-widest">
          {data.title}
        </h2>
        <Badge className="rounded-full bg-surface-container-highest text-on-surface-variant border-outline-variant self-start sm:self-center">
          {data.badge}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[240px] sm:min-h-[320px] md:h-[400px]">
        <ComparisonImage
          src={data.originalImage}
          alt="Original satellite imagery"
          label={data.originalLabel}
          variant="original"
        />
        <ComparisonImage
          src={data.aiImage}
          alt="AI overlay imagery"
          label={data.aiLabel}
          variant="ai"
          overlayMarkers={data.overlayMarkers}
        />
      </div>
    </Card>
  );
}
