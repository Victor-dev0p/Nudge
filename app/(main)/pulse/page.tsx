// app/(app)/pulse/page.tsx

import type { Metadata } from "next";
import PulseClient from "./PulseClient";

export const metadata: Metadata = {
  title: "Pulse — Nudge",
  description: "The global feed. Real people. Real proof. Real stakes.",
};

export default function PulsePage() {
  return <PulseClient />;
}