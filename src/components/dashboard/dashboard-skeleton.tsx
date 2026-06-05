import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-gutter animate-pulse min-w-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter min-w-0">
        <Card variant="elevated" className="lg:col-span-8 p-stack-lg h-56 min-w-0">{null}</Card>
        <Card variant="advisory" className="lg:col-span-4 p-stack-lg h-56 min-w-0">{null}</Card>
      </div>
      <Card variant="elevated" className="p-stack-lg h-40 min-w-0">{null}</Card>
    </div>
  );
}
