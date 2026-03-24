// ============================================================
// TimeRangeFilter
// A row of buttons that lets the user choose how much history
// to show on the charts: 1 year, 3 years, 5, 10, or all data.
// ============================================================

import { TimeRange } from "@/types";

interface TimeRangeFilterProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

const OPTIONS: TimeRange[] = ["1Y", "3Y", "5Y", "10Y", "ALL"];

export default function TimeRangeFilter({
  selected,
  onChange,
}: TimeRangeFilterProps) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {OPTIONS.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            selected === range
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
