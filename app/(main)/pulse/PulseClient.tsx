// app/(app)/pulse/PulseClient.tsx

"use client";

import React, { useState } from "react";
import { colors, motion as motionTokens } from "@/lib/theme";

type FeedTab = "global" | "alliance" | "in_danger";
type PostType = "progress_log" | "relapse_slip" | "journal" | "system_alert";

interface MockPost {
  id: string;
  handle: string;
  displayName: string;
  initials: string;
  time: string;
  type: PostType;
  content: string;
  category: string;
  categoryEmoji: string;
  tier: "soft" | "firm" | "hardcore";
  proofVerified: boolean;
  proofType?: string;
  fuelCount: number;
  alignCount: number;
  replyCount: number;
  fueled?: boolean;
}

const MOCK_POSTS: MockPost[] = [
  {
    id: "p1",
    handle: "@amaka_runs",
    displayName: "Amaka Osei",
    initials: "AO",
    time: "14m ago",
    type: "progress_log",
    content: "Day 21. 5km before sunrise, 6:02am timestamp on Strava. 3 weeks straight — the bow doesn't miss twice.",
    category: "Health & Fitness",
    categoryEmoji: "🔥",
    tier: "hardcore",
    proofVerified: true,
    proofType: "live_video",
    fuelCount: 112,
    alignCount: 14,
    replyCount: 8,
  },
  {
    id: "p2",
    handle: "@tunde_builds",
    displayName: "Tunde Adeyemi",
    initials: "TA",
    time: "1h ago",
    type: "progress_log",
    content: "Backend API live. Auth, Firestore rules, and the first dashboard route all passing. Commit proof below — day 9 of 30.",
    category: "Tech / Dev",
    categoryEmoji: "⚡",
    tier: "hardcore",
    proofVerified: true,
    proofType: "github_commit",
    fuelCount: 67,
    alignCount: 22,
    replyCount: 5,
  },
  {
    id: "p3",
    handle: "@david_clear",
    displayName: "David Clear",
    initials: "DC",
    time: "3h ago",
    type: "relapse_slip",
    content: "I hit the slip-up button tonight. The event ran long and I made the wrong call. Sponsor has been notified. Starting again tomorrow — streak reset to 0, money still in escrow. I'm not gone.",
    category: "Addiction Recovery",
    categoryEmoji: "🛡️",
    tier: "hardcore",
    proofVerified: false,
    fuelCount: 289,
    alignCount: 0,
    replyCount: 41,
  },
  {
    id: "p4",
    handle: "@zara_ships",
    displayName: "Zara Mensah",
    initials: "ZM",
    time: "5h ago",
    type: "journal",
    content: "Week 4 reflection: the hardest part of running a business isn't building, it's not letting self-doubt hijack the build session. Accountability partner caught me spiralling today and redirected me in 10 minutes. That's the product working.",
    category: "Business",
    categoryEmoji: "📈",
    tier: "firm",
    proofVerified: false,
    fuelCount: 54,
    alignCount: 9,
    replyCount: 17,
  },
  {
    id: "p5",
    handle: "@nudge_system",
    displayName: "Nudge",
    initials: "N",
    time: "6h ago",
    type: "system_alert",
    content: "@emeka_focus has been in danger for 18 hours on their 30-day learning streak. Drop an encouragement or a wake-up call below.",
    category: "Learning / Skill",
    categoryEmoji: "🎯",
    tier: "hardcore",
    proofVerified: false,
    fuelCount: 11,
    alignCount: 0,
    replyCount: 23,
  },
];

const TABS: { key: FeedTab; label: string }[] = [
  { key: "global",    label: "Global Pulse" },
  { key: "alliance",  label: "My Alliance"  },
  { key: "in_danger", label: "In Danger"    },
];

export default function PulseClient() {
  const [activeTab, setActiveTab] = useState<FeedTab>("global");
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleFuel = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, fueled: !p.fueled, fuelCount: p.fueled ? p.fuelCount - 1 : p.fuelCount + 1 }
          : p
      )
    );
  };

  const visiblePosts =
    activeTab === "in_danger"
      ? posts.filter((p) => p.type === "system_alert" || p.type === "relapse_slip")
      : posts;

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: colors.white.DEFAULT,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Pulse
        </h1>
        <p style={{ fontSize: "0.85rem", color: colors.white.muted, marginTop: "0.25rem" }}>
          Real people. Real proof. Real stakes.
        </p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${colors.obsidian.border}`,
          marginBottom: "1.25rem",
          gap: "0",
        }}
      >
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
                borderBottom: isActive
                  ? `2px solid ${tab.key === "in_danger" ? colors.amber.DEFAULT : colors.lime.DEFAULT}`
                  : "2px solid transparent",
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

      {/* Posts */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} onFuel={handleFuel} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, onFuel }: { post: MockPost; onFuel: (id: string) => void }) {
  const tierColor = post.tier === "hardcore" ? colors.amber.DEFAULT : post.tier === "firm" ? colors.lime.DEFAULT : colors.white.muted;
  const isSystemAlert = post.type === "system_alert";
  const isSlip = post.type === "relapse_slip";

  return (
    <div
      style={{
        padding: "1.125rem 0",
        borderBottom: `1px solid ${colors.obsidian.border}`,
        background: isSystemAlert ? `${colors.amber.DEFAULT}06` : "transparent",
      }}
    >
      {/* System alert label */}
      {isSystemAlert && (
        <div style={{ marginBottom: "0.625rem" }}>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: colors.amber.DEFAULT,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
            }}
          >
            ⚠ In Danger
          </span>
        </div>
      )}
      {isSlip && (
        <div style={{ marginBottom: "0.625rem" }}>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: colors.status.safe,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
            }}
          >
            🛡 Honest Slip
          </span>
        </div>
      )}

      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "50%",
            background: `${tierColor}18`,
            border: `1.5px solid ${tierColor}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            fontWeight: 700,
            color: tierColor,
            fontFamily: "var(--font-mono)",
            flexShrink: 0,
          }}
        >
          {post.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: colors.white.DEFAULT }}>
              {post.displayName}
            </span>
            <span style={{ fontSize: "0.8rem", color: colors.white.ghost }}>{post.handle}</span>
            <span style={{ fontSize: "0.75rem", color: colors.white.ghost }}>· {post.time}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.125rem" }}>
            <span style={{ fontSize: "0.7rem", color: tierColor, fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase" }}>
              {post.tier}
            </span>
            {post.proofVerified && (
              <span style={{ fontSize: "0.7rem", color: colors.lime.DEFAULT, fontFamily: "var(--font-mono)" }}>
                ✓ Verified
              </span>
            )}
          </div>
        </div>
        <span
          style={{
            fontSize: "0.7rem",
            color: colors.white.ghost,
            flexShrink: 0,
          }}
        >
          {post.categoryEmoji} {post.category}
        </span>
      </div>

      {/* Content */}
      <p
        style={{
          fontSize: "0.9rem",
          color: colors.white.DEFAULT,
          lineHeight: 1.6,
          margin: "0 0 0.875rem",
        }}
      >
        {post.content}
      </p>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <ActionButton
          onClick={() => onFuel(post.id)}
          active={!!post.fueled}
          activeColor={colors.amber.DEFAULT}
          label={`🔥 ${post.fuelCount}`}
        />
        <ActionButton
          onClick={() => {}}
          active={false}
          activeColor={colors.lime.DEFAULT}
          label={`🎯 Align · ${post.alignCount}`}
        />
        <ActionButton
          onClick={() => {}}
          active={false}
          activeColor={colors.white.muted}
          label={`💬 ${post.replyCount}`}
        />
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  active,
  activeColor,
  label,
}: {
  onClick: () => void;
  active: boolean;
  activeColor: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: active ? activeColor : colors.white.ghost,
        fontSize: "0.8rem",
        cursor: "pointer",
        padding: "0.25rem 0",
        fontFamily: "inherit",
        transition: `color ${motionTokens.fast}`,
        fontWeight: active ? 700 : 400,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = activeColor)}
      onMouseLeave={(e) => (e.currentTarget.style.color = active ? activeColor : colors.white.ghost)}
    >
      {label}
    </button>
  );
}