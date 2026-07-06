import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Begin Your Target — Nudge",
  description:
    "Set your goal. Choose your stakes. Find your partner. The arrow doesn't miss twice.",
  openGraph: {
    title: "Begin Your Target — Nudge",
    description: "Accountability with teeth. Set your goal and draw the bow.",
    type: "website",
  },
};

export default function SignupPage() {
  return <SignupClient />;
}