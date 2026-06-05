"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useRef } from "react";

type UploadZoneProps = {
  icon: string;
  browseLabel: string;
  hint: string;
  status: "idle" | "processing" | "complete" | "error";
  statusMessage?: string;
  fileName?: string;
  onFileSelect: (file: File) => void;
};

export function UploadZone({
  icon,
  browseLabel,
  hint,
  status,
  statusMessage,
  fileName,
  onFileSelect,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFileSelect(file);
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed border-primary/40 bg-primary/5 rounded-xl p-stack-lg",
        "flex flex-col items-center justify-center text-center cursor-pointer",
        "hover:bg-primary/10 transition-all duration-300 group",
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/tiff,.tif,.tiff"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
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
          {fileName && (
            <p className="text-body-sm text-primary mt-2">{fileName}</p>
          )}
        </>
      )}
      {status === "processing" && (
        <p className="text-body-md text-on-surface font-semibold">
          {statusMessage ?? `Processing "${fileName ?? "image"}"...`}
        </p>
      )}
      {status === "complete" && (
        <p className="text-body-md text-primary font-semibold">
          {statusMessage ?? "Upload Complete. Analyzing..."}
        </p>
      )}
      {status === "error" && (
        <p className="text-body-md text-error font-semibold">
          {statusMessage ?? "Analysis failed"}
        </p>
      )}
    </div>
  );
}
