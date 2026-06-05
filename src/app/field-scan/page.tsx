import { AiObservationsPanel } from "@/components/field-scan/ai-observations-panel";
import { ComparisonView } from "@/components/field-scan/comparison-view";
import { DataInputForm } from "@/components/field-scan/data-input-form";
import { FieldScanPageHeader } from "@/components/field-scan/field-scan-page-header";
import { FieldStats } from "@/components/field-scan/field-stats";
import { HealthDistribution } from "@/components/field-scan/health-distribution";
import { ImageryUpload } from "@/components/field-scan/imagery-upload";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Scan | FarmCast AI Intelligence",
  description:
    "Upload satellite or drone imagery for AI canopy analysis and health diagnostics",
};

export default function FieldScanPage() {
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

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
            <DataInputForm />
            <ImageryUpload />
          </div>

          <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
            <ComparisonView />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
              <HealthDistribution />
              <FieldStats />
            </div>
            <AiObservationsPanel />
          </div>
        </div>
      </main>
      <Footer variant="stacked" />
    </>
  );
}
