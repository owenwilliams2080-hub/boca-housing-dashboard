// ============================================================
// Dashboard
// The main component that ties everything together.
// It fetches all FRED series on load, manages the time range
// filter, and renders the stat cards + chart cards.
//
// This is a "client component" because it uses React state
// (useState, useEffect) for interactivity and data fetching.
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { TimeRange, SeriesData } from "@/types";
import { FRED_SERIES } from "@/lib/series";
import { fetchSeriesData } from "@/lib/fred";
import { filterByTimeRange } from "@/lib/transforms";
import StatCard from "./StatCard";
import ChartCard from "./ChartCard";
import TimeRangeFilter from "./TimeRangeFilter";
import ErrorMessage from "./ErrorMessage";
import { StatCardSkeleton, ChartCardSkeleton } from "./LoadingSkeleton";

export default function Dashboard() {
  // ----- State -----
  // Stores the fetched data for every series, plus loading/error status
  const [seriesMap, setSeriesMap] = useState<Record<string, SeriesData>>({});
  // The currently selected time range filter
  const [timeRange, setTimeRange] = useState<TimeRange>("5Y");

  // ----- Data fetching -----
  // useCallback keeps this function reference stable across re-renders
  const loadAllData = useCallback(async () => {
    // Initialize every series to "loading" state
    const initial: Record<string, SeriesData> = {};
    for (const config of FRED_SERIES) {
      initial[config.id] = { config, data: [], loading: true, error: null };
    }
    setSeriesMap(initial);

    // Fetch all series in parallel (Promise.allSettled won't fail if one does)
    const results = await Promise.allSettled(
      FRED_SERIES.map(async (config) => {
        const data = await fetchSeriesData(config.id);
        return { config, data };
      })
    );

    // Update state with results
    const updated: Record<string, SeriesData> = {};
    results.forEach((result, index) => {
      const config = FRED_SERIES[index];
      if (result.status === "fulfilled") {
        updated[config.id] = {
          config,
          data: result.value.data,
          loading: false,
          error: null,
        };
      } else {
        updated[config.id] = {
          config,
          data: [],
          loading: false,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : "Unknown error",
        };
      }
    });
    setSeriesMap(updated);
  }, []);

  // Fetch data when the component first loads
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ----- Derived data -----
  // All series as an array, with time-range filtering applied
  const seriesList = Object.values(seriesMap);
  const isLoading = seriesList.some((s) => s.loading);
  const allErrored =
    !isLoading &&
    seriesList.length > 0 &&
    seriesList.every((s) => s.error !== null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Header ===== */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Boca Raton Housing Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            West Palm Beach &ndash; Boca Raton &ndash; Boynton Beach Metro Area
            &middot; Powered by FRED
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== Global error (all series failed) ===== */}
        {allErrored && (
          <div className="mb-8">
            <ErrorMessage
              message="Could not load housing data. Check your FRED API key in .env.local and try again."
              onRetry={loadAllData}
            />
          </div>
        )}

        {/* ===== Time range filter ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-700">
            Market Overview
          </h2>
          <TimeRangeFilter selected={timeRange} onChange={setTimeRange} />
        </div>

        {/* ===== Stat cards row ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {isLoading
            ? // Show skeleton cards while loading
              FRED_SERIES.map((config) => (
                <StatCardSkeleton key={config.id} />
              ))
            : // Show real stat cards with filtered data
              seriesList.map(
                (series) =>
                  !series.error &&
                  series.data.length > 0 && (
                    <StatCard
                      key={series.config.id}
                      config={series.config}
                      data={filterByTimeRange(series.data, timeRange)}
                    />
                  )
              )}
        </div>

        {/* ===== Chart cards ===== */}
        <div className="space-y-6">
          {isLoading
            ? // Show skeleton charts while loading
              FRED_SERIES.map((config) => (
                <ChartCardSkeleton key={config.id} />
              ))
            : // Show real charts
              seriesList.map((series) => {
                // If this specific series errored, show an inline error
                if (series.error) {
                  return (
                    <div key={series.config.id}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {series.config.name}
                      </h3>
                      <ErrorMessage
                        message={series.error}
                        onRetry={loadAllData}
                      />
                    </div>
                  );
                }

                if (series.data.length === 0) return null;

                return (
                  <ChartCard
                    key={series.config.id}
                    config={series.config}
                    data={filterByTimeRange(series.data, timeRange)}
                  />
                );
              })}
        </div>

        {/* ===== Footer ===== */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
          <p>
            Data provided by the{" "}
            <a
              href="https://fred.stlouisfed.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              Federal Reserve Economic Data (FRED)
            </a>{" "}
            &middot; Federal Reserve Bank of St. Louis
          </p>
        </footer>
      </main>
    </div>
  );
}
