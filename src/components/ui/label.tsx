import { cn } from "@/lib/cn";
import type { LabelHTMLAttributes, ReactNode } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
};

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-label-md text-on-surface-variant mb-1 block",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
