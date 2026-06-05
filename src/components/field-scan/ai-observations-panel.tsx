import { ObservationItem } from "@/components/field-scan/observation-item";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { observations } from "@/data/field-scan";

export function AiObservationsPanel() {
  return (
    <Card variant="elevated" className="p-stack-lg ai-insight-panel">
      <div className="flex items-center gap-2 mb-stack-md">
        <Icon name="psychology" className="text-primary" />
        <h2 className="text-label-md text-primary uppercase tracking-widest">
          AI Observations & Action Items
        </h2>
      </div>
      <ul className="space-y-stack-md">
        {observations.map((observation) => (
          <ObservationItem key={observation.title} observation={observation} />
        ))}
      </ul>
    </Card>
  );
}
