// components/profile/JournalTab.tsx

"use client";

import React, { useState } from "react";
import { colors, motion as motionTokens } from "@/lib/theme";
import type { JournalEntry } from "@/types/profile";
import type { GoalCategory, NudgeUser } from "@/types/user";
import { createJournalEntry, deleteJournalEntry } from "@/lib/useProfile";
import { publishJournalToFeed } from "@/lib/usePulse";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/types/user";

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  tech_execution:       { label: "Tech / Dev",       emoji: "⚡" },
  business_strategy:    { label: "Business",          emoji: "📈" },
  health_fitness:       { label: "Health & Fitness",  emoji: "🔥" },
  mental_health_trauma: { label: "Mental Health",     emoji: "🧠" },
  addiction_recovery:   { label: "Recovery",          emoji: "🛡️" },
  learning_skill:       { label: "Learning",          emoji: "🎯" },
  creative:             { label: "Creative",          emoji: "✦"  },
  financial:            { label: "Financial",         emoji: "💎" },
  relationship:         { label: "Relationships",     emoji: "🤝" },
  other:                { label: "Other",             emoji: "◎"  },
};

interface JournalTabProps {
  journal: JournalEntry[];
  uid: string;
  isOwnProfile: boolean;
}

export function JournalTab({ journal, uid, isOwnProfile }: JournalTabProps) {
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<GoalCategory>("other");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await createJournalEntry(uid, {
        title: title.trim(),
        content: content.trim(),
        category,
        isPublic,
      });
      setTitle(""); setContent(""); setCategory("other"); setIsPublic(true);
      setComposing(false);
    } finally {
      setSaving(false);
    }
  };

  const visible = isOwnProfile ? journal : journal.filter((e) => e.isPublic);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {/* Compose button */}
      {isOwnProfile && !composing && (
        <button
          onClick={() => setComposing(true)}
          style={{ width: "100%", padding: "0.875rem", borderRadius: "12px", border: `1.5px dashed ${colors.obsidian.border}`, background: "transparent", color: colors.white.ghost, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit", marginBottom: "1.25rem", transition: `all ${motionTokens.fast}` }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.lime.DEFAULT; e.currentTarget.style.color = colors.lime.DEFAULT; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.obsidian.border; e.currentTarget.style.color = colors.white.ghost; }}
        >
          + Write a journal entry
        </button>
      )}

      {/* Compose form */}
      {composing && (
        <div style={{ padding: "1.25rem", background: colors.obsidian.surface, border: `1.5px solid ${colors.lime.DEFAULT}40`, borderRadius: "14px", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            style={{ width: "100%", padding: "0.75rem 1rem", background: colors.obsidian.elevated, border: `1px solid ${colors.obsidian.border}`, borderRadius: "10px", color: colors.white.DEFAULT, fontSize: "0.95rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your journey, a win, a setback, or what you learned today..."
            rows={5}
            style={{ width: "100%", padding: "0.75rem 1rem", background: colors.obsidian.elevated, border: `1px solid ${colors.obsidian.border}`, borderRadius: "10px", color: colors.white.DEFAULT, fontSize: "0.9rem", outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as GoalCategory)}
            style={{ padding: "0.75rem 1rem", background: colors.obsidian.elevated, border: `1px solid ${colors.obsidian.border}`, borderRadius: "10px", color: colors.white.DEFAULT, fontSize: "0.875rem", outline: "none", fontFamily: "inherit", cursor: "pointer" }}
          >
            {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
              <option key={key} value={key} style={{ background: colors.obsidian.surface }}>
                {val.emoji} {val.label}
              </option>
            ))}
          </select>

          {/* Visibility toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <button
              onClick={() => setIsPublic(!isPublic)}
              style={{ width: "36px", height: "20px", borderRadius: "100px", background: isPublic ? colors.lime.DEFAULT : colors.obsidian.border, border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: `background ${motionTokens.fast}` }}
            >
              <div style={{ position: "absolute", top: "2px", left: isPublic ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "white", transition: `left ${motionTokens.fast}` }} />
            </button>
            <span style={{ fontSize: "0.8rem", color: colors.white.muted }}>
              {isPublic ? "Public — visible on your profile" : "Private — only you can see this"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.625rem" }}>
            <button onClick={() => setComposing(false)} style={{ padding: "0.75rem 1.25rem", borderRadius: "10px", border: `1px solid ${colors.obsidian.border}`, background: "transparent", color: colors.white.muted, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || saving}
              style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "none", background: title.trim() && content.trim() ? colors.lime.DEFAULT : colors.obsidian.border, color: title.trim() && content.trim() ? colors.obsidian.DEFAULT : colors.white.ghost, fontSize: "0.875rem", fontWeight: 700, cursor: title.trim() && content.trim() ? "pointer" : "default", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </div>
      )}

      {/* Entry list */}
      {visible.length === 0 ? (
        <p style={{ textAlign: "center", color: colors.white.ghost, fontSize: "0.875rem", padding: "2rem 0" }}>
          {isOwnProfile ? "No journal entries yet. Write your first one." : "No public entries yet."}
        </p>
      ) : (
        visible.map((entry, i) => (
          <JournalEntryCard
            key={entry.id}
            entry={entry}
            isLast={i === visible.length - 1}
            isOwnProfile={isOwnProfile}
            uid={uid}
          />
        ))
      )}
    </div>
  );
}

function JournalEntryCard({ entry, isLast, isOwnProfile, uid }: {
  entry: JournalEntry; isLast: boolean; isOwnProfile: boolean; uid: string;
}) {
  const [deleting, setDeleting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const cat = CATEGORY_LABELS[entry.category];

  const handleDelete = async () => {
    if (!confirm("Delete this journal entry?")) return;
    setDeleting(true);
    try { await deleteJournalEntry(uid, entry.id); } finally { setDeleting(false); }
  };

  const handleShareToPulse = async () => {
    if (sharing || shared) return;
    setSharing(true);
    try {
      // Load user doc to get full NudgeUser for post authoring
      const userSnap = await getDoc(doc(db, COLLECTIONS.users, uid));
      if (!userSnap.exists()) return;
      const nudgeUser = userSnap.data() as NudgeUser;
      await publishJournalToFeed(nudgeUser, entry.id, entry.title, entry.content, entry.category);
      setShared(true);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div style={{ padding: "1.125rem 0", borderBottom: isLast ? "none" : `1px solid ${colors.obsidian.border}` }}>
      {/* Meta row */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.375rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.75rem", color: colors.white.ghost }}>{formatDate(entry.createdAt)}</span>
        <span style={{ fontSize: "0.75rem", color: colors.white.ghost }}>·</span>
        <span style={{ fontSize: "0.75rem", color: colors.white.ghost }}>{cat?.emoji} {cat?.label}</span>
        {isOwnProfile && !entry.isPublic && (
          <span style={{ fontSize: "0.65rem", color: colors.amber.DEFAULT, background: `${colors.amber.DEFAULT}15`, padding: "0.1rem 0.5rem", borderRadius: "100px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>PRIVATE</span>
        )}
        {/* Owner actions */}
        {isOwnProfile && (
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.625rem", alignItems: "center" }}>
            {/* Share to Pulse */}
            {entry.isPublic && (
              <button
                onClick={handleShareToPulse}
                disabled={sharing || shared}
                style={{ background: "none", border: `1px solid ${shared ? colors.lime.DEFAULT : colors.obsidian.border}`, borderRadius: "100px", color: shared ? colors.lime.DEFAULT : colors.white.ghost, fontSize: "0.72rem", cursor: shared ? "default" : "pointer", fontFamily: "inherit", padding: "0.2rem 0.625rem", transition: `all ${motionTokens.fast}` }}
                onMouseEnter={(e) => { if (!shared) { e.currentTarget.style.borderColor = colors.lime.DEFAULT; e.currentTarget.style.color = colors.lime.DEFAULT; } }}
                onMouseLeave={(e) => { if (!shared) { e.currentTarget.style.borderColor = colors.obsidian.border; e.currentTarget.style.color = colors.white.ghost; } }}
              >
                {shared ? "✓ Shared to Pulse" : sharing ? "Sharing..." : "Share to Pulse"}
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{ background: "none", border: "none", color: colors.white.ghost, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", opacity: deleting ? 0.5 : 1 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.status.danger)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.white.ghost)}
            >Delete</button>
          </div>
        )}
      </div>

      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: colors.white.DEFAULT, margin: "0 0 0.5rem", letterSpacing: "-0.01em" }}>
        {entry.title}
      </h3>
      <p style={{ fontSize: "0.875rem", color: colors.white.muted, margin: 0, lineHeight: 1.65 }}>
        {entry.content}
      </p>
    </div>
  );
}

function formatDate(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 86_400_000) return "Today";
  if (diff < 172_800_000) return "Yesterday";
  return new Date(ms).toLocaleDateString([], { month: "short", day: "numeric" });
}