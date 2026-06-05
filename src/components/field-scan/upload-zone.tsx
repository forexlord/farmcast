"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useState } from "react";

type UploadZoneProps = {
  icon: string;
  browseLabel: string;
  hint: string;
};

export function UploadZone({ icon, browseLabel, hint }: UploadZoneProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "complete">(
    "idle",
  );
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(false);
    setStatus("processing");
    setTimeout(() => setStatus("complete"), 1500);
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed border-primary/40 bg-primary/5 rounded-xl p-stack-lg",
        "flex flex-col items-center justify-center text-center cursor-pointer",
        "hover:bg-primary/10 transition-all duration-300 group",
        isDragging && "bg-primary/20 border-primary",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-stack-md group-hover:scale-110 transition-transform">
        <Icon name={icon} size="lg" className="text-primary" />
      </div>
      {status === "idle" && (
        <>
          <p className="text-body-md text-on-surface font-semibold">
            Drag farm imagery here or{" "}
            <span className="text-primary underline">{browseLabel}</span>
          </p>
          <p className="text-body-sm text-on-surface-variant mt-2">{hint}</p>
        </>
      )}
      {status === "processing" && (
        <p className="text-body-md text-on-surface font-semibold">
          Processing &quot;Field_Orchard_May.tiff&quot;...
        </p>
      )}
      {status === "complete" && (
        <p className="text-body-md text-primary font-semibold">
          Upload Complete. Analyzing...
        </p>
      )}
    </div>
  );
}
