// app/(app)/messages/page.tsx

import type { Metadata } from "next";
import MessagesClient from "./MessagesClient";

export const metadata: Metadata = {
  title: "Messages — Nudge",
  description: "Your accountability conversations and proof audit log.",
};

export default function MessagesPage() {
  return <MessagesClient />;
}