// ============================================================
// StatCard
// A compact card showing one headline number at a glance,
// plus its year-over-year change. These sit at the top of the
// dashboard so you can see the latest values immediately.
// ============================================================

import { formatValue } from "@/lib/transforms";
import { ChartDataPoint, SeriesConfig } from "@/types";

interface StatCardProps {
  config: SeriesConfig;
  data: ChartDataPoint[];
  onClickScroll?: () => void;
}

export default function StatCard({ config, data, onClickScroll }: StatCardProps) {
  // Grab the most recent data point
  const latest = data[data.length - 1];
  if (!latest) return null;

  const formattedValue = formatValue(
    latest.value,
    config.prefix,
    config.suffix,
    config.decimals
  );

  // Determine if the YoY change is positive, negative, or neutral
  const yoy = latest.yoyChange;
  const hasYoy = yoy !== null && yoy !== undefined;
  const isPositive = hasYoy && yoy > 0;
  const isNegative = hasYoy && yoy < 0;

  return (
    <div
      onClick={onClickScroll}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start justify-between">
        {/* Series name */}
        <p className="text-sm font-medium text-gray-500 mb-1">{config.name}</p>
        {/* Down-arrow hint — visible on hover */}
        <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg leading-none">
          &#8595;
        </span>
      </div>

      {/* Latest value — the big number */}
      <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>

      {/* Year-over-year change */}
      {hasYoy && (
        <div className="flex items-center mt-2">
          {/* Arrow icon */}
          <span
            className={`text-sm font-medium ${
              isPositive
                ? "text-emerald-600"
                : isNegative
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {isPositive ? "\u2191" : isNegative ? "\u2193" : "\u2192"}{" "}
            {yoy.toFixed(1)}% YoY
          </span>
        </div>
      )}

      {/* Frequency label */}
      <p className="text-xs text-gray-400 mt-2">{config.frequency}</p>
    </div>
  );
}
