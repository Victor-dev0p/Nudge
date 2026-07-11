// app/(main)/dashboard/page.tsx

import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — Nudge",
  description: "Your target, your streak, your stakes. Stay aligned.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}