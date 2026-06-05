export const currentWeather = {
  location: "Kirinyaga District, Kenya",
  temperature: 28,
  condition: "Partly Cloudy",
  feelsLike: 30,
  humidity: 65,
  wind: 12,
  icon: "partly_cloudy_day",
} as const;

export const farmAdvisory = {
  crop: "maize",
  message:
    "Optimal planting conditions for maize are expected in the next 48 hours. Soil moisture is currently high (72%), reducing immediate irrigation needs. Monitor for pest activity as high humidity persists.",
  soilMoisture: 72,
} as const;

export type ForecastDay = {
  day: string;
  icon: string;
  high: number;
  low: number;
  barWidth: string;
  barColor: "secondary" | "primary" | "error";
  iconColor: "secondary" | "primary";
};

export const forecastDays: ForecastDay[] = [
  { day: "Mon", icon: "sunny", high: 30, low: 22, barWidth: "w-full", barColor: "secondary", iconColor: "secondary" },
  { day: "Tue", icon: "partly_cloudy_day", high: 29, low: 21, barWidth: "w-4/5", barColor: "secondary", iconColor: "secondary" },
  { day: "Wed", icon: "rainy", high: 24, low: 19, barWidth: "w-1/2", barColor: "primary", iconColor: "primary" },
  { day: "Thu", icon: "thunderstorm", high: 22, low: 18, barWidth: "w-3/4", barColor: "error", iconColor: "primary" },
  { day: "Fri", icon: "sunny", high: 31, low: 23, barWidth: "w-full", barColor: "secondary", iconColor: "secondary" },
  { day: "Sat", icon: "sunny", high: 32, low: 24, barWidth: "w-full", barColor: "secondary", iconColor: "secondary" },
  { day: "Sun", icon: "partly_cloudy_day", high: 30, low: 22, barWidth: "w-4/5", barColor: "secondary", iconColor: "secondary" },
];

export const soilMetrics = {
  riskLevel: "Low Risk",
  status: "Stable",
  nitrogen: { label: "Nitrogen", value: "Optimal", width: "w-[85%]" },
  potassium: { label: "Potassium", value: "Low", width: "w-[40%]" },
} as const;

export const satelliteScan = {
  title: "Satellite Field Scan",
  updatedAt: "14 mins ago",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBvHRaLXvjMKFIZEwTtns48JNNiAJjy7uugmTbgzvRwimb3trSUqGvhr2bEKX-dYjVRCPnedVXbTWjh6fCGLyJCvAxBESEqJW_wrsVsuGTjHI2ntXfsVRB5gxJG4fmP7aVgnLNwo53mgoC4GSy48Mxym_62QuL1qvFIJZ0Wu_6xf_7dUxgAm3cGgG2DWrdncK0pt_f-QjQei80UWoafRJu7MeKqrbGVmRP1ISjtlFb8VWfOhPri5OA11V8QgGUZyXF91J6ZuXRm8m8a",
  linkLabel: "View NDVI Map",
} as const;

export const forecastAccuracy = {
  value: 94,
  delta: "+2% vs avg",
  bars: [40, 60, 55, 80, 100],
} as const;

