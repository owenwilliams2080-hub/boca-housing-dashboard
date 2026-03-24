// ============================================================
// LoadingSkeleton
// Shows animated placeholder boxes while data is loading.
// This is much better UX than a blank screen — the user can
// see that something is happening.
// ============================================================

/**
 * A single skeleton card that pulses to indicate loading.
 * Used as a placeholder for both StatCards and ChartCards.
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      {/* Fake label */}
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
      {/* Fake big number */}
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
      {/* Fake change indicator */}
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

/**
 * A skeleton for a full chart card.
 */
export function ChartCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      {/* Fake title bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded w-24" />
      </div>
      {/* Fake chart area */}
      <div className="h-64 bg-gray-100 rounded" />
      {/* Fake description */}
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  );
}
