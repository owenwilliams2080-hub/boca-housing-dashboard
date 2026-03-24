// ============================================================
// FRED Series Configuration — organized by region
//
// Each region has its own set of FRED series IDs because FRED
// uses different geographic codes for each county.
// To add a new region, just add a new entry to REGIONS.
// ============================================================

import { SeriesConfig } from "@/types";

/**
 * Describes one geographic region (county) in the dashboard.
 * - slug:  URL-friendly name used in the route, e.g. "/palm-beach"
 * - name:  display name shown in the header
 * - description: subtitle shown under the region name
 * - series: the FRED data series for this region
 */
export interface RegionConfig {
  slug: string;
  name: string;
  description: string;
  series: SeriesConfig[];
}

// ----- Series templates -----
// These helper functions take a county FIPS code and return
// the correct FRED series ID. This avoids repeating the same
// descriptions and settings for each region.

function hpiSeries(fips: string, regionName: string): SeriesConfig {
  return {
    id: `ATNHPIUS${fips}A`,
    name: "Home Price Index",
    description: `Tracks how home prices change over time in ${regionName}. The index is set to 100 in the base year, so a value of 400 means prices have quadrupled since then.`,
    unit: "Index",
    frequency: "Annually",
    decimals: 1,
  };
}

function medianPriceSeries(fips: string, regionName: string): SeriesConfig {
  return {
    id: `MEDLISPRI${fips}`,
    name: "Median Listing Price",
    description: `The middle listing price of homes for sale in ${regionName}. Half of all listings are priced above this number and half below.`,
    unit: "USD",
    frequency: "Monthly",
    prefix: "$",
    decimals: 0,
  };
}

function activeListingsSeries(fips: string, regionName: string): SeriesConfig {
  return {
    id: `ACTLISCOU${fips}`,
    name: "Active Listings",
    description: `The number of homes currently listed for sale in ${regionName}. More listings mean more choices for buyers; fewer listings can signal a seller's market.`,
    unit: "Count",
    frequency: "Monthly",
    decimals: 0,
  };
}

function daysOnMarketSeries(fips: string, regionName: string): SeriesConfig {
  return {
    id: `MEDDAYONMAR${fips}`,
    name: "Median Days on Market",
    description: `How long the typical home sits on the market in ${regionName} before going under contract. Lower = homes selling fast (hot market). Higher = homes sitting longer (cooling market).`,
    unit: "Days",
    frequency: "Monthly",
    suffix: " days",
    decimals: 0,
  };
}

// Mortgage rate is national — same for all regions
const MORTGAGE_SERIES: SeriesConfig = {
  id: "MORTGAGE30US",
  name: "30-Year Mortgage Rate",
  description:
    "The average interest rate on a 30-year fixed-rate mortgage nationwide. Higher rates make monthly payments more expensive, which can cool housing demand.",
  unit: "Percent",
  frequency: "Weekly",
  suffix: "%",
  decimals: 2,
};

// ----- Region definitions -----

export const REGIONS: RegionConfig[] = [
  {
    slug: "palm-beach",
    name: "Palm Beach County",
    description: "Boca Raton \u2022 West Palm Beach \u2022 Boynton Beach",
    series: [
      hpiSeries("12099", "Palm Beach County"),
      medianPriceSeries("12099", "Palm Beach County"),
      activeListingsSeries("12099", "Palm Beach County"),
      daysOnMarketSeries("12099", "Palm Beach County"),
      MORTGAGE_SERIES,
    ],
  },
  {
    slug: "broward",
    name: "Broward County",
    description: "Fort Lauderdale \u2022 Pompano Beach \u2022 Sunrise",
    series: [
      hpiSeries("12011", "Broward County"),
      medianPriceSeries("12011", "Broward County"),
      activeListingsSeries("12011", "Broward County"),
      daysOnMarketSeries("12011", "Broward County"),
      MORTGAGE_SERIES,
    ],
  },
  {
    slug: "miami-dade",
    name: "Miami-Dade County",
    description: "Miami \u2022 Miami Beach \u2022 Kendall",
    series: [
      hpiSeries("12086", "Miami-Dade County"),
      medianPriceSeries("12086", "Miami-Dade County"),
      activeListingsSeries("12086", "Miami-Dade County"),
      daysOnMarketSeries("12086", "Miami-Dade County"),
      MORTGAGE_SERIES,
    ],
  },
];

/**
 * Look up a region by its URL slug.
 * Falls back to Palm Beach if the slug isn't found.
 */
export function getRegionBySlug(slug: string): RegionConfig {
  return REGIONS.find((r) => r.slug === slug) || REGIONS[0];
}
