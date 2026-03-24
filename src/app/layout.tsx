// ============================================================
// Root Layout
// This wraps every page in the app. It sets the HTML <head>
// metadata (title, description) and loads global CSS + fonts.
// Next.js requires this file in the app/ directory.
// ============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load the Inter font from Google Fonts — a clean, modern sans-serif
const inter = Inter({ subsets: ["latin"] });

// These show up in browser tabs and search engine results
export const metadata: Metadata = {
  title: "Boca Raton Housing Dashboard",
  description:
    "Track housing market trends for the West Palm Beach–Boca Raton–Boynton Beach metro area using FRED economic data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
