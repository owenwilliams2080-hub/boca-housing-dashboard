// ============================================================
// Data Transformations
// Pure utility functions that take raw FRED data and turn it
// into clean, chart-ready arrays. No side effects, no fetching.
// ============================================================

import { FredObservation, ChartDataPoint, TimeRange } from "@/types";

/**
 * Convert raw FRED observations into chart-ready data points.
 *
 * Why we need this:
 *   FRED returns values as strings and includes "." for missing data.
 *   We filter those out, parse numbers, and compute year-over-year change.
 */
export function transformObservations(
  observations: FredObservation[]
): ChartDataPoint[] {
  // Step 1: Remove entries where the value is missing (FRED uses "." for gaps)
  const clean = observations.filter(
    (obs) => obs.value !== "." && obs.value !== ""
  );

  // Step 2: Convert to numbers and build a lookup by date for YoY
  const points: ChartDataPoint[] = clean.map((obs) => ({
    date: obs.date,
    value: parseFloat(obs.value),
    yoyChange: null, // we'll fill this in next
  }));

  // Step 3: Calculate year-over-year percent change.
  // For each point, find the point closest to exactly 1 year earlier.
  // Formula: ((current - previous) / previous) * 100
  for (let i = 0; i < points.length; i++) {
    const currentDate = new Date(points[i].date);
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Search backward for the closest point to one year ago
    let closest: ChartDataPoint | null = null;
    let closestDiff = Infinity;

    for (let j = 0; j < i; j++) {
      const diff = Math.abs(
        new Date(points[j].date).getTime() - oneYearAgo.getTime()
      );
      // Only accept points within 60 days of exactly one year ago
      if (diff < closestDiff && diff < 60 * 24 * 60 * 60 * 1000) {
        closest = points[j];
        closestDiff = diff;
      }
    }

    if (closest && closest.value !== 0) {
      points[i].yoyChange =
        ((points[i].value - closest.value) / closest.value) * 100;
    }
  }

  return points;
}

/**
 * Filter data points to only include those within the selected time range.
 * "ALL" returns everything.
 */
export function filterByTimeRange(
  data: ChartDataPoint[],
  range: TimeRange
): ChartDataPoint[] {
  if (range === "ALL") return data;

  const years: Record<Exclude<TimeRange, "ALL">, number> = {
    "1Y": 1,
    "3Y": 3,
    "5Y": 5,
    "10Y": 10,
  };

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years[range]);

  return data.filter((point) => new Date(point.date) >= cutoff);
}

/**
 * Format a number for display.
 *
 * Examples:
 *   formatValue(1234567, "$", "", 0) → "$1,234,567"
 *   formatValue(6.85, "", "%", 2)    → "6.85%"
 */
export function formatValue(
  value: number,
  prefix = "",
  suffix = "",
  decimals = 1
): string {
  // Use Intl.NumberFormat for nice comma separators
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return `${prefix}${formatted}${suffix}`;
}

/**
 * Format a date string like "2024-01-01" into a shorter label.
 * Example: "Jan 2024"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00"); // avoid timezone shift
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
