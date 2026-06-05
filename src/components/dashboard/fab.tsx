"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function Fab() {
  return (
    <Button
      variant="fab"
      size="lg"
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 group"
      aria-label="Log field event"
    >
      <Icon name="add_task" />
      <span className="absolute right-full mr-4 bg-surface-container-highest text-on-surface px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
        Log Field Event
      </span>
    </Button>
  );
}
