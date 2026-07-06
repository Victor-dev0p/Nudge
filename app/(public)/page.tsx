import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Nudge — Hit Your Targets",
  description:
    "Accountability with teeth. Set goals, lock stakes, get watched. Nudge keeps you precise when the wind picks up.",
  openGraph: {
    title: "Nudge — Hit Your Targets",
    description:
      "Set goals, lock stakes, get watched. The arrow doesn't miss twice.",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeClient />;
}