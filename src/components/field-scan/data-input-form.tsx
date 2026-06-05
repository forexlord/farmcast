import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function DataInputForm() {
  return (
    <Card variant="elevated" className="p-stack-lg">
      <h2 className="text-label-md text-primary uppercase tracking-widest mb-stack-md">
        Data Input
      </h2>
      <div className="flex flex-col gap-stack-md">
        <FormField label="Farm Size (acres)">
          <Input type="number" placeholder="e.g. 45" />
        </FormField>
        <FormField label="County">
          <Input type="text" placeholder="Select Location" />
        </FormField>
        <FormField label="Notes">
          <Textarea
            rows={3}
            placeholder="Specific crop variety or observations..."
          />
        </FormField>
      </div>
    </Card>
  );
}
