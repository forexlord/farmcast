import { LegendDot } from "@/components/ui/legend-dot";
import { cn } from "@/lib/cn";

type Segment = {
  label: string;
  value: number;
  color: "primary" | "secondary" | "error";
};

type SegmentedBarProps = {
  segments: Segment[];
  className?: string;
};

const barColorClasses = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary text-on-secondary",
  error: "bg-error text-on-error",
} as const;

export function SegmentedBar({ segments, className }: SegmentedBarProps) {
  return (
    <div className={className}>
      <div className="h-8 w-full flex rounded-full overflow-hidden mb-4">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={cn(
              "h-full flex items-center justify-center text-[10px] font-bold",
              barColorClasses[segment.color],
            )}
            style={{ width: `${segment.value}%` }}
          >
            {segment.value}%
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-label-md">
        {segments.map((segment) => (
          <LegendDot key={segment.label} color={segment.color} label={segment.label} />
        ))}
      </div>
    </div>
  );
}
