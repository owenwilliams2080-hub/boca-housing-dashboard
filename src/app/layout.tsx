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
          {/* Site-wide title */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-lg font-bold text-gray-900">
                South Florida Housing Dashboard
              </h1>
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
