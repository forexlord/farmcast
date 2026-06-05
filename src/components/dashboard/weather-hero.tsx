import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { CurrentWeatherView } from "@/lib/weather-client";

type WeatherHeroProps = {
  data: CurrentWeatherView;
};

export function WeatherHero({ data }: WeatherHeroProps) {
  const stats = [
    { label: "Feels Like", value: `${data.feelsLike}°C` },
    { label: "Humidity", value: `${data.humidity}%` },
    { label: "Wind", value: `${data.wind} km/h` },
  ] as const;

  return (
    <Card variant="elevated" className="lg:col-span-8 p-stack-lg relative overflow-hidden min-w-0">
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="location_on" className="text-primary shrink-0" />
            <span className="text-label-md text-on-surface-variant uppercase truncate">
              {data.location}
            </span>
          </div>
          <h1 className="text-display-lg text-on-surface mb-2">
            {data.temperature}°C
          </h1>
          <p className="text-headline-md text-on-surface-variant">
            {data.condition}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-gutter w-full lg:w-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-1 sm:px-2">
              <p className="text-label-md text-on-surface-variant uppercase tracking-wider truncate">
                {stat.label}
              </p>
              <p className="text-headline-md text-on-surface">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent hidden sm:flex items-center justify-center opacity-50 pointer-events-none">
        <Icon name={data.icon} size="xl" className="text-primary/10" />
      </div>
    </Card>
  );
}
