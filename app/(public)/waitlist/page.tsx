// app/(public)/waitlist/page.tsx

import type { Metadata } from "next";
import WaitlistClient from "./WaitlistClient";

export const metadata: Metadata = {
  title: "Join the Closed Beta — Nudge",
  description:
    "Good intentions won't save your goals. Immediate consequences will. Join the Nudge closed beta — lock stakes, submit proof, split the slacker pool.",
  openGraph: {
    title: "Join Nudge — Hardcore Accountability. Real Stakes.",
    description:
      "Commit your target, lock an escrow stake, upload live proof. Win and split the slacker tax pool. Slack and lose everything.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Nudge — Hardcore Accountability. Real Stakes.",
    description:
      "Commit your target, lock an escrow stake, upload live proof. Win and split the slacker tax pool. Slack and lose everything.",
  },
};

export default function WaitlistPage() {
  return <WaitlistClient />;
}