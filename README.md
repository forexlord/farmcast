# FarmCast

FarmCast is a Next.js weather intelligence app built for farmers. It detects your location automatically and turns raw forecast data into decisions you can act on — when to plant, irrigate, harvest, or spray — instead of a generic temperature readout.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

## Use case

Smallholder farmers in East Africa — Kenya in particular, given the WeatherAI API's agricultural focus — need daily weather guidance tied to real farm work. Most rely on generic weather apps that say little about crops, or they skip checking altogether.

FarmCast bridges that gap: weather data framed in farming language, with AI advisory, risk alerts, and optional aerial field analysis for orchards and tree crops.

**Who it's for:** farmers deciding whether tomorrow is safe to spray pesticides, when to irrigate before a dry spell, or how canopy health looks across a plot.

## What it does

### Dashboard (`/`)

- **Auto location** — detects your position via IP geolocation on first load
- **Current conditions** — temperature, condition, feels-like, humidity, wind
- **Farm Advisory** — AI summary that translates the forecast into actionable crop guidance
- **7-day forecast strip** — quick view of the week ahead
- **Location search** — search any city; coordinates are saved for the forecast page

### Forecast (`/forecast`)

- **24-hour chart** — hourly temperature and precipitation probability
- **7-day daily grid** — highs, lows, rain chance, wind per day
- **Risk flags** — heavy rain, strong wind, high UV, frost risk, drought (derived from forecast data)
- **AI insight panel** — same farm-focused summary as the dashboard
- **Soil dynamics** — surface moisture and related metrics from current conditions

Weather data is cached in memory while you navigate between pages, so switching Dashboard ↔ Forecast does not trigger duplicate API calls until you refresh the browser.

### Field Scan (`/field-scan`)

Upload a drone or satellite photo of your farm and receive:

- **Tree count and density** per acre
- **Health distribution** — healthy vs. needs care vs. replacement
- **Before/after comparison** — original image alongside AI overlay
- **AI observations and recommendations** — when the Gemini integration is available

The page handles edge cases gracefully: no trees detected, low confidence, or temporary AI unavailability.

## Setup

### Prerequisites

- Node.js 18+
- A [WeatherAI](https://api.weather-ai.co) API key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```env
WEATHERAI_API_KEY=your_api_key_here
```

The key is only used server-side in API route handlers. It is never exposed to the browser.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build (optional)

```bash
npm run build
npm run start
```

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Architecture

### Pages

| Route         | Description                          |
| ------------- | ------------------------------------ |
| `/`           | Dashboard — weather hero, advisory, forecast strip |
| `/forecast`   | Detailed hourly/daily forecast and risk flags |
| `/field-scan` | Aerial imagery upload and tree analysis |

### API proxy routes

All WeatherAI calls go through Next.js API routes so the API key stays on the server:

| Route                 | Method | Purpose                                      |
| --------------------- | ------ | -------------------------------------------- |
| `/api/weather-geo`    | GET    | Location + weather via IP auto-detection       |
| `/api/weather`        | GET    | Weather by `lat`, `lon`, `days` query params |
| `/api/field-scan`     | POST   | Multipart image upload → tree analysis       |

### Client library

`src/lib/weather-client.ts` — typed API client, response mappers, in-memory weather cache, and coordinate persistence (`localStorage`).

`src/lib/risk-engine.ts` — derives farm-relevant risk flags from forecast data.

## Project structure

```
src/
  app/
    page.tsx              # Dashboard
    forecast/page.tsx     # Detailed forecast
    field-scan/page.tsx   # Field imagery analysis
    api/                  # Server-side WeatherAI proxies
  components/
    dashboard/            # Weather hero, advisory, forecast strip
    forecast/             # Charts, daily grid, risk flags
    field-scan/           # Upload, comparison, observations
    layout/               # Header, footer, mobile nav
    ui/                   # Design system atoms
  data/navigation.ts      # Nav links and profile image
  lib/                    # API client, cache, risk engine
  types/ui.ts             # Shared component prop types
  theme/tokens.ts         # Design tokens
```

## Testing field scan

For best results, use a **top-down drone or aerial photo** with clearly visible tree crowns. Generic ground-level photos often return `total_tree_count: 0` or `low_confidence: true`.

Search for sample imagery (e.g. "drone aerial farm photo Kenya trees") to verify the CV pipeline. If a proper aerial image still returns zero trees, that points to a backend issue on WeatherAI's side — see Known issues below.

## Troubleshooting

### API quota exceeded (429)

If you hit the WeatherAI rate limit, the **Dashboard** and **Forecast** pages show an error card with:

- **Quota exceeded**
- **Quota resets:** a date and time (from the API's `X-RateLimit-Reset` header)

That reset time is when your quota becomes available again — not an automatic refresh. Wait until after that time, then click **Retry** on the error card to load weather data again. The app does not poll in the background; you need to retry manually once the reset time has passed.

## Known issues

**Gemini AI insights (field scan & weather advisory):** Tree analysis observations/recommendations and some weather AI summaries depend on WeatherAI's Gemini integration, which appears to have a configuration issue on their end as of submission date. The upload, image storage, and CV pipeline work correctly. When `gemini_error` is present in the field scan response, the UI still shows CV results (tree count, health distribution, comparison images) with a notice that AI insights are temporarily unavailable.

**No trees detected:** If the API returns `low_confidence: true` or `total_tree_count: 0`, the UI shows guidance to upload a suitable aerial image rather than empty or misleading stats.

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4, custom design tokens
- **Weather API:** [WeatherAI](https://api.weather-ai.co)
- **Geocoding:** OpenStreetMap Nominatim (location search on dashboard)
