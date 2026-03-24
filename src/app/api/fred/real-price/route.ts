// ============================================================
// API Route: /api/fred/real-price
// Computes inflation-adjusted (real) listing prices.
//
// How it works:
//   1. Fetches the nominal Median Listing Price from FRED
//   2. Fetches the CPI (Consumer Price Index) from FRED
//   3. Adjusts each price to "today's dollars" using the formula:
//      Real Price = Nominal Price × (Latest CPI / CPI at that date)
//
// This lets you see whether homes are actually getting more
// expensive, or if rising prices are just due to inflation.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey || apiKey === "YOUR_FRED_API_KEY_HERE") {
    return NextResponse.json(
      { error: "FRED API key is not configured." },
      { status: 500 }
    );
  }

  // The nominal price series ID (e.g. MEDLISPRI12099)
  const seriesId = request.nextUrl.searchParams.get("seriesId");
  if (!seriesId) {
    return NextResponse.json(
      { error: "Missing required query parameter: seriesId" },
      { status: 400 }
    );
  }

  try {
    // Fetch both series in parallel for speed
    const [priceRes, cpiRes] = await Promise.all([
      fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${apiKey}&file_type=json`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    if (!priceRes.ok || !cpiRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from FRED" },
        { status: 500 }
      );
    }

    const priceData = await priceRes.json();
    const cpiData = await cpiRes.json();

    // Build a lookup: "2024-01" -> CPI value
    // CPI is monthly, so we key by year-month
    const cpiByMonth: Record<string, number> = {};
    for (const obs of cpiData.observations) {
      if (obs.value !== "." && obs.value !== "") {
        const yearMonth = obs.date.slice(0, 7); // "2024-01"
        cpiByMonth[yearMonth] = parseFloat(obs.value);
      }
    }

    // Find the most recent CPI value (our "today's dollars" baseline)
    const cpiDates = Object.keys(cpiByMonth).sort();
    const latestCpi = cpiByMonth[cpiDates[cpiDates.length - 1]];

    // Adjust each price observation
    const adjustedObservations = priceData.observations
      .filter(
        (obs: { value: string }) => obs.value !== "." && obs.value !== ""
      )
      .map((obs: { date: string; value: string }) => {
        const yearMonth = obs.date.slice(0, 7);
        const cpiAtDate = cpiByMonth[yearMonth];
        const nominalPrice = parseFloat(obs.value);

        if (!cpiAtDate || cpiAtDate === 0) {
          // If we don't have CPI data for this month, skip it
          return { date: obs.date, value: "." };
        }

        // The core formula: adjust to today's dollars
        const realPrice = nominalPrice * (latestCpi / cpiAtDate);

        return {
          date: obs.date,
          value: realPrice.toFixed(1),
        };
      });

    return NextResponse.json({ observations: adjustedObservations });
  } catch (err) {
    console.error("Real price calculation error:", err);
    return NextResponse.json(
      { error: "Failed to compute inflation-adjusted prices" },
      { status: 500 }
    );
  }
}
