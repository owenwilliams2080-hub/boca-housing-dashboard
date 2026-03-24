// ============================================================
// Dynamic Region Page
// This single file handles /palm-beach, /broward, and /miami-dade.
// Next.js passes the URL slug as a param, and we look up the
// matching region config to pass to the Dashboard component.
// ============================================================

import { REGIONS, getRegionBySlug } from "@/lib/series";
import Dashboard from "@/components/Dashboard";
import { notFound } from "next/navigation";

// Tell Next.js which region pages to pre-build at compile time
// (one page per region = faster loading for visitors)
export function generateStaticParams() {
  return REGIONS.map((region) => ({
    region: region.slug,
  }));
}

// Set the page title dynamically based on the region
export function generateMetadata({ params }: { params: { region: string } }) {
  const region = REGIONS.find((r) => r.slug === params.region);
  return {
    title: region
      ? `${region.name} Housing Dashboard`
      : "South Florida Housing Dashboard",
  };
}

export default function RegionPage({
  params,
}: {
  params: { region: string };
}) {
  // Look up the region config from the URL slug
  const region = REGIONS.find((r) => r.slug === params.region);

  // If someone visits an invalid URL like /foobar, show a 404
  if (!region) {
    notFound();
  }

  return <Dashboard region={region} />;
}
