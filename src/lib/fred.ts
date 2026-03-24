// ============================================================
// FRED API Client (runs in the browser)
// This file fetches data from OUR OWN API route (/api/fred),
// NOT directly from the FRED API. This keeps the API key safe
// on the server — the browser never sees it.
// ============================================================

import { ChartDataPoint } from "@/types";
import { transformObservations } from "./transforms";

/**
 * Fetch one FRED series through our secure API route and return
 * chart-ready data points.
 *
 * @param seriesId - the FRED series ID, e.g. "ATNHPIUS48424Q"
 * @returns an array of cleaned, transformed data points
 */
export async function fetchSeriesData(
  seriesId: string,
  apiPath?: string,
  sourceSeriesId?: string
): Promise<ChartDataPoint[]> {
  // Use custom API path if provided (for computed series like inflation-adjusted),
  // otherwise use the standard FRED proxy route.
  // sourceSeriesId overrides seriesId for the API call (used when the display ID
  // differs from the actual FRED series ID).
  const fetchId = sourceSeriesId || seriesId;
  const url = apiPath
    ? `${apiPath}?seriesId=${fetchId}`
    : `/api/fred?seriesId=${fetchId}`;
  const response = await fetch(url);

  // If the request failed, throw an error so the UI can show it
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error || `Failed to fetch data for ${seriesId}`
    );
  }

  // Parse the JSON response
  const data = await response.json();

  // Transform raw FRED observations into chart-ready data
  return transformObservations(data.observations);
}
