export const forecastMeta = {
  title: "Detailed Weather Forecast",
  subtitle: "Northern Valley Sectors • Updated 2 mins ago",
} as const;

export const hourlyChart = {
  title: "24H Dynamics",
  status: "Live Feed: Active",
  yAxisLabels: ["40°", "30°", "20°", "10°", "0°"],
  xAxisLabels: ["08:00", "12:00", "16:00", "20:00", "00:00", "04:00"],
  precipBars: [10, 15, 20, 65, 80, 45, 10, 5],
  temperaturePath: "M 0,60 Q 15,55 25,40 T 50,30 T 75,50 T 100,45",
  peakPoint: { x: 50, y: 30 },
  tooltip: {
    time: "14:00 PM Peak",
    temperature: "32°C",
    precip: "80% Precip Chance",
  },
  legend: [
    { label: "Temp (°C)", color: "primary" as const },
    { label: "Precip %", color: "secondary" as const },
  ],
} as const;

export type DailyForecast = {
  day: string;
  icon: string;
  high: number;
  low: number;
  rain: string;
  wind: string;
  iconColor?: "primary" | "error";
  dayColor?: "primary";
  filled?: boolean;
};

export const dailyForecasts: DailyForecast[] = [
  { day: "Mon", icon: "partly_cloudy_day", high: 28, low: 19, rain: "12%", wind: "8k/h" },
  {
    day: "Tue",
    icon: "thunderstorm",
    high: 24,
    low: 16,
    rain: "92%",
    wind: "22k/h",
    iconColor: "error",
    dayColor: "primary",
    filled: true,
  },
  { day: "Wed", icon: "rainy", high: 22, low: 15, rain: "45%", wind: "14k/h" },
  { day: "Thu", icon: "sunny", high: 31, low: 21, rain: "0%", wind: "6k/h" },
  { day: "Fri", icon: "wb_sunny", high: 33, low: 22, rain: "5%", wind: "10k/h" },
];

export type RiskFlag = {
  icon: string;
  title: string;
  detail: string;
  severity: "danger" | "caution";
};

export const riskFlags: RiskFlag[] = [
  {
    icon: "rainy_heavy",
    title: "Heavy Rain",
    detail: "Incoming: 14:00 - 18:00",
    severity: "danger",
  },
  {
    icon: "air",
    title: "Strong Wind",
    detail: "Gusts up to 45km/h",
    severity: "caution",
  },
  {
    icon: "light_mode",
    title: "High UV Index",
    detail: "Level 9/11 expected",
    severity: "caution",
  },
];

export const aiInsight = {
  message:
    "Heavy precipitation detected for tomorrow afternoon. We recommend completing nitrogen application before 10:00 AM to ensure absorption and prevent runoff. Soil moisture saturation is expected to reach 85% by evening.",
  highlight: "completing nitrogen application before 10:00 AM",
  actionLabel: "VIEW TREATMENT PLAN",
} as const;

export const soilDynamics = {
  surfaceMoisture: { label: "Surface Moisture", value: 64 },
  metrics: [
    { label: "Evapotranspiration", value: "4.2 mm/d" },
    { label: "Dew Point", value: "14.5°C" },
  ],
} as const;
