import { Label } from "@/components/ui/label";
import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="group">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
