// ============================================================
// RegionNav
// Navigation bar that lets users switch between the three
// county dashboards. The active region is highlighted.
// Uses Next.js Link for client-side navigation (no full reload).
// ============================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { REGIONS } from "@/lib/series";

export default function RegionNav() {
  // usePathname tells us which page we're currently on
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {REGIONS.map((region) => {
            // Check if this tab is the active one
            const isActive = pathname === `/${region.slug}`;

            return (
              <Link
                key={region.slug}
                href={`/${region.slug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {region.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
