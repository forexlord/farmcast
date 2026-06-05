"use client";

import { AiObservationsPanel } from "@/components/field-scan/ai-observations-panel";
import { ComparisonView } from "@/components/field-scan/comparison-view";
import { FieldScanPageHeader } from "@/components/field-scan/field-scan-page-header";
import { FieldStats } from "@/components/field-scan/field-stats";
import { HealthDistribution } from "@/components/field-scan/health-distribution";
import { ImageryUpload } from "@/components/field-scan/imagery-upload";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { Observation } from "@/data/field-scan";
import {
  analyzeField,
  isApiError,
  isNoTreesDetected,
  loadCoords,
  mapFieldScanResults,
  NO_TREES_MESSAGE,
  type ComparisonViewData,
  type FieldStatsView,
  type HealthDistributionView,
} from "@/lib/weather-client";
import { useState } from "react";

type UploadStatus = "idle" | "processing" | "complete" | "error";

const GEMINI_UNAVAILABLE_NOTICE = "AI insights temporarily unavailable";

export default function FieldScanPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [hasResults, setHasResults] = useState(false);
  const [noTreesWarning, setNoTreesWarning] = useState<string | null>(null);
  const [geminiUnavailable, setGeminiUnavailable] = useState(false);
  const [comparison, setComparison] = useState<ComparisonViewData | null>(null);
  const [health, setHealth] = useState<HealthDistributionView | null>(null);
  const [stats, setStats] = useState<FieldStatsView | null>(null);
  const [scanObservations, setScanObservations] = useState<Observation[]>([]);

  function resetResults() {
    setHasResults(false);
    setNoTreesWarning(null);
    setGeminiUnavailable(false);
    setComparison(null);
    setHealth(null);
    setStats(null);
    setScanObservations([]);
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      setUploadStatus("error");
      setStatusMessage("Please upload an image before analyzing.");
      return;
    }

    setError(null);
    resetResults();
    setUploadStatus("processing");
    setStatusMessage(`Processing "${selectedFile.name}"...`);

    const formData = new FormData();
    formData.append("image", selectedFile);

    const coords = loadCoords();
    if (coords) {
      const location = [coords.city, coords.region].filter(Boolean).join(", ");
      if (location) formData.append("location", location);
    }

    try {
      const result = await analyzeField(formData);

      if (isNoTreesDetected(result)) {
        setNoTreesWarning(NO_TREES_MESSAGE);
        setUploadStatus("complete");
        setStatusMessage("Analysis complete — no trees detected.");
        return;
      }

      const mapped = mapFieldScanResults(result);

      setComparison(mapped.comparison);
      setHealth(mapped.health);
      setStats(mapped.stats);
      setScanObservations(mapped.observations);
      setGeminiUnavailable(mapped.geminiUnavailable);
      setHasResults(true);
      setUploadStatus("complete");
      setStatusMessage("Analysis complete.");
    } catch (err) {
      setUploadStatus("error");
      if (isApiError(err)) {
        setError(err.message);
        setStatusMessage(err.message);
      } else {
        setError("No connection");
        setStatusMessage("No connection");
      }
    }
  }

  const showObservationsPanel =
    hasResults && (scanObservations.length > 0 || geminiUnavailable);

  return (
    <>
      <Header
        pathname="/field-scan"
        variant="compact"
        fixed={false}
        profile="fieldScan"
      />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg pb-8 md:pb-12">
        <FieldScanPageHeader />

        {error && (
          <Card variant="elevated" className="p-stack-lg mb-gutter">
            <Badge variant="error" className="mb-4">
              Error
            </Badge>
            <p className="text-body-md text-on-surface mb-4">{error}</p>
            <Button onClick={() => setError(null)}>Dismiss</Button>
          </Card>
        )}

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
            <ImageryUpload
              status={uploadStatus}
              statusMessage={statusMessage}
              fileName={selectedFile?.name}
              onFileSelect={(file) => {
                setSelectedFile(file);
                setUploadStatus("idle");
                setStatusMessage(undefined);
                resetResults();
              }}
              onAnalyze={() => void handleAnalyze()}
              disabled={!selectedFile}
            />
          </div>

          <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
            {noTreesWarning && (
              <Card variant="elevated" className="p-stack-lg">
                <div className="flex items-start gap-4">
                  <Icon
                    name="forest"
                    size="lg"
                    className="text-secondary shrink-0"
                  />
                  <div>
                    <Badge variant="secondary" className="mb-3">
                      No trees detected
                    </Badge>
                    <p className="text-body-md text-on-surface leading-relaxed">
                      {noTreesWarning}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {hasResults && comparison && health && stats && (
              <>
                <ComparisonView data={comparison} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
                  <HealthDistribution data={health} />
                  <FieldStats data={stats} />
                </div>
                {showObservationsPanel && (
                  <AiObservationsPanel
                    observations={scanObservations}
                    notice={
                      geminiUnavailable ? GEMINI_UNAVAILABLE_NOTICE : undefined
                    }
                  />
                )}
              </>
            )}

            {!hasResults && !noTreesWarning && (
              <Card
                variant="elevated"
                className="p-stack-lg flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <Icon
                  name="image_search"
                  size="lg"
                  className="text-on-surface-variant mb-4"
                />
                <h2 className="text-headline-md text-on-surface mb-2">
                  No analysis yet
                </h2>
                <p className="text-body-md text-on-surface-variant max-w-md">
                  Upload aerial or satellite imagery, then run analysis to see
                  tree health, density, and AI observations.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer variant="stacked" />
    </>
  );
}
