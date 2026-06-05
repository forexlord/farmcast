import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FarmCast | Field Scan",
  description:
    "Upload aerial farm imagery for AI tree health analysis and canopy insights.",
};

export default function FieldScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
