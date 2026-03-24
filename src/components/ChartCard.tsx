// ============================================================
// ChartCard
// Wraps a HousingChart with a title, a raw/YoY toggle, and
// a plain-English description underneath. This is the main
// visual building block of the dashboard.
// ============================================================

"use client";

import { useState } from "react";
import { ChartDataPoint, SeriesConfig } from "@/types";
import HousingChart from "./HousingChart";

interface ChartCardProps {
  config: SeriesConfig;
  data: ChartDataPoint[];
}

// Colors by series *type* — we match by the prefix of the series ID
// so the same color is used for "Median Listing Price" regardless of county
function getChartColor(seriesId: string): string {
  if (seriesId.startsWith("ATNHPIUS")) return "#3b82f6"; // blue — HPI
  if (seriesId.startsWith("MEDLISPRI")) return "#10b981"; // green — Median Price
  if (seriesId.startsWith("ACTLISCOU")) return "#f59e0b"; // amber — Active Listings
  if (seriesId.startsWith("MEDDAYONMAR")) return "#8b5cf6"; // purple — Days on Market
  if (seriesId.startsWith("MORTGAGE")) return "#ef4444"; // red — Mortgage Rate
  return "#3b82f6"; // default blue
}

export default function ChartCard({ config, data }: ChartCardProps) {
  // Toggle between showing raw values and year-over-year % change
  const [viewMode, setViewMode] = useState<"value" | "yoyChange">("value");

  const color = getChartColor(config.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header: title + toggle buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>

        {/* Raw / YoY toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("value")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === "value"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Level
          </button>
          <button
            onClick={() => setViewMode("yoyChange")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === "yoyChange"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            YoY %
          </button>
        </div>
      </div>

      {/* The chart */}
      <HousingChart
        data={data}
        dataKey={viewMode}
        color={color}
        prefix={config.prefix}
        suffix={config.suffix}
        decimals={config.decimals}
      />

      {/* Plain-English description */}
      <p className="mt-4 text-sm text-gray-500 leading-relaxed">
        {config.description}
      </p>
    </div>
  );
}
