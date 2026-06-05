# Farmcast

Next.js 16 app with the App Router, TypeScript, and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Project structure

```
src/
  app/
    layout.tsx    # Root layout
    page.tsx      # Home page (/)
    globals.css   # Global styles + Tailwind
```

## Next.js 16

This project uses Next.js 16, which has breaking changes from earlier versions. Before writing or modifying framework code, read the relevant guide in `node_modules/next/dist/docs/`.

## Known issues

Tree analysis AI insights depend on WeatherAI's Gemini integration, which appears to be experiencing a configuration issue on their end as of submission date. The upload, image storage, and CV pipeline work correctly — when `gemini_error` is present in the API response, the field scan page shows CV results (tree count, health distribution, comparison images) with a notice that AI insights are temporarily unavailable.

If the computer vision model returns `low_confidence: true` or `total_tree_count: 0`, the UI shows guidance to upload a top-down drone or aerial photo with clearly visible tree crowns rather than displaying empty or misleading stats.
