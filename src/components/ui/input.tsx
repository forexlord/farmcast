import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";
import { Icon } from "./icon";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: string;
};

export function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <Icon
          name={icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
      )}
      <input
        className={cn(
          "w-full bg-surface-container-low border border-outline-variant rounded-lg text-on-surface",
          "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all",
          icon ? "py-2 pr-4 pl-10 text-body-sm" : "px-4 py-3",
          className,
        )}
        {...props}
      />
    </div>
  );
}
