import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "icon" | "fab" | "outline" | "surface";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:opacity-90 transition-all",
  ghost: "text-primary hover:text-primary-fixed-dim transition-colors",
  icon: "text-primary p-2 hover:bg-surface-container-highest rounded-full transition-colors",
  fab: "bg-primary text-on-primary shadow-lg hover:scale-110 active:scale-95 transition-transform",
  outline:
    "border border-outline-variant text-on-surface hover:bg-surface-container-high transition-all",
  surface:
    "bg-surface-container-highest border border-primary/40 text-primary hover:bg-primary/10 transition-colors",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-label-md rounded-full",
  md: "px-4 py-2 text-label-md rounded-lg",
  lg: "w-14 h-14 rounded-full",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium",
        variantClasses[variant],
        variant !== "icon" && variant !== "fab" && sizeClasses[size],
        variant === "icon" && "p-2",
        variant === "surface" && "w-full py-3",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
