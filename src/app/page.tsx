// ============================================================
// Home Page (root "/")
// Redirects to the Palm Beach County dashboard by default.
// This way visitors always land on a region with data.
// ============================================================

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/palm-beach");
}
