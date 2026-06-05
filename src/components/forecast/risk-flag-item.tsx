import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { RiskFlag } from "@/data/forecast";

type RiskFlagItemProps = {
  flag: RiskFlag;
};

const containerClasses = {
  danger: "bg-error-container/20 border-error/30",
  caution: "bg-secondary-container/10 border-secondary/30",
} as const;

const iconClasses = {
  danger: "text-error",
  caution: "text-secondary",
} as const;

const titleClasses = {
  danger: "text-error",
  caution: "text-secondary",
} as const;

const detailClasses = {
  danger: "text-on-error-container",
  caution: "text-secondary-fixed",
} as const;

export function RiskFlagItem({ flag }: RiskFlagItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg",
        containerClasses[flag.severity],
      )}
    >
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <Icon
          name={flag.icon}
          className={cn("shrink-0", iconClasses[flag.severity])}
        />
        <div className="min-w-0">
          <span
            className={cn(
              "text-body-md font-bold block",
              titleClasses[flag.severity],
            )}
          >
            {flag.title}
          </span>
          <span className={cn("text-body-sm", detailClasses[flag.severity])}>
            {flag.detail}
          </span>
        </div>
      </div>
      <Badge variant={flag.severity} className="self-start sm:self-center shrink-0">
        {flag.severity === "danger" ? "DANGER" : "CAUTION"}
      </Badge>
    </div>
  );
}
