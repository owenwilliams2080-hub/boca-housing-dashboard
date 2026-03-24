// ============================================================
// Dashboard
// The main component that ties everything together for ONE region.
// It receives a RegionConfig prop, fetches all that region's
// FRED series, manages the time range filter, and renders the
// stat cards + chart cards.
//
// This is a "client component" because it uses React state
// (useState, useEffect) for interactivity and data fetching.
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { TimeRange, SeriesData } from "@/types";
import { RegionConfig } from "@/lib/series";
import { fetchSeriesData } from "@/lib/fred";
import { filterByTimeRange } from "@/lib/transforms";
import StatCard from "./StatCard";
import ChartCard from "./ChartCard";
import TimeRangeFilter from "./TimeRangeFilter";
import ErrorMessage from "./ErrorMessage";
import { StatCardSkeleton, ChartCardSkeleton } from "./LoadingSkeleton";

interface DashboardProps {
  region: RegionConfig;
}

export default function Dashboard({ region }: DashboardProps) {
  // ----- State -----
  const [seriesMap, setSeriesMap] = useState<Record<string, SeriesData>>({});
  const [timeRange, setTimeRange] = useState<TimeRange>("5Y");

  // ----- Data fetching -----
  const loadAllData = useCallback(async () => {
    // Initialize every series to "loading" state
    const initial: Record<string, SeriesData> = {};
    for (const config of region.series) {
      initial[config.id] = { config, data: [], loading: true, error: null };
    }
    setSeriesMap(initial);

    // Fetch all series in parallel
    const results = await Promise.allSettled(
      region.series.map(async (config) => {
        const data = await fetchSeriesData(config.id);
        return { config, data };
      })
    );

    // Update state with results
    const updated: Record<string, SeriesData> = {};
    results.forEach((result, index) => {
      const config = region.series[index];
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
  }, [region]);

  // Re-fetch when the region changes
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ----- Derived data -----
  const seriesList = Object.values(seriesMap);
  const isLoading = seriesList.some((s) => s.loading);
  const allErrored =
    !isLoading &&
    seriesList.length > 0 &&
    seriesList.every((s) => s.error !== null);

  return (
    <>
      {/* ===== Region label ===== */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-baseline gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {region.name}
          </h2>
          <span className="text-sm text-gray-400">
            {region.description}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== Global error ===== */}
        {allErrored && (
          <div className="mb-8">
            <ErrorMessage
              message="Could not load housing data. Check your FRED API key in .env.local and try again."
              onRetry={loadAllData}
            />
          </div>
        )}

        {/* ===== Time range filter (sticky — stays visible while scrolling) ===== */}
        <div className="sticky top-0 z-10 bg-gray-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 -mt-4 mb-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-700">
              Market Overview
            </h2>
            <TimeRangeFilter selected={timeRange} onChange={setTimeRange} />
          </div>
        </div>

        {/* ===== Stat cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {isLoading
            ? region.series.map((config) => (
                <StatCardSkeleton key={config.id} />
              ))
            : seriesList.map(
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

        {/* ===== Charts ===== */}
        <div className="space-y-6">
          {isLoading
            ? region.series.map((config) => (
                <ChartCardSkeleton key={config.id} />
              ))
            : seriesList.map((series) => {
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
    </>
  );
}
