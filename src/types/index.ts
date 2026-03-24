// ============================================================
// TypeScript Types
// These define the "shape" of our data so TypeScript can catch
// mistakes before the code ever runs. Think of them as blueprints.
// ============================================================

/** One observation from the FRED API (a single data point). */
export interface FredObservation {
  date: string; // e.g. "2024-01-01"
  value: string; // FRED returns numbers as strings, e.g. "345.67"
}

/** The shape of the JSON that the FRED API sends back. */
export interface FredApiResponse {
  observations: FredObservation[];
}

/** A cleaned-up data point ready for our charts. */
export interface ChartDataPoint {
  date: string; // formatted date string for the x-axis
  value: number; // the numeric value
  yoyChange: number | null; // year-over-year % change (null if not enough history)
}

/** Configuration for one FRED data series. */
export interface SeriesConfig {
  id: string; // FRED series ID, e.g. "ATNHPIUS48424Q"
  name: string; // human-friendly name
  description: string; // plain-English explanation shown under the chart
  unit: string; // "Index", "USD", "Percent", "Count"
  frequency: string; // "Quarterly", "Monthly", "Weekly"
  prefix?: string; // optional prefix like "$" for currency
  suffix?: string; // optional suffix like "%" for rates
  decimals?: number; // how many decimal places to show
  apiPath?: string; // custom API path for computed series (e.g. "/api/fred/real-price")
  sourceSeriesId?: string; // the actual FRED series ID to fetch (when id is a display-only key)
}

/** The time range options for filtering charts. */
export type TimeRange = "1Y" | "3Y" | "5Y" | "10Y" | "ALL";

/** Tracks loading / error / data state for each series. */
export interface SeriesData {
  config: SeriesConfig;
  data: ChartDataPoint[];
  loading: boolean;
  error: string | null;
}
