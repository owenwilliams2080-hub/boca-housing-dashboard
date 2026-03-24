// ============================================================
// API Route: /api/fred
// This runs on the SERVER, not in the browser.
// It reads the FRED API key from the environment variable,
// calls the real FRED API, and returns the data to the browser.
// This way the API key never leaves the server.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/fred?seriesId=ATNHPIUS48424Q
 *
 * Query params:
 *   seriesId (required) — the FRED series to fetch
 */
export async function GET(request: NextRequest) {
  // 1. Read the API key from the environment variable
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey || apiKey === "YOUR_FRED_API_KEY_HERE") {
    return NextResponse.json(
      {
        error:
          "FRED API key is not configured. Add your key to the .env.local file.",
      },
      { status: 500 }
    );
  }

  // 2. Get the series ID from the URL query string
  const seriesId = request.nextUrl.searchParams.get("seriesId");

  if (!seriesId) {
    return NextResponse.json(
      { error: "Missing required query parameter: seriesId" },
      { status: 400 }
    );
  }

  // 3. Build the FRED API URL
  const fredUrl = new URL(
    "https://api.stlouisfed.org/fred/series/observations"
  );
  fredUrl.searchParams.set("series_id", seriesId);
  fredUrl.searchParams.set("api_key", apiKey);
  fredUrl.searchParams.set("file_type", "json");

  try {
    // 4. Fetch from the real FRED API
    const fredResponse = await fetch(fredUrl.toString(), {
      // Cache for 1 hour — FRED data doesn't update every second
      next: { revalidate: 3600 },
    });

    if (!fredResponse.ok) {
      return NextResponse.json(
        { error: `FRED API returned status ${fredResponse.status}` },
        { status: fredResponse.status }
      );
    }

    const data = await fredResponse.json();

    // 5. Return the data to the browser
    return NextResponse.json(data);
  } catch (err) {
    console.error("FRED API fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch data from FRED" },
      { status: 500 }
    );
  }
}
