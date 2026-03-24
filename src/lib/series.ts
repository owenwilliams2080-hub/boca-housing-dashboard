// ============================================================
// FRED Series Configuration
// This is the single place where we define which data series
// to fetch from FRED. To add a new dataset, just add an entry
// to this array — the rest of the app picks it up automatically.
// ============================================================

import { SeriesConfig } from "@/types";

/**
 * Each object describes one FRED data series.
 * - id:          the official FRED series ID (look it up at fred.stlouisfed.org)
 * - name:        a short label for cards and chart titles
 * - description: a beginner-friendly explanation shown below the chart
 * - unit:        what the numbers represent
 * - frequency:   how often FRED publishes new data
 * - prefix/suffix/decimals: formatting hints for display
 */
export const FRED_SERIES: SeriesConfig[] = [
  {
    id: "ATNHPIUS48424Q",
    name: "Home Price Index",
    description:
      "Tracks how home prices change over time in the West Palm Beach–Boca Raton–Boynton Beach metro area. The index is set to 100 in the base year, so a value of 250 means prices have risen 150% since then.",
    unit: "Index",
    frequency: "Quarterly",
    decimals: 1,
  },
  {
    id: "MEDLISPRI48424",
    name: "Median Listing Price",
    description:
      "The middle listing price of homes for sale in the area. Half of all listings are priced above this number and half below — it gives you a realistic sense of what homes cost right now.",
    unit: "USD",
    frequency: "Monthly",
    prefix: "$",
    decimals: 0,
  },
  {
    id: "ACTLISCOU48424",
    name: "Active Listings",
    description:
      "The number of homes currently listed for sale. More listings generally mean more choices for buyers and less pressure on prices. Fewer listings can signal a seller's market.",
    unit: "Count",
    frequency: "Monthly",
    decimals: 0,
  },
  {
    id: "MEDDAYONMAR48424",
    name: "Median Days on Market",
    description:
      "How long the typical home sits on the market before going under contract. A lower number means homes are selling quickly (hot market); a higher number means they are sitting longer (cooling market).",
    unit: "Days",
    frequency: "Monthly",
    suffix: " days",
    decimals: 0,
  },
  {
    id: "MORTGAGE30US",
    name: "30-Year Mortgage Rate",
    description:
      "The average interest rate on a 30-year fixed-rate mortgage nationwide. This is the most common type of home loan. Higher rates make monthly payments more expensive, which can cool demand.",
    unit: "Percent",
    frequency: "Weekly",
    suffix: "%",
    decimals: 2,
  },
];
