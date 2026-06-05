import { Card } from "@/components/ui/card";
import { fieldStats } from "@/data/field-scan";

export function FieldStats() {
  return (
    <Card
      variant="elevated"
      className="p-stack-lg flex flex-col justify-between"
    >
      <div>
        <p className="text-label-md text-on-surface-variant uppercase">
          Tree Count
        </p>
        <p className="text-headline-md text-on-surface">
          {fieldStats.treeCount}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant">
        <p className="text-label-md text-on-surface-variant uppercase">
          Density
        </p>
        <p className="text-body-lg font-bold text-on-surface">
          {fieldStats.density.value}{" "}
          <span className="text-body-sm font-normal text-on-surface-variant">
            {fieldStats.density.unit}
          </span>
        </p>
      </div>
    </Card>
  );
}
