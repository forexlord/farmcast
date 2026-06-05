import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type FieldFormValues = {
  landAcres: string;
  county: string;
  notes: string;
};

type DataInputFormProps = {
  values: FieldFormValues;
  onChange: (values: FieldFormValues) => void;
};

export function DataInputForm({ values, onChange }: DataInputFormProps) {
  return (
    <Card variant="elevated" className="p-stack-lg">
      <h2 className="text-label-md text-primary uppercase tracking-widest mb-stack-md">
        Data Input
      </h2>
      <div className="flex flex-col gap-stack-md">
        <FormField label="Farm Size (acres)">
          <Input
            type="number"
            placeholder="e.g. 45"
            value={values.landAcres}
            onChange={(event) =>
              onChange({ ...values, landAcres: event.target.value })
            }
          />
        </FormField>
        <FormField label="Location">
          <Input
            type="text"
            placeholder="Auto-filled from dashboard location"
            value={values.county}
            onChange={(event) =>
              onChange({ ...values, county: event.target.value })
            }
          />
        </FormField>
        <FormField label="Notes">
          <Textarea
            rows={3}
            placeholder="Specific crop variety or observations..."
            value={values.notes}
            onChange={(event) =>
              onChange({ ...values, notes: event.target.value })
            }
          />
        </FormField>
      </div>
    </Card>
  );
}
