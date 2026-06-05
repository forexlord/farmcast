import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { FarmAdvisoryView } from "@/lib/weather-client";

type FarmAdvisoryProps = {
  data: FarmAdvisoryView;
};

export function FarmAdvisory({ data }: FarmAdvisoryProps) {
  return (
    <Card
      variant="advisory"
      className="lg:col-span-4 p-stack-lg relative overflow-hidden flex flex-col min-w-0"
    >
      <div className="hatch-pattern absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <Icon name="energy_savings_leaf" />
          </div>
          <h2 className="text-headline-md text-primary">AI Summary</h2>
        </div>
        {data.aiUnavailable && (
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
            AI insights temporarily unavailable
          </p>
        )}
        <p className="text-body-md text-on-surface leading-relaxed">
          {data.message}
        </p>
      </div>

      {data.actionRequired && (
        <div className="relative z-10 mt-6">
          <Badge className="self-start">Action Required</Badge>
        </div>
      )}
    </Card>
  );
}
