import { cn } from "@/lib/cn";

type LegendDotProps = {
  color: "primary" | "secondary" | "error";
  label: string;
};

const colorClasses = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  error: "bg-error",
} as const;

export function LegendDot({ color, label }: LegendDotProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-3 h-3 rounded-full", colorClasses[color])} />
      <span className="text-label-md text-on-surface-variant uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
