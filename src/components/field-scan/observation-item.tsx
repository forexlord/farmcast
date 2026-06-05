import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Observation } from "@/data/field-scan";

type ObservationItemProps = {
  observation: Observation;
};

const borderClasses = {
  primary: "border-primary",
  secondary: "border-secondary",
  error: "border-error",
} as const;

const iconClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  error: "text-error",
} as const;

export function ObservationItem({ observation }: ObservationItemProps) {
  return (
    <li
      className={cn(
        "flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-surface-container-high border-l-4",
        borderClasses[observation.severity],
      )}
    >
      <Icon
        name={observation.icon}
        className={cn("mt-1", iconClasses[observation.severity])}
      />
      <div>
        <p className="text-body-md font-bold text-on-surface">
          {observation.title}
        </p>
        <p className="text-body-sm text-on-surface-variant mt-1">
          {observation.detail}
        </p>
      </div>
    </li>
  );
}
