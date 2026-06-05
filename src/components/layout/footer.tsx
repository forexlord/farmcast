"use client";

import { getLastSyncLabel } from "@/lib/weather-client";

type FooterProps = {
  variant?: "inline" | "stacked";
};

export function Footer({ variant = "inline" }: FooterProps) {
  const lastSync = getLastSyncLabel();
  const syncText = lastSync
    ? `Data Source: WeatherAI • Last sync: ${lastSync}`
    : "Data Source: WeatherAI";

  return (
    <footer className="bg-background border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center py-stack-lg px-margin-desktop w-full max-w-container-max mx-auto gap-4 text-center md:text-left">
        {variant === "inline" ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-label-md text-primary shrink-0">FarmCast</span>
            <span className="text-body-sm text-on-surface-variant">{syncText}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-label-md text-primary">
              FarmCast AI Intelligence
            </span>
            <p className="text-body-sm text-on-surface-variant">{syncText}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
