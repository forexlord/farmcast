import { RiskFlagItem } from "@/components/forecast/risk-flag-item";
import { Card } from "@/components/ui/card";
import { riskFlags } from "@/data/forecast";

export function RiskFlagsPanel() {
  return (
    <Card variant="elevated" className="p-stack-lg">
      <h3 className="text-label-md text-on-surface-variant uppercase tracking-widest mb-6">
        Critical Risk Flags
      </h3>
      <div className="space-y-4">
        {riskFlags.map((flag) => (
          <RiskFlagItem key={flag.title} flag={flag} />
        ))}
      </div>
    </Card>
  );
}
