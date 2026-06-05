import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number;
  className?: string;
  barClassName?: string;
};

export function ProgressBar({ value, className, barClassName }: ProgressBarProps) {
  return (
    <div
      className={cn(
        "h-2 w-full bg-surface-container-highest rounded-full overflow-hidden",
        className,
      )}
    >
      <div
        className={cn("h-full bg-primary rounded-full", barClassName)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
