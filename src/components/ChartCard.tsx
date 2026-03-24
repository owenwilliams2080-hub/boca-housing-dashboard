// ============================================================
// ChartCard
// Each chart gets a side-by-side layout: the chart on the left,
// a beginner-friendly explainer panel on the right. On mobile
// the explainer stacks below the chart.
// ============================================================

"use client";

import { useState } from "react";
import { ChartDataPoint, SeriesConfig } from "@/types";
import HousingChart from "./HousingChart";

interface ChartCardProps {
  config: SeriesConfig;
  data: ChartDataPoint[];
  populationData?: ChartDataPoint[];
}

// ----- Chart colors by series type -----
function getChartColor(seriesId: string): string {
  if (seriesId.startsWith("ATNHPIUS")) return "#3b82f6";
  if (seriesId.startsWith("REAL_MEDLISPRI")) return "#06b6d4";
  if (seriesId.startsWith("MEDLISPRI")) return "#10b981";
  if (seriesId.startsWith("ACTLISCOU")) return "#f59e0b";
  if (seriesId.startsWith("MEDDAYONMAR")) return "#8b5cf6";
  if (seriesId.startsWith("MORTGAGE")) return "#ef4444";
  return "#3b82f6";
}

// ----- Explainer content per series type -----
// Each explainer has a headline, bullet points, and a "why it matters" note.
interface Explainer {
  headline: string;
  bullets: string[];
  whyItMatters: string;
}

function getExplainer(seriesId: string): Explainer {
  if (seriesId.startsWith("ATNHPIUS")) {
    return {
      headline: "What is the Home Price Index?",
      bullets: [
        "Measures how much home prices have changed over time compared to a base year (set to 100)",
        "A value of 400 means prices are 4x higher than the base year",
        "Based on actual sale transactions, not just asking prices",
        "Updated once per year",
      ],
      whyItMatters:
        "This is the best long-term view of whether homes in the area are becoming more or less expensive over time.",
    };
  }
  if (seriesId.startsWith("REAL_MEDLISPRI")) {
    return {
      headline: "What is Inflation-Adjusted Listing Price?",
      bullets: [
        "Takes the median listing price and removes the effect of inflation",
        "Uses the Consumer Price Index (CPI) to convert past prices into today's dollars",
        "If this line is flat, prices only rose because of inflation — not real demand",
        "If this line is rising, homes are genuinely getting more expensive beyond inflation",
        "Updated every month",
      ],
      whyItMatters:
        "Shows whether homes are truly getting more expensive, or if rising prices are just the dollar losing value over time.",
    };
  }
  if (seriesId.startsWith("MEDLISPRI")) {
    return {
      headline: "What is the Median Listing Price?",
      bullets: [
        "The middle price of all homes currently listed for sale",
        "Half of listings are above this price, half are below",
        "More useful than the average, which can be skewed by a few very expensive homes",
        "Updated every month",
      ],
      whyItMatters:
        "Tells you what a \"typical\" home costs right now if you were to start shopping today.",
    };
  }
  if (seriesId.startsWith("ACTLISCOU")) {
    return {
      headline: "What are Active Listings?",
      bullets: [
        "The total number of homes currently on the market and available to buy",
        "More listings = more options for buyers, less bidding pressure",
        "Fewer listings = more competition, prices tend to rise",
        "Updated every month",
      ],
      whyItMatters:
        "Shows whether the market favors buyers (high inventory) or sellers (low inventory).",
    };
  }
  if (seriesId.startsWith("MEDDAYONMAR")) {
    return {
      headline: "What is Median Days on Market?",
      bullets: [
        "How many days the typical home sits listed before going under contract",
        "Low number (under 30) = homes are selling very fast (hot market)",
        "High number (60+) = homes are sitting longer (cooling market)",
        "Updated every month",
      ],
      whyItMatters:
        "A quick way to gauge how competitive the market feels right now for buyers and sellers.",
    };
  }
  // Mortgage rate
  return {
    headline: "What is the 30-Year Mortgage Rate?",
    bullets: [
      "The average interest rate on the most common type of home loan in the U.S.",
      "A higher rate means higher monthly payments for the same home price",
      "Even a 1% change can add hundreds of dollars to a monthly payment",
      "This is a national number — it applies everywhere, not just South Florida",
      "Updated every week",
    ],
    whyItMatters:
      "Directly affects how much house you can afford. When rates rise, buyer demand often cools and price growth can slow.",
  };
}

// Merge population data into chart data by matching year.
// Population is annual, so each chart point gets the population for its year.
// FRED returns population in thousands of persons, so we multiply by 1,000.
function mergePopulation(
  chartData: ChartDataPoint[],
  popData: ChartDataPoint[]
): ChartDataPoint[] {
  // Build lookup: year -> actual population (FRED value × 1,000)
  const popByYear: Record<string, number> = {};
  for (const p of popData) {
    const year = p.date.slice(0, 4);
    popByYear[year] = Math.round(p.value * 1000);
  }
  return chartData.map((point) => {
    const year = point.date.slice(0, 4);
    return { ...point, population: popByYear[year] };
  });
}

export default function ChartCard({ config, data, populationData }: ChartCardProps) {
  const [viewMode, setViewMode] = useState<"value" | "yoyChange">("value");
  const [showPopulation, setShowPopulation] = useState(false);
  const color = getChartColor(config.id);
  const explainer = getExplainer(config.id);

  // Merge population into chart data when the overlay is active
  const chartData =
    showPopulation && populationData && populationData.length > 0
      ? mergePopulation(data, populationData)
      : data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header: title + toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
        <div className="flex items-center gap-2">
          {/* Population overlay toggle — only shown for county-specific charts */}
          {populationData && populationData.length > 0 && (
            <button
              onClick={() => setShowPopulation(!showPopulation)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
                showPopulation
                  ? "bg-gray-900 text-white border-gray-900"
                  : "text-gray-400 border-gray-200 hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Population
            </button>
          )}
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
      </div>

      {/* Two-column layout: chart left, explainer right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart — takes 2/3 of the width on desktop */}
        <div className="lg:col-span-2">
          <HousingChart
            data={chartData}
            dataKey={viewMode}
            color={color}
            prefix={config.prefix}
            suffix={config.suffix}
            decimals={config.decimals}
            showPopulation={showPopulation}
          />
        </div>

        {/* Explainer panel — takes 1/3 on desktop, stacks below on mobile */}
        <div className="bg-gray-50 rounded-lg p-5 flex flex-col">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {explainer.headline}
          </p>

          <ul className="space-y-2 mb-4 flex-1">
            {explainer.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600 leading-snug">
                <span className="text-gray-300 mt-0.5 flex-shrink-0">&bull;</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* Why it matters callout */}
          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Why it matters
            </p>
            <p className="text-sm text-gray-600 leading-snug">
              {explainer.whyItMatters}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
