import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

type CardVariant =
  | "default"
  | "elevated"
  | "low"
  | "high"
  | "advisory"
  | "interactive";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  children: ReactNode;
};

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface-container border-outline-variant",
  elevated: "bg-surface-container border-outline-variant",
  low: "bg-surface-container-low border-outline-variant",
  high: "bg-surface-container-high border-outline-variant hover:border-primary transition-all cursor-pointer",
  advisory: "bg-surface-container border-primary/30 ai-gradient-glow",
  interactive:
    "bg-surface-container-low border-outline-variant group cursor-pointer overflow-hidden",
};

export function Card({
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "border rounded-xl",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
