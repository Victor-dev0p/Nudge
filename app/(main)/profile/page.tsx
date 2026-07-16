// app/(main)/profile/page.tsx

import type { Metadata } from "next";
import OwnProfileClient from "./OwnProfileClient";

export const metadata: Metadata = {
  title: "Profile — Nudge",
  description: "Your growth journey, goals, and accountability record.",
};

export default function ProfilePage() {
  return <OwnProfileClient />;
}