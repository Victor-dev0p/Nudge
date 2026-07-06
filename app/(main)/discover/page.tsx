// app/(app)/discover/page.tsx

import type { Metadata } from "next";
import DiscoverClient from "./DiscoverClient";

export const metadata: Metadata = {
  title: "Discover — Nudge",
  description: "Find accountability partners, certified practitioners, and your community.",
};

export default function DiscoverPage() {
  return <DiscoverClient />;
}