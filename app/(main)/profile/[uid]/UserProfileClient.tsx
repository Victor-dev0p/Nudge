// app/(main)/profile/[uid]/UserProfileClient.tsx

"use client";

import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { ProfileShell } from "@/components/profile/ProfileShell";
import { colors } from "@/lib/theme";
import { useRouter } from "next/navigation";

export default function UserProfileClient({ uid }: { uid: string }) {
  const { user: authUser } = useAuth();
  const { user, goals, journal, loading, error } = useProfile(uid);
  const router = useRouter();

  // If viewing own profile via /profile/[uid], redirect to /profile
  if (authUser?.uid === uid) {
    router.replace("/profile");
    return null;
  }

  if (loading) return <FullPageLoader />;
  if (error || !user) return <FullPageError message={error ?? "Profile not found."} />;

  return (
    <ProfileShell
      user={user}
      goals={goals}
      journal={journal.filter((e) => e.isPublic)} // enforce public-only for other users
      isOwnProfile={false}
    />
  );
}

function FullPageLoader() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", background: colors.obsidian.DEFAULT }}>
      <span className="nudge-wordmark" style={{ fontSize: "1rem", color: colors.lime.DEFAULT }}>NUDGE</span>
      <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${colors.obsidian.border}`, borderTopColor: colors.lime.DEFAULT, animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function FullPageError({ message }: { message: string }) {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.obsidian.DEFAULT }}>
      <p style={{ color: colors.status.danger, fontSize: "0.9rem" }}>{message}</p>
    </div>
  );
}