// ============================================================
// ErrorMessage
// A friendly error display with a retry button.
// Shown when a data fetch fails — the user can try again
// without refreshing the whole page.
// ============================================================

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void; // optional callback to retry the fetch
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      {/* Error icon */}
      <div className="text-red-400 text-3xl mb-2">!</div>

      {/* Error message */}
      <p className="text-red-700 font-medium mb-1">Something went wrong</p>
      <p className="text-red-500 text-sm mb-4">{message}</p>

      {/* Retry button (only shown if onRetry is provided) */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
