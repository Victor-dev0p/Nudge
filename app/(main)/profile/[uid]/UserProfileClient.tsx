"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { ProfileShell } from "@/components/profile/ProfileShell";
import { colors } from "@/lib/theme";

export default function UserProfileClient({ uid }: { uid: string }) {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const isOwnProfile = !authLoading && authUser?.uid === uid;

  // If viewing own profile via /profile/[uid], redirect to /profile
  useEffect(() => {
    if (isOwnProfile) {
      router.replace("/profile");
    }
  }, [isOwnProfile, router]);

  // 1. Wait for Firebase Auth to finish resolving
  if (authLoading) return <FullPageLoader />;

  // 2. If it's the user's own profile, show loader while redirect completes
  if (isOwnProfile) return <FullPageLoader />;

  // 3. Auth is resolved and it's another user -> mount data fetcher with guaranteed UID!
  return <OtherUserProfileDataLoader uid={uid} />;
}

function OtherUserProfileDataLoader({ uid }: { uid: string }) {
  const { user, goals, journal, loading: profileLoading, error } = useProfile(uid);

  if (profileLoading) return <FullPageLoader />;

  if (error || !user) return <FullPageError message={error ?? "Profile not found."} />;

  return (
    <ProfileShell
      user={user}
      goals={goals}
      journal={journal.filter((e) => e.isPublic)}
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