// app/(main)/profile/[uid]/page.tsx

import type { Metadata } from "next";
import UserProfileClient from "./UserProfileClient";

export const metadata: Metadata = {
  title: "Profile — Nudge",
};

export default function UserProfilePage({ params }: { params: { uid: string } }) {
  return <UserProfileClient uid={params.uid} />;
}