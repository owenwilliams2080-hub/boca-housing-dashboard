# Boca Raton Housing Dashboard

A modern web dashboard that visualizes housing market trends for the West Palm Beach–Boca Raton–Boynton Beach metro area using Federal Reserve (FRED) economic data.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

- Headline stat cards with latest values and year-over-year change
- Interactive line charts for 5 housing data series
- Toggle between raw levels and YoY percent change
- Time range filter (1Y / 3Y / 5Y / 10Y / ALL)
- Loading skeletons and error handling
- Fully responsive (mobile, tablet, desktop)

## Quick Start

### 1. Install Node.js

Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended).

### 2. Install dependencies

```bash
cd "Housing Project"
npm install
```

### 3. Add your FRED API key

1. Get a free key at [https://fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Open `.env.local` and replace `YOUR_FRED_API_KEY_HERE` with your real key

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js pages and API routes
│   ├── layout.tsx          # HTML shell, fonts, metadata
│   ├── page.tsx            # Home page (renders Dashboard)
│   ├── globals.css         # Tailwind imports
│   └── api/fred/route.ts   # Server-side FRED API proxy
├── components/             # React UI components
│   ├── Dashboard.tsx       # Main orchestrator
│   ├── StatCard.tsx        # Headline number cards
│   ├── ChartCard.tsx       # Chart + description wrapper
│   ├── HousingChart.tsx    # Reusable Recharts line chart
│   ├── TimeRangeFilter.tsx # Time range buttons
│   ├── LoadingSkeleton.tsx # Loading placeholders
│   └── ErrorMessage.tsx    # Error display with retry
├── lib/                    # Data logic (no UI)
│   ├── fred.ts             # Browser-side fetch client
│   ├── transforms.ts       # YoY calculations, formatting
│   └── series.ts           # FRED series IDs and metadata
└── types/
    └── index.ts            # TypeScript type definitions
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Data | FRED API |

## License

MIT
