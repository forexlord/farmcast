import { ObservationItem } from "@/components/field-scan/observation-item";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { Observation } from "@/types/ui";

type AiObservationsPanelProps = {
  observations: Observation[];
  notice?: string;
};

export function AiObservationsPanel({
  observations,
  notice,
}: AiObservationsPanelProps) {
  return (
    <Card variant="elevated" className="p-stack-lg ai-insight-panel">
      <div className="flex items-center gap-2 mb-stack-md">
        <Icon name="psychology" className="text-primary" />
        <h2 className="text-label-md text-primary uppercase tracking-widest">
          AI Observations & Action Items
        </h2>
      </div>
      {notice && (
        <p className="text-body-sm text-on-surface-variant mb-stack-md border-l-2 border-outline-variant pl-3">
          {notice}
        </p>
      )}
      {observations.length > 0 && (
        <ul className="space-y-stack-md">
          {observations.map((observation) => (
            <ObservationItem
              key={`${observation.title}-${observation.detail}`}
              observation={observation}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
