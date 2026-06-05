import { ComparisonImage } from "@/components/field-scan/comparison-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { comparisonMeta } from "@/data/field-scan";

export function ComparisonView() {
  return (
    <Card variant="elevated" className="p-stack-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-stack-md">
        <h2 className="text-label-md text-primary uppercase tracking-widest">
          {comparisonMeta.title}
        </h2>
        <Badge className="rounded-full bg-surface-container-highest text-on-surface-variant border-outline-variant self-start sm:self-center">
          {comparisonMeta.badge}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[240px] sm:min-h-[320px] md:h-[400px]">
        <ComparisonImage
          src={comparisonMeta.originalImage}
          alt="Original satellite imagery"
          label={comparisonMeta.originalLabel}
          variant="original"
        />
        <ComparisonImage
          src={comparisonMeta.aiImage}
          alt="AI overlay imagery"
          label={comparisonMeta.aiLabel}
          variant="ai"
          overlayMarkers={comparisonMeta.overlayMarkers}
        />
      </div>
    </Card>
  );
}
