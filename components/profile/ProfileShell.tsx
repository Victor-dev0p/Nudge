// components/profile/ProfileShell.tsx

"use client";

import React, { useState, useRef } from "react";
import { colors, motion as motionTokens } from "@/lib/theme";
import type { NudgeUser, NudgeGoal } from "@/types/user";
import type { JournalEntry } from "@/types/profile";
import { ProfileHeader } from "./ProfileHeader";
import { GoalsTab } from "./GoalsTab";
import { JournalTab } from "./JournalTab";
import { StatsTab } from "./StatsTab";
import { EditProfileModal } from "./EditProfileModal";
import { uploadAvatar } from "@/lib/useProfile";

type ProfileTab = "goals" | "journal" | "stats";

const TABS: { key: ProfileTab; label: string }[] = [
  { key: "goals",   label: "Goals"   },
  { key: "journal", label: "Journal" },
  { key: "stats",   label: "Stats"   },
];

interface ProfileShellProps {
  user: NudgeUser;
  goals: NudgeGoal[];
  journal: JournalEntry[];
  isOwnProfile: boolean;
}

export function ProfileShell({ user, goals, journal, isOwnProfile }: ProfileShellProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("goals");
  const [editOpen, setEditOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isOwnProfile) fileInputRef.current?.click();
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploadProgress(0);
    try {
      await uploadAvatar(user.uid, file, setUploadProgress);
    } finally {
      setUploadProgress(null);
    }
    e.target.value = "";
  };

  return (
    <div style={{
      maxWidth: "680px",
      margin: "0 auto",
      padding: "1.5rem 1rem",
      paddingBottom: "calc(5rem + env(safe-area-inset-bottom))",
    }}>
      {/* Hidden file input for avatar */}
      {isOwnProfile && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarSelect}
          style={{ display: "none" }}
        />
      )}

      {/* Header */}
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        uploadProgress={uploadProgress}
        onEditClick={() => setEditOpen(true)}
        onAvatarClick={handleAvatarClick}
      />

      {/* Tab bar */}
      <div style={{
        display: "flex",
        borderBottom: `1px solid ${colors.obsidian.border}`,
        marginBottom: "1.25rem",
      }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "0.625rem 1.125rem",
                background: "none",
                border: "none",
                borderBottom: isActive ? `2px solid ${colors.lime.DEFAULT}` : "2px solid transparent",
                color: isActive ? colors.white.DEFAULT : colors.white.ghost,
                fontSize: "0.85rem",
                fontWeight: isActive ? 700 : 400,
                cursor: "pointer",
                transition: `all ${motionTokens.fast}`,
                fontFamily: "inherit",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "goals" && <GoalsTab goals={goals} />}
      {activeTab === "journal" && (
        <JournalTab journal={journal} uid={user.uid} isOwnProfile={isOwnProfile} />
      )}
      {activeTab === "stats" && <StatsTab user={user} goals={goals} />}

      {/* Edit modal */}
      {editOpen && (
        <EditProfileModal user={user} onClose={() => setEditOpen(false)} />
      )}
    </div>
  );
}