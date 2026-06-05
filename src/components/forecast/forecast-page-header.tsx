import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { forecastMeta } from "@/data/forecast";

export function ForecastPageHeader() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div className="min-w-0">
        <h1 className="text-headline-lg text-on-surface">{forecastMeta.title}</h1>
        <p className="text-body-md text-on-surface-variant">
          {forecastMeta.subtitle}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <Button variant="outline" className="gap-2 w-full sm:w-auto justify-center">
          <Icon name="calendar_today" size="sm" />
          Next 14 Days
        </Button>
        <Button className="gap-2 w-full sm:w-auto justify-center">
          <Icon name="download" size="sm" />
          Export CSV
        </Button>
      </div>
    </section>
  );
}
