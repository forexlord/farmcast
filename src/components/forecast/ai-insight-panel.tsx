import { Icon } from "@/components/ui/icon";
import type { AiInsightView } from "@/lib/weather-client";

type AiInsightPanelProps = {
  insight: AiInsightView;
};

export function AiInsightPanel({ insight }: AiInsightPanelProps) {
  const parts = insight.message.split(insight.highlight);

  return (
    <div className="ai-insight-panel border border-primary/20 rounded-xl p-stack-lg relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="eco" className="text-primary" />
          <h3 className="text-label-md text-primary font-semibold">
            FarmCast Intelligence
          </h3>
        </div>
        <p className="text-body-md text-on-surface leading-relaxed">
          {parts[0]}
          <strong className="text-primary">{insight.highlight}</strong>
          {parts[1]}
        </p>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
        <Icon name="psychology" size="xl" className="text-primary" />
      </div>
    </div>
  );
}
