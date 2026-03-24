# Boca Raton Housing Market Dashboard

## Overview

A clean, modern dashboard displaying housing market data for the Boca Raton / West Palm Beach-Boca Raton area. Built as a learning project with beginner-friendly code and clear documentation.

---

## Tech Stack

| Layer        | Technology              |
| ------------ | ----------------------- |
| Framework    | Next.js (App Router)    |
| Language     | TypeScript              |
| Styling      | Tailwind CSS            |
| Charts       | Recharts (or similar)   |
| Data Source   | FRED API (primary)     |
| Deployment   | TBD                     |

---

## Data Sources

### Primary: FRED API

The Federal Reserve Economic Data (FRED) API provides free access to housing-related economic data series. Relevant series for this project include:

- **Median Home Prices** - West Palm Beach-Boca Raton metro area
- **Housing Inventory / Supply** - months of supply, active listings
- **Mortgage Rates** - 30-year fixed national average
- **Housing Permits** - new residential building permits
- **Home Price Index (HPI)** - FHFA or Case-Shiller regional index

> FRED API docs: https://fred.stlouisfed.org/docs/api/fred/

### Future Data Sources

The project is structured so additional APIs can be added later (e.g., Redfin, Zillow, Realtor.com, Census Bureau). Each data source will live in its own module under the data-fetching layer.

---

## Project Structure

```
housing-dashboard/
├── public/                  # Static assets (images, icons)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with global styles
│   │   ├── page.tsx         # Dashboard home page
│   │   └── api/             # API route handlers (server-side)
│   │       └── fred/        # FRED-specific API routes
│   ├── components/          # Reusable UI components
│   │   ├── charts/          # Chart components (line, bar, etc.)
│   │   ├── cards/           # Stat cards, summary cards
│   │   └── ui/              # Shared UI (loading spinner, error banner)
│   ├── lib/                 # Data-fetching & utility logic
│   │   ├── fred.ts          # FRED API client & data transformers
│   │   └── utils.ts         # Shared helpers (formatting, YoY calc)
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Shared types for API responses & charts
│   └── config/              # App-wide constants & configuration
│       └── series.ts        # FRED series IDs and display metadata
├── .env.local               # API keys (never committed)
├── .gitignore
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Architecture Rules

### Data Fetching

- **API keys** live in `.env.local` and are accessed via `process.env` on the server only.
- **Data-fetching logic** is separated from UI components and lives in `src/lib/`.
- **API routes** (`src/app/api/`) act as a proxy so the FRED API key never reaches the browser.
- **Transformations** (e.g., year-over-year percent change) are handled in `src/lib/utils.ts` with clear, readable functions.

### UI Components

- **Charts are reusable.** A single `<LineChart />` component can accept any time-series data, not just one specific dataset.
- **Every chart includes:**
  - A loading skeleton while data is being fetched
  - An error message if the request fails
  - A short plain-English description below explaining what the chart shows
- **Responsive design** using Tailwind breakpoints so the dashboard works on mobile, tablet, and desktop.

### Code Quality

- **Beginner-friendly:** Code is commented to explain *why*, not just *what*.
- **Simple over clever:** Prefer readable code. Avoid unnecessary abstractions.
- **TypeScript:** Use types for API responses and component props to catch mistakes early.

---

## Key Features

1. **Median Home Price Trend** - Line chart showing price over time with YoY change
2. **Mortgage Rate Tracker** - Current 30-year rate with historical trend
3. **Housing Supply** - Months of inventory / active listings
4. **Building Permits** - New residential permits as a leading indicator
5. **Summary Cards** - At-a-glance stats at the top of the dashboard (latest price, rate, inventory)

---

## Environment Variables

```env
# .env.local (do NOT commit this file)
FRED_API_KEY=your_fred_api_key_here
```

Get a free FRED API key at: https://fred.stlouisfed.org/docs/api/api_key.html

---

## UX Guidelines

- Use a clean color palette with good contrast
- Charts should have clear axis labels and tooltips
- Loading states: use skeleton placeholders, not blank screens
- Error states: show a friendly message with a retry option
- Mobile-first layout that scales up gracefully

---

## Development Workflow

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## Notes

- This is a learning project. Code comments explain major decisions in plain language.
- Start with FRED data, get the dashboard working end-to-end, then layer in more data sources.
- Keep commits small and focused so progress is easy to follow.
