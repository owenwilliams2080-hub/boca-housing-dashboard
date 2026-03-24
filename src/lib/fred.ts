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
  seriesId: string
): Promise<ChartDataPoint[]> {
  // Call our own API route (see src/app/api/fred/route.ts)
  const response = await fetch(`/api/fred?seriesId=${seriesId}`);

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
