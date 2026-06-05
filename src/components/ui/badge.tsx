import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "stable"
  | "error"
  | "danger"
  | "caution";

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  stable: "bg-primary/10 text-primary border-primary/20",
  error: "bg-error/10 text-error border-error/20",
  danger: "bg-error text-on-error font-bold",
  caution: "bg-secondary text-on-secondary font-bold",
};

export function Badge({
  variant = "primary",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-label-md px-3 py-1 rounded-full border",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
