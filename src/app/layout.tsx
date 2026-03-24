// ============================================================
// Root Layout
// Wraps every page. Includes the site title bar and the region
// navigation tabs. Each region page renders below the nav.
// ============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "South Florida Housing Dashboard",
  description:
    "Track housing market trends across Palm Beach, Broward, and Miami-Dade counties using FRED economic data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* ===== Site header ===== */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
              {/* Main headline */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                South Florida Housing Market Dashboard
              </h1>

              {/* Subheadline — explains what the dashboard does */}
              <p className="mt-2 text-base sm:text-lg text-gray-500 max-w-2xl">
                Tracking key housing indicators and year-over-year changes
                across Palm Beach, Broward, and Miami-Dade counties.
              </p>

              {/* Supporting detail */}
              <p className="mt-3 text-xs text-gray-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                Updated with the latest Federal Reserve (FRED) economic data
              </p>
            </div>
          </div>

          {/* Page content (the active region's dashboard) */}
          {children}

          {/* ===== Site-wide footer — shown on every page ===== */}
          <footer className="border-t border-gray-200 bg-white mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-400">
                {/* Left column: data source */}
                <div>
                  <p className="font-medium text-gray-500 mb-2">Data Source</p>
                  <p>
                    All data is sourced from the{" "}
                    <a
                      href="https://fred.stlouisfed.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-gray-600"
                    >
                      Federal Reserve Economic Data (FRED)
                    </a>
                    , maintained by the Federal Reserve Bank of St. Louis.
                  </p>
                </div>

                {/* Right column: update schedule */}
                <div>
                  <p className="font-medium text-gray-500 mb-2">Update Schedule</p>
                  <p>
                    Data is fetched live from FRED each time you visit.
                    Individual series update on their own schedule:
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>Mortgage rates &mdash; weekly</li>
                    <li>Listing price, active listings, days on market &mdash; monthly</li>
                    <li>Home price index &mdash; annually</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                South Florida Housing Market Dashboard &middot; Built with Next.js &middot; Powered by FRED
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
