function isIconUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

export function conditionCodeToLabel(code: string | number): string {
  const value = Number(code);
  if (Number.isNaN(value)) return "Unknown";
  if (value === 0) return "Clear Sky";
  if (value === 1) return "Mainly Clear";
  if (value === 2) return "Partly Cloudy";
  if (value === 3) return "Overcast";
  if (value >= 51 && value <= 55) return "Drizzle";
  if (value >= 56 && value <= 57) return "Freezing Drizzle";
  if (value >= 61 && value <= 65) return "Rain";
  if (value >= 66 && value <= 67) return "Freezing Rain";
  if (value >= 71 && value <= 77) return "Snow";
  if (value >= 80 && value <= 82) return "Rain Showers";
  if (value === 85 || value === 86) return "Snow Showers";
  if (value >= 95 && value <= 99) return "Thunderstorm";
  if (value === 45 || value === 48) return "Fog";
  return "Unknown";
}

export function conditionCodeToMaterialIcon(
  code: string | number,
  nameHint = "",
): string {
  const hint = nameHint.toLowerCase();
  const value = Number(code);
  if (Number.isNaN(value)) return "partly_cloudy_day";
  if (value >= 95) return "thunderstorm";
  if (value >= 80 && value <= 82) return "rainy";
  if (value >= 61 && value <= 67) return "rainy";
  if (value >= 51 && value <= 57) return "rainy";
  if (value >= 71 && value <= 77) return "ac_unit";
  if (value === 45 || value === 48) return "foggy";
  if (value === 0 || value === 1) {
    return hint.includes("night") ? "nights_stay" : "sunny";
  }
  if (value === 2) return "partly_cloudy_day";
  if (value === 3) return "cloud";
  return "partly_cloudy_day";
}

function parseIconHintFromUrl(iconUrl: string): {
  code?: string;
  hint?: string;
} {
  const match = iconUrl.match(/\/(\d+)_([^./]+)/);
  if (!match) return {};
  return { code: match[1], hint: match[2] };
}

export function conditionToIcon(condition: string): string {
  const value = condition.toLowerCase();
  if (value.includes("thunder")) return "thunderstorm";
  if (value.includes("shower") || value.includes("rain") || value.includes("drizzle")) {
    return "rainy";
  }
  if (value.includes("snow")) return "ac_unit";
  if (value.includes("fog") || value.includes("mist")) return "foggy";
  if (value.includes("overcast")) return "cloud";
  if (value.includes("partly")) return "partly_cloudy_day";
  if (value.includes("cloud")) return "cloud";
  if (value.includes("clear") || value.includes("sunny")) return "sunny";
  return "partly_cloudy_day";
}

export function resolveMaterialIcon(
  icon?: string,
  conditionCode?: string | number,
  condition?: string,
): string {
  if (icon && !isIconUrl(icon)) return icon;

  if (icon && isIconUrl(icon)) {
    const parsed = parseIconHintFromUrl(icon);
    if (parsed.code) {
      return conditionCodeToMaterialIcon(parsed.code, parsed.hint ?? "");
    }
  }

  if (conditionCode != null) {
    return conditionCodeToMaterialIcon(conditionCode);
  }

  if (condition) {
    return conditionToIcon(condition);
  }

  return "partly_cloudy_day";
}

export function resolveConditionLabel(
  conditionCode?: string | number,
  condition?: string,
  description?: string,
  weather?: string,
): string {
  if (condition && condition !== "Unknown") return condition;
  if (description) return description;
  if (weather) return weather;
  if (conditionCode != null) return conditionCodeToLabel(conditionCode);
  return "Unknown";
}
