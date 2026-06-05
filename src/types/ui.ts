export type ForecastDay = {
  day: string;
  icon: string;
  high: number;
  low: number;
  barWidth: string;
  barColor: "secondary" | "primary" | "error";
  iconColor: "secondary" | "primary";
};

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

export type RiskFlag = {
  icon: string;
  title: string;
  detail: string;
  severity: "danger" | "caution";
};

export type Observation = {
  icon: string;
  title: string;
  detail: string;
  severity: "secondary" | "error" | "primary";
};
