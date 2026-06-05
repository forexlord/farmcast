import { Card } from "@/components/ui/card";

export function ForecastSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-gutter animate-pulse">
      <div className="col-span-12 lg:col-span-8 space-y-gutter">
        <Card variant="elevated" className="p-stack-lg h-[420px]">{null}</Card>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-stack-md">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} variant="elevated" className="h-40">{null}</Card>
          ))}
        </div>
      </div>
      <aside className="col-span-12 lg:col-span-4 space-y-gutter">
        <Card variant="elevated" className="p-stack-lg h-64">{null}</Card>
        <Card variant="elevated" className="p-stack-lg h-56">{null}</Card>
        <Card variant="elevated" className="p-stack-lg h-48">{null}</Card>
      </aside>
    </div>
  );
}
