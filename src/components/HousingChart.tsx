// ============================================================
// HousingChart
// A reusable line chart built with Recharts. It can display
// ANY time-series data — just pass in different data and labels.
// This is the core visualization component.
// ============================================================

"use client"; // Recharts needs browser APIs, so this must be a client component

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/types";
import { formatDate, formatValue } from "@/lib/transforms";

interface HousingChartProps {
  data: ChartDataPoint[];
  /** Which field to plot: "value" for raw data, "yoyChange" for YoY % */
  dataKey: "value" | "yoyChange";
  /** Color of the line */
  color?: string;
  /** Prefix/suffix for the tooltip and Y axis */
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function HousingChart({
  data,
  dataKey,
  color = "#3b82f6",
  prefix = "",
  suffix = "",
  decimals = 1,
}: HousingChartProps) {
  // For YoY view, filter out points that don't have a YoY value
  const chartData =
    dataKey === "yoyChange" ? data.filter((d) => d.yoyChange !== null) : data;

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Not enough data to display this view.
      </div>
    );
  }

  // For the YoY chart, always show "%" suffix
  const displaySuffix = dataKey === "yoyChange" ? "%" : suffix;
  const displayPrefix = dataKey === "yoyChange" ? "" : prefix;
  const displayDecimals = dataKey === "yoyChange" ? 1 : decimals;

  // Smart label count: target ~5 evenly spaced labels
  const maxLabels = 5;
  const tickInterval = Math.max(
    0,
    Math.floor(chartData.length / maxLabels) - 1
  );

  // Detect annual data: if the gap between the first two points is
  // roughly a year (~300+ days), show just the year instead of "Jan 2021"
  const isAnnual =
    chartData.length >= 2 &&
    Math.abs(
      new Date(chartData[1].date).getTime() -
        new Date(chartData[0].date).getTime()
    ) >
      300 * 24 * 60 * 60 * 1000;

  // Format label: "2021" for annual data, "Mar 2025" for everything else
  const tickFormatter = (dateStr: string) => {
    if (isAnnual) {
      return new Date(dateStr + "T00:00:00").getFullYear().toString();
    }
    return formatDate(dateStr);
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 45, left: 10, bottom: 5 }}
      >
        {/* Light grid lines for readability */}
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

        {/* X axis: dates — always flat, never angled */}
        <XAxis
          dataKey="date"
          tickFormatter={tickFormatter}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          interval={tickInterval}
        />

        {/* Y axis: values */}
        <YAxis
          tickFormatter={(val: number) =>
            formatValue(val, displayPrefix, displaySuffix, displayDecimals)
          }
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          width={80}
        />

        {/* Tooltip shown on hover */}
        <Tooltip
          formatter={(val: number) => [
            formatValue(val, displayPrefix, displaySuffix, displayDecimals),
            dataKey === "yoyChange" ? "YoY Change" : "Value",
          ]}
          labelFormatter={formatDate}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />

        {/* The actual data line */}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false} // hide individual dots for cleaner look
          activeDot={{ r: 4, fill: color }} // show dot on hover
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
