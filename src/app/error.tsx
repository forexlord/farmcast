"use client";

import { ErrorCard } from "@/components/ui/error-card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-margin-desktop py-stack-lg">
      <ErrorCard
        message={error.message || "Something went wrong"}
        onRetry={reset}
      />
    </div>
  );
}
