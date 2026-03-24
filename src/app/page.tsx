// ============================================================
// Home Page
// This is the entry point — the page users see when they visit
// the root URL ("/"). It simply renders the Dashboard component.
//
// Why so simple? We keep the page file thin and put all the
// logic in Dashboard.tsx. This makes it easy to add more pages
// later without duplicating code.
// ============================================================

import Dashboard from "@/components/Dashboard";

export default function HomePage() {
  return <Dashboard />;
}
