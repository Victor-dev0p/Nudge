// components/profile/ProfileHeader.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { colors, tierColors, motion as motionTokens } from "@/lib/theme";
import type { NudgeUser } from "@/types/user";
import { useAuth } from "@/lib/auth";
import { useIsFollowing, followUser, unfollowUser } from "@/lib/useFollow";

interface ProfileHeaderProps {
  user: NudgeUser;
  isOwnProfile: boolean;
  uploadProgress?: number | null;
  onEditClick?: () => void;
  onAvatarClick?: () => void;
}

export function ProfileHeader({
  user,
  isOwnProfile,
  uploadProgress,
  onEditClick,
  onAvatarClick,
}: ProfileHeaderProps) {
  const { user: authUser } = useAuth();
  const tc = tierColors[user.activeTier];
  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const isFollowing = useIsFollowing(authUser?.uid ?? null, user.uid);
  const [followLoading, setFollowLoading] = useState(false);

  const handleFollow = async () => {
    if (!authUser || followLoading) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(authUser.uid, user.uid);
      } else {
        await followUser(authUser.uid, user.uid);
      }
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "1.25rem" }}>

      {/* Row 1: avatar + action button */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>

        {/* Avatar */}
        <div
          onClick={isOwnProfile ? onAvatarClick : undefined}
          style={{
            position: "relative",
            width: "72px", height: "72px",
            borderRadius: "50%", overflow: "hidden",
            cursor: isOwnProfile ? "pointer" : "default",
            background: `${tc.accent}18`,
            border: `2.5px solid ${tc.accent}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.375rem", fontWeight: 900,
            color: tc.accent, fontFamily: "var(--font-mono)",
            flexShrink: 0,
          }}
        >
          {user.avatarUrl
            ? <Image src={user.avatarUrl} alt={user.displayName} fill style={{ objectFit: "cover" }} />
            : initials}

          {uploadProgress !== null && uploadProgress !== undefined && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: colors.lime.DEFAULT, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
              {uploadProgress}%
            </div>
          )}
        </div>

        {/* Action button */}
        {isOwnProfile ? (
          <button
            onClick={onEditClick}
            style={{ padding: "0.45rem 1rem", borderRadius: "100px", border: `1.5px solid ${colors.obsidian.border}`, background: "transparent", color: colors.white.DEFAULT, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: `all ${motionTokens.fast}` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.lime.DEFAULT; e.currentTarget.style.color = colors.lime.DEFAULT; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.obsidian.border; e.currentTarget.style.color = colors.white.DEFAULT; }}
          >
            Edit profile
          </button>
        ) : (
          <button
            onClick={handleFollow}
            disabled={followLoading}
            style={{
              padding: "0.45rem 1.25rem",
              borderRadius: "100px",
              border: isFollowing ? `1.5px solid ${colors.obsidian.border}` : "none",
              background: isFollowing ? "transparent" : colors.lime.DEFAULT,
              color: isFollowing ? colors.white.DEFAULT : colors.obsidian.DEFAULT,
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: followLoading ? "wait" : "pointer",
              fontFamily: "inherit",
              opacity: followLoading ? 0.7 : 1,
              transition: `all ${motionTokens.fast}`,
            }}
          >
            {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Row 2: name + handle */}
      <div style={{ marginBottom: "0.625rem" }}>
        <h1 style={{ fontSize: "1.125rem", fontWeight: 900, color: colors.white.DEFAULT, letterSpacing: "-0.02em", margin: "0 0 0.125rem" }}>
          {user.displayName}
        </h1>
        <p style={{ fontSize: "0.85rem", color: colors.white.muted, margin: 0, fontFamily: "var(--font-mono)" }}>
          @{user.username}
        </p>
      </div>

      {/* Row 3: bio */}
      {user.bio && (
        <p style={{ fontSize: "0.875rem", color: colors.white.DEFAULT, lineHeight: 1.55, margin: "0 0 0.75rem" }}>
          {user.bio}
        </p>
      )}

      {/* Row 4: social counts — inline like X */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {[
          { value: user.followingCount, label: "Following" },
          { value: user.followerCount,  label: "Followers" },
          { value: user.sponseeCount,   label: "Sponsors"  },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: colors.white.DEFAULT }}>{s.value}</span>
            <span style={{ fontSize: "0.8rem", color: colors.white.muted }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Row 5: badges */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <span style={{ padding: "0.25rem 0.75rem", borderRadius: "100px", background: `${tc.accent}12`, border: `1px solid ${tc.accent}30`, fontSize: "0.7rem", fontWeight: 700, color: tc.accent, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
          {tc.label}
        </span>
        {user.totalStreak >= 7 && (
          <span style={{ padding: "0.25rem 0.75rem", borderRadius: "100px", background: `${colors.lime.DEFAULT}12`, border: `1px solid ${colors.lime.DEFAULT}30`, fontSize: "0.7rem", fontWeight: 700, color: colors.lime.DEFAULT, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
            {user.totalStreak}d Streak 🔥
          </span>
        )}
      </div>

      {/* Row 6: vitals strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
        {[
          { label: "Best Streak", value: `${user.totalStreak}d`,                           accent: colors.lime.DEFAULT  },
          { label: "Completion",  value: `${user.lifetimeCompletionRate}%`,                accent: colors.lime.DEFAULT  },
          { label: "Earned",      value: `₦${(user.totalEarned / 100).toLocaleString()}`, accent: colors.amber.DEFAULT },
        ].map((v) => (
          <div key={v.label} style={{ padding: "0.75rem 0.5rem", background: colors.obsidian.surface, border: `1px solid ${colors.obsidian.border}`, borderRadius: "12px", textAlign: "center" }}>
            <p style={{ fontSize: "1.125rem", fontWeight: 900, color: v.accent, margin: "0 0 0.15rem", letterSpacing: "-0.02em", fontFamily: "var(--font-display)" }}>{v.value}</p>
            <p style={{ fontSize: "0.62rem", color: colors.white.muted, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{v.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}