import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { farmAdvisory } from "@/data/dashboard";

export function FarmAdvisory() {
  return (
    <Card
      variant="advisory"
      className="lg:col-span-4 p-stack-lg relative overflow-hidden flex flex-col"
    >
      <div className="hatch-pattern absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <Icon name="energy_savings_leaf" />
          </div>
          <h2 className="text-headline-md text-primary">Farm Advisory</h2>
        </div>
        <p className="text-body-md text-on-surface leading-relaxed">
          Optimal planting conditions for{" "}
          <span className="font-bold text-primary">{farmAdvisory.crop}</span> are
          expected in the next 48 hours. Soil moisture is currently high (
          {farmAdvisory.soilMoisture}%), reducing immediate irrigation needs.
          Monitor for pest activity as high humidity persists.
        </p>
      </div>

      <div className="relative z-10 mt-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <Badge className="self-start">Action Required</Badge>
        <Button className="w-full sm:w-auto">Export Plan</Button>
      </div>
    </Card>
  );
}
