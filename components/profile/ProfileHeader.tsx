// components/profile/ProfileHeader.tsx

"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { colors, tierColors, motion as motionTokens } from "@/lib/theme";
import type { NudgeUser } from "@/types/user";

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
  const tc = tierColors[user.activeTier];

  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Top row: avatar + actions */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", marginBottom: "1rem", flexWrap: "wrap" }}>

        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            onClick={isOwnProfile ? onAvatarClick : undefined}
            style={{
              width: "5rem", height: "5rem", borderRadius: "50%",
              overflow: "hidden", cursor: isOwnProfile ? "pointer" : "default",
              background: `${tc.accent}18`,
              border: `2px solid ${tc.accent}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.375rem", fontWeight: 900,
              color: tc.accent, fontFamily: "var(--font-mono)",
              position: "relative",
            }}
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.displayName}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : initials}

            {/* Upload overlay */}
            {isOwnProfile && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: 0, transition: `opacity ${motionTokens.fast}`,
                fontSize: "1.25rem",
                borderRadius: "50%",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                📷
              </div>
            )}
          </div>

          {/* Upload progress ring */}
          {uploadProgress !== null && uploadProgress !== undefined && (
            <div style={{
              position: "absolute", inset: "-4px",
              borderRadius: "50%",
              background: `conic-gradient(${colors.lime.DEFAULT} ${uploadProgress}%, transparent ${uploadProgress}%)`,
              zIndex: -1,
            }} />
          )}
        </div>

        {/* Identity */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 900, color: colors.white.DEFAULT, letterSpacing: "-0.03em", margin: "0 0 0.125rem" }}>
            {user.displayName}
          </h1>
          <p style={{ fontSize: "0.85rem", color: colors.white.muted, margin: "0 0 0.375rem", fontFamily: "var(--font-mono)" }}>
            @{user.username}
          </p>
          {user.bio && (
            <p style={{ fontSize: "0.875rem", color: colors.white.muted, margin: "0 0 0.75rem", lineHeight: 1.55 }}>
              {user.bio}
            </p>
          )}

          {/* Social counts */}
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
            {[
              { label: "Following", value: user.followingCount },
              { label: "Followers", value: user.followerCount },
              { label: "Sponsors", value: user.sponseeCount },
            ].map((s) => (
              <div key={s.label}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: colors.white.DEFAULT }}>{s.value}</span>
                <span style={{ fontSize: "0.75rem", color: colors.white.muted, marginLeft: "0.3rem" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        {isOwnProfile ? (
          <button
            onClick={onEditClick}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: `1.5px solid ${colors.obsidian.border}`,
              background: "transparent",
              color: colors.white.muted,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: `all ${motionTokens.fast}`,
              alignSelf: "flex-start",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.lime.DEFAULT; e.currentTarget.style.color = colors.lime.DEFAULT; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.obsidian.border; e.currentTarget.style.color = colors.white.muted; }}
          >
            Edit Profile
          </button>
        ) : (
          <button
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: `1.5px solid ${colors.lime.DEFAULT}`,
              background: `${colors.lime.DEFAULT}15`,
              color: colors.lime.DEFAULT,
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              alignSelf: "flex-start",
              flexShrink: 0,
            }}
          >
            Follow
          </button>
        )}
      </div>

      {/* Vitals strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
        {[
          { label: "Best Streak",     value: `${user.totalStreak}d`,                   accent: colors.lime.DEFAULT  },
          { label: "Completion",      value: `${user.lifetimeCompletionRate}%`,          accent: colors.lime.DEFAULT  },
          { label: "Total Earned",    value: `₦${(user.totalEarned / 100).toLocaleString()}`, accent: colors.amber.DEFAULT },
        ].map((v) => (
          <div key={v.label} style={{ padding: "0.875rem", background: colors.obsidian.surface, border: `1px solid ${colors.obsidian.border}`, borderRadius: "12px", textAlign: "center" }}>
            <p style={{ fontSize: "1.375rem", fontWeight: 900, color: v.accent, margin: "0 0 0.2rem", letterSpacing: "-0.02em", fontFamily: "var(--font-display)" }}>{v.value}</p>
            <p style={{ fontSize: "0.7rem", color: colors.white.muted, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{v.label}</p>
          </div>
        ))}
      </div>

      {/* Tier badges */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <span style={{ padding: "0.3rem 0.75rem", borderRadius: "100px", background: `${tc.accent}12`, border: `1px solid ${tc.accent}30`, fontSize: "0.7rem", fontWeight: 700, color: tc.accent, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
          {tc.label}
        </span>
        {user.totalStreak >= 7 && (
          <span style={{ padding: "0.3rem 0.75rem", borderRadius: "100px", background: `${colors.lime.DEFAULT}12`, border: `1px solid ${colors.lime.DEFAULT}30`, fontSize: "0.7rem", fontWeight: 700, color: colors.lime.DEFAULT, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
            {user.totalStreak}d Streak
          </span>
        )}
      </div>
    </div>
  );
}