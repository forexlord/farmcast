import { cn } from "@/lib/cn";

type IconProps = {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  filled?: boolean;
};

const sizeClasses = {
  sm: "text-[20px]",
  md: "text-2xl",
  lg: "text-[32px]",
  xl: "text-[120px]",
  hero: "text-[160px]",
} as const;

export function Icon({ name, className, size = "md", filled }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", sizeClasses[size], className)}
      style={
        filled
          ? {
              fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
            }
          : undefined
      }
    >
      {name}
    </span>
  );
}
