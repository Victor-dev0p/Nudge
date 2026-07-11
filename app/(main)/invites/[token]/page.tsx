// app/(main)/invites/[token]/page.tsx

import type { Metadata } from "next";
import InviteClient from "./InviteClient";

export const metadata: Metadata = {
  title: "Accept Partnership — Nudge",
  description: "Accept an accountability partnership on Nudge.",
};

export default function InvitePage({ params }: { params: { token: string } }) {
  return <InviteClient token={params.token} />;
}