// app/(main)/profile/[uid]/page.tsx

import type { Metadata } from "next";
import UserProfileClient from "./UserProfileClient";

export const metadata: Metadata = {
  title: "Profile — Nudge",
};

export default async function UserProfilePage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  console.log("PROFILE PAGE UID:", uid); // TEMP DEBUG
  return <UserProfileClient uid={uid} />;
}