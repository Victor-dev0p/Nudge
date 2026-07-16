// components/profile/EditProfileModal.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { colors, motion as motionTokens } from "@/lib/theme";
import type { NudgeUser } from "@/types/user";
import { updateProfileInfo, uploadAvatar } from "@/lib/useProfile";

interface EditProfileModalProps {
  user: NudgeUser;
  onClose: () => void;
}

export function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    setUploadProgress(0);
    try {
      await uploadAvatar(user.uid, file, setUploadProgress);
      setUploadProgress(null);
    } catch {
      setError("Avatar upload failed. Please try again.");
      setUploadProgress(null);
    }
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!displayName.trim()) { setError("Display name is required."); return; }
    setSaving(true);
    setError("");
    try {
      await updateProfileInfo(user.uid, displayName.trim(), bio.trim());
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, backdropFilter: "blur(4px)" }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 201,
        width: "100%", maxWidth: "480px",
        background: colors.obsidian.surface,
        border: `1.5px solid ${colors.obsidian.border}`,
        borderRadius: "20px",
        padding: "1.75rem",
        margin: "0 1rem",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: colors.white.DEFAULT, letterSpacing: "-0.02em", margin: 0 }}>
            Edit Profile
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: colors.white.ghost, cursor: "pointer", fontSize: "1.25rem", padding: "0.25rem" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "56px", height: "56px", borderRadius: "50%",
                background: `${colors.lime.DEFAULT}18`,
                border: `2px solid ${colors.lime.DEFAULT}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", flexShrink: 0,
                fontSize: "1.25rem", fontWeight: 900,
                color: colors.lime.DEFAULT, fontFamily: "var(--font-mono)",
                position: "relative",
              }}
            >
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : (user.displayName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2))}
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", opacity: 0, transition: `opacity ${motionTokens.fast}`, borderRadius: "50%" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >📷</div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarSelect} style={{ display: "none" }} />
            <div>
              <p style={{ fontSize: "0.875rem", color: colors.white.DEFAULT, margin: "0 0 0.2rem", fontWeight: 600 }}>Profile photo</p>
              <p style={{ fontSize: "0.78rem", color: colors.white.ghost, margin: 0 }}>
                {uploadProgress !== null ? `Uploading... ${uploadProgress}%` : "Click the avatar to change"}
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label style={{ display: "block", fontSize: "0.72rem", color: colors.white.muted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              style={{ width: "100%", padding: "0.875rem 1rem", background: colors.obsidian.elevated, border: `1.5px solid ${colors.obsidian.border}`, borderRadius: "10px", color: colors.white.DEFAULT, fontSize: "0.95rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
            />
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: "block", fontSize: "0.72rem", color: colors.white.muted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community who you are and what you're conquering..."
              rows={3}
              maxLength={200}
              style={{ width: "100%", padding: "0.875rem 1rem", background: colors.obsidian.elevated, border: `1.5px solid ${colors.obsidian.border}`, borderRadius: "10px", color: colors.white.DEFAULT, fontSize: "0.9rem", outline: "none", fontFamily: "inherit", resize: "none", lineHeight: 1.55, boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
            />
            <p style={{ fontSize: "0.72rem", color: colors.white.ghost, margin: "0.25rem 0 0", textAlign: "right" }}>{bio.length}/200</p>
          </div>

          {error && (
            <p style={{ fontSize: "0.82rem", color: colors.status.danger, padding: "0.625rem 0.875rem", background: "rgba(255,45,45,0.08)", borderRadius: "8px", margin: 0 }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={onClose} style={{ padding: "0.875rem 1.25rem", borderRadius: "10px", border: `1.5px solid ${colors.obsidian.border}`, background: "transparent", color: colors.white.muted, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !displayName.trim()}
              style={{ flex: 1, padding: "0.875rem", borderRadius: "10px", border: "none", background: colors.lime.DEFAULT, color: colors.obsidian.DEFAULT, fontSize: "0.9rem", fontWeight: 700, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "inherit" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}