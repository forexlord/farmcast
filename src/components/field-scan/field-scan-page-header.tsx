import { fieldScanMeta } from "@/data/field-scan";

export function FieldScanPageHeader() {
  return (
    <div className="mb-stack-lg">
      <h1 className="text-headline-lg text-on-surface mb-stack-sm">
        {fieldScanMeta.title}
      </h1>
      <p className="text-body-md text-on-surface-variant">
        {fieldScanMeta.subtitle}
      </p>
    </div>
  );
}
