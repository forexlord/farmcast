import { cn } from "@/lib/cn";
import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface resize-none",
        "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all",
        className,
      )}
      {...props}
    />
  );
}
