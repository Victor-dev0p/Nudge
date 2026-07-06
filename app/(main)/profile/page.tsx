// app/(app)/profile/page.tsx

import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Profile — Nudge",
  description: "Your growth journey, public stats, and accountability record.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}