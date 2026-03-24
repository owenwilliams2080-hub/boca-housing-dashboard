// ============================================================
// Root Layout
// Wraps every page. Includes the site title bar and the region
// navigation tabs. Each region page renders below the nav.
// ============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RegionNav from "@/components/RegionNav";

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

          {/* Region tabs — always visible */}
          <RegionNav />

          {/* Page content (the active region's dashboard) */}
          {children}
        </div>
      </body>
    </html>
  );
}
