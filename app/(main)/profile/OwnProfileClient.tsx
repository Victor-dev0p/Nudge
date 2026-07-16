"use client";

import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { ProfileShell } from "@/components/profile/ProfileShell";
import { colors } from "@/lib/theme";

// 1. The Main Wrapper handles Auth resolution first
export default function OwnProfileClient() {
  const { user: authUser, loading: authLoading } = useAuth();

  // Keep showing loader while Firebase Auth initializes
  if (authLoading) return <FullPageLoader />;

  // Safety net if someone bypasses AuthGuard
  if (!authUser) return <FullPageError message="Not signed in." />;

  // Auth is fully loaded and we have a guaranteed UID!
  return <ProfileDataLoader uid={authUser.uid} />;
}

// 2. This child component only mounts once we have a guaranteed UID
function ProfileDataLoader({ uid }: { uid: string }) {
  const { user, goals, journal, loading: profileLoading, error } = useProfile(uid);

  if (profileLoading) return <FullPageLoader />;

  if (error || !user) return <FullPageError message={error ?? "Profile not found."} />;

  return (
    <ProfileShell
      user={user}
      goals={goals}
      journal={journal}
      isOwnProfile={true}
    />
  );
}

// --- KEEP YOUR SAME LOADER AND ERROR COMPONENTS BELOW ---
function FullPageLoader() {
  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "1rem",
      background: colors.obsidian.DEFAULT,
    }}>
      <span className="nudge-wordmark" style={{ fontSize: "1rem", color: colors.lime.DEFAULT }}>
        NUDGE
      </span>
      <div style={{
        width: "20px", height: "20px", borderRadius: "50%",
        border: `2px solid ${colors.obsidian.border}`,
        borderTopColor: colors.lime.DEFAULT,
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function FullPageError({ message }: { message: string }) {
  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: colors.obsidian.DEFAULT,
    }}>
      <p style={{ color: colors.status.danger, fontSize: "0.9rem" }}>{message}</p>
    </div>
  );
}