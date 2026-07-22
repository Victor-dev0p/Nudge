// app/(main)/pulse/PulseClient.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { colors, motion as motionTokens } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { useFeed, useReplies, fuelPost, replyToPost, createPost } from "@/lib/usePulse";
import type { FeedPost, PostReply } from "@/types/posts";
import type { NudgeUser, GoalCategory } from "@/types/user";
import { COLLECTIONS } from "@/types/user";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type FeedTab = "global" | "in_danger";

const CATEGORY_EMOJIS: Record<string, string> = {
  tech_execution: "⚡", business_strategy: "📈", health_fitness: "🔥",
  mental_health_trauma: "🧠", addiction_recovery: "🛡️", learning_skill: "🎯",
  creative: "✦", financial: "💎", relationship: "🤝", other: "◎",
};

const CATEGORY_LABELS: Record<string, string> = {
  tech_execution: "Tech / Dev", business_strategy: "Business",
  health_fitness: "Health & Fitness", mental_health_trauma: "Mental Health",
  addiction_recovery: "Recovery", learning_skill: "Learning",
  creative: "Creative", financial: "Financial",
  relationship: "Relationships", other: "Other",
};

const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
  key: key as GoalCategory, label,
  emoji: CATEGORY_EMOJIS[key] ?? "◎",
}));

export default function PulseClient() {
  const { user: authUser } = useAuth();
  const { posts, loading } = useFeed();
  const [activeTab, setActiveTab] = useState<FeedTab>("global");
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [nudgeUser, setNudgeUser] = useState<NudgeUser | null>(null);

  // Load the full NudgeUser doc (needed for createPost)
  React.useEffect(() => {
    if (!authUser) return;
    getDoc(doc(db, COLLECTIONS.users, authUser.uid)).then((snap) => {
      if (snap.exists()) setNudgeUser(snap.data() as NudgeUser);
    });
  }, [authUser]);

  const visible = activeTab === "in_danger"
    ? posts.filter((p) => p.type === "relapse_slip" || p.type === "system_alert")
    : posts.filter((p) => p.isPublic);

  const TABS: { key: FeedTab; label: string }[] = [
    { key: "global", label: "Global Pulse" },
    { key: "in_danger", label: "In Danger" },
  ];

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "1.25rem 1rem", paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 900, color: colors.white.DEFAULT, letterSpacing: "-0.03em", margin: 0 }}>Pulse</h1>
          <p style={{ fontSize: "0.8rem", color: colors.white.muted, marginTop: "0.2rem" }}>Real people. Real proof.</p>
        </div>
        {/* Compose button */}
        <button
          onClick={() => setComposing(true)}
          style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", background: colors.lime.DEFAULT, color: colors.obsidian.DEFAULT, fontSize: "1.375rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >+</button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${colors.obsidian.border}`, marginBottom: "1rem" }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: "0.625rem 1.125rem", background: "none", border: "none", borderBottom: isActive ? `2px solid ${tab.key === "in_danger" ? colors.amber.DEFAULT : colors.lime.DEFAULT}` : "2px solid transparent", color: isActive ? colors.white.DEFAULT : colors.white.ghost, fontSize: "0.85rem", fontWeight: isActive ? 700 : 400, cursor: "pointer", transition: `all ${motionTokens.fast}`, fontFamily: "inherit", marginBottom: "-1px" }}
            >{tab.label}</button>
          );
        })}
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Spinner /></div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <p style={{ color: colors.white.ghost, fontSize: "0.875rem", lineHeight: 1.6 }}>
            No posts yet. Be the first to share your progress.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {visible.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUid={authUser?.uid ?? ""}
              isExpanded={openPostId === post.id}
              onToggleExpand={() => setOpenPostId(openPostId === post.id ? null : post.id)}
              nudgeUser={nudgeUser}
            />
          ))}
        </div>
      )}

      {/* Compose modal */}
      {composing && nudgeUser && (
        <ComposeModal
          user={nudgeUser}
          onClose={() => setComposing(false)}
        />
      )}
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, currentUid, isExpanded, onToggleExpand, nudgeUser }: {
  post: FeedPost;
  currentUid: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  nudgeUser: NudgeUser | null;
}) {
  const router = useRouter();
  const isFueled = post.fueledBy?.includes(currentUid);
  const tierColor = post.authorTier === "hardcore" ? colors.amber.DEFAULT : post.authorTier === "firm" ? colors.lime.DEFAULT : colors.white.muted;
  const isSlip = post.type === "relapse_slip";
  const isJournal = post.type === "journal";
  const isSystem = post.type === "system_alert";

  const handleFuel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUid) return;
    await fuelPost(post.id, currentUid, isFueled);
  };

  const navigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.authorId !== currentUid) {
      router.push(`/profile/${post.authorId}`);
    } else {
      router.push("/profile");
    }
  };

  return (
    <div style={{ borderBottom: `1px solid ${colors.obsidian.border}`, padding: "1rem 0", background: isSystem ? `${colors.amber.DEFAULT}05` : "transparent" }}>

      {/* Type label */}
      {isSlip && <div style={{ marginBottom: "0.5rem" }}><span style={{ fontSize: "0.7rem", fontWeight: 700, color: colors.status.safe, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>🛡 Honest Slip</span></div>}
      {isJournal && <div style={{ marginBottom: "0.5rem" }}><span style={{ fontSize: "0.7rem", fontWeight: 700, color: colors.lime.DEFAULT, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>📖 Journal</span></div>}
      {isSystem && <div style={{ marginBottom: "0.5rem" }}><span style={{ fontSize: "0.7rem", fontWeight: 700, color: colors.amber.DEFAULT, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>⚠ In Danger</span></div>}

      {/* Author row — tappable → goes to profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <button onClick={navigateToProfile} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0 }}>
          <AuthorAvatar
            avatarUrl={post.authorAvatarUrl}
            name={post.authorName}
            tierColor={tierColor}
            size={40}
          />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <button onClick={navigateToProfile} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: colors.white.DEFAULT }}>{post.authorName}</span>
            </button>
            <span style={{ fontSize: "0.8rem", color: colors.white.ghost }}>@{post.authorUsername}</span>
            <span style={{ fontSize: "0.75rem", color: colors.white.ghost }}>· {formatTime(post.createdAt)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.125rem" }}>
            <span style={{ fontSize: "0.7rem", color: tierColor, fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase" }}>{post.authorTier}</span>
            {post.proofVerified && <span style={{ fontSize: "0.7rem", color: colors.lime.DEFAULT, fontFamily: "var(--font-mono)" }}>✓ Verified</span>}
            <span style={{ fontSize: "0.72rem", color: colors.white.ghost }}>{CATEGORY_EMOJIS[post.category]} {CATEGORY_LABELS[post.category]}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p style={{ fontSize: "0.9rem", color: colors.white.DEFAULT, lineHeight: 1.6, margin: "0 0 0.875rem", whiteSpace: "pre-wrap" }}>
        {post.content}
      </p>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <ActionBtn
          label={`🔥 ${post.fuelCount}`}
          active={isFueled}
          activeColor={colors.amber.DEFAULT}
          onClick={handleFuel}
        />
        <ActionBtn
          label={`💬 ${post.replyCount}`}
          active={isExpanded}
          activeColor={colors.lime.DEFAULT}
          onClick={onToggleExpand}
        />
        <ActionBtn
          label={`🎯 Align · ${post.alignCount}`}
          active={false}
          activeColor={colors.lime.DEFAULT}
          onClick={() => {}}
        />
      </div>

      {/* Reply thread — inline when expanded */}
      {isExpanded && (
        <ReplyThread postId={post.id} currentUid={currentUid} nudgeUser={nudgeUser} />
      )}
    </div>
  );
}

// ─── Reply Thread ─────────────────────────────────────────────────────────────
function ReplyThread({ postId, currentUid, nudgeUser }: {
  postId: string; currentUid: string; nudgeUser: NudgeUser | null;
}) {
  const { replies, loading } = useReplies(postId);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleReply = async () => {
    if (!text.trim() || !nudgeUser || sending) return;
    setSending(true);
    try {
      await replyToPost(postId, nudgeUser, text);
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: `1px solid ${colors.obsidian.border}` }}>
      {loading ? <Spinner /> : replies.map((reply) => (
        <div key={reply.id} style={{ display: "flex", gap: "0.625rem", marginBottom: "0.75rem" }}>
          <AuthorAvatar avatarUrl={reply.authorAvatarUrl} name={reply.authorName} tierColor={colors.lime.DEFAULT} size={28} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.2rem", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: colors.white.DEFAULT }}>{reply.authorName}</span>
              <span style={{ fontSize: "0.72rem", color: colors.white.ghost }}>@{reply.authorUsername} · {formatTime(reply.createdAt)}</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: colors.white.muted, margin: 0, lineHeight: 1.5 }}>{reply.content}</p>
          </div>
        </div>
      ))}

      {/* Reply input */}
      {currentUid && (
        <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.5rem" }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
            placeholder="Write a reply..."
            style={{ flex: 1, padding: "0.6rem 0.875rem", background: colors.obsidian.elevated, border: `1px solid ${colors.obsidian.border}`, borderRadius: "20px", color: colors.white.DEFAULT, fontSize: "0.85rem", outline: "none", fontFamily: "inherit" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
          />
          <button
            onClick={handleReply}
            disabled={!text.trim() || sending}
            style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: text.trim() ? colors.lime.DEFAULT : colors.obsidian.elevated, color: text.trim() ? colors.obsidian.DEFAULT : colors.white.ghost, cursor: text.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8L14 2L8 14L7 9L2 8Z" fill="currentColor" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Compose Modal ────────────────────────────────────────────────────────────
function ComposeModal({ user, onClose }: { user: NudgeUser; onClose: () => void }) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<GoalCategory>("tech_execution");
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || posting) return;
    setPosting(true);
    try {
      await createPost(user, content, category, "progress_log");
      onClose();
    } finally {
      setPosting(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201, background: colors.obsidian.surface, borderTop: `1.5px solid ${colors.obsidian.border}`, borderRadius: "20px 20px 0 0", padding: "1.25rem", paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: colors.white.DEFAULT, margin: 0 }}>Share to Pulse</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: colors.white.ghost, cursor: "pointer", fontSize: "1.125rem" }}>✕</button>
        </div>

        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your progress, a win, or what you're working through..."
          rows={4}
          style={{ width: "100%", padding: "0.875rem", background: colors.obsidian.elevated, border: `1px solid ${colors.obsidian.border}`, borderRadius: "12px", color: colors.white.DEFAULT, fontSize: "0.95rem", outline: "none", fontFamily: "inherit", resize: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: "0.875rem" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`)}
          onBlur={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
        />

        {/* Category pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {CATEGORIES.slice(0, 6).map((cat) => {
            const isSelected = category === cat.key;
            return (
              <button key={cat.key} onClick={() => setCategory(cat.key)}
                style={{ padding: "0.3rem 0.75rem", borderRadius: "100px", border: `1.5px solid ${isSelected ? colors.lime.DEFAULT : colors.obsidian.border}`, background: isSelected ? `${colors.lime.DEFAULT}18` : "transparent", color: isSelected ? colors.lime.DEFAULT : colors.white.muted, fontSize: "0.75rem", fontWeight: isSelected ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}
              >
                {cat.emoji} {cat.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handlePost}
          disabled={!content.trim() || posting}
          style={{ width: "100%", padding: "0.875rem", borderRadius: "10px", border: "none", background: content.trim() ? colors.lime.DEFAULT : colors.obsidian.border, color: content.trim() ? colors.obsidian.DEFAULT : colors.white.ghost, fontSize: "0.9rem", fontWeight: 700, cursor: content.trim() ? "pointer" : "default", fontFamily: "inherit", opacity: posting ? 0.7 : 1 }}
        >
          {posting ? "Posting..." : "Post to Pulse →"}
        </button>
      </div>
    </>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function AuthorAvatar({ avatarUrl, name, tierColor, size }: { avatarUrl?: string; name: string; tierColor: string; size: number }) {
  const initials = name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
  if (avatarUrl) return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `1.5px solid ${tierColor}40` }}>
      <Image src={avatarUrl} alt={name} width={size} height={size} style={{ objectFit: "cover" }} />
    </div>
  );
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: `${tierColor}18`, border: `1.5px solid ${tierColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 700, color: tierColor, fontFamily: "var(--font-mono)" }}>
      {initials}
    </div>
  );
}

function ActionBtn({ label, active, activeColor, onClick }: { label: string; active: boolean; activeColor: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", color: active ? activeColor : colors.white.ghost, fontSize: "0.8rem", cursor: "pointer", padding: "0.25rem 0", fontFamily: "inherit", transition: `color ${motionTokens.fast}`, fontWeight: active ? 700 : 400 }}
      onMouseEnter={(e) => (e.currentTarget.style.color = activeColor)}
      onMouseLeave={(e) => (e.currentTarget.style.color = active ? activeColor : colors.white.ghost)}
    >{label}</button>
  );
}

function Spinner() {
  return <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${colors.obsidian.border}`, borderTopColor: colors.lime.DEFAULT, animation: "spin 0.7s linear infinite" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

function formatTime(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return new Date(ms).toLocaleDateString([], { month: "short", day: "numeric" });
}