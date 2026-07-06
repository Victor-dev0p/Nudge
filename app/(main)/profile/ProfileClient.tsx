// app/(app)/profile/ProfileClient.tsx

"use client";

import React, { useState } from "react";
import { colors, motion as motionTokens, tierColors } from "@/lib/theme";

type ProfileTab = "goals" | "journal" | "stats";

const MOCK_JOURNAL = [
  {
    id: "j1",
    date: "Today",
    title: "Day 22 — The dashboard finally rendered.",
    content:
      "Spent 6 hours on routing. Deleted old middleware at 11pm. It finally clicked into place. The build is alive. The streak holds.",
    category: "Tech / Dev",
    emoji: "⚡",
  },
  {
    id: "j2",
    date: "Yesterday",
    title: "Day 21 — On why accountability beats willpower.",
    content:
      "Willpower is a resource. It depletes. Accountability is a system. It compounds. The difference is whether you're fighting alone or fighting watched.",
    category: "Mental Health",
    emoji: "🧠",
  },
  {
    id: "j3",
    date: "3 days ago",
    title: "Day 19 — Almost slipped. Didn't.",
    content:
      "Had every reason to skip today. Tunde sent one message at 10pm: 'Still building?' That was enough. Submitted proof at 11:47pm.",
    category: "Tech / Dev",
    emoji: "⚡",
  },
];

const MOCK_GOALS = [
  {
    id: "g1",
    text: "Ship the Nudge MVP web app end to end",
    category: "Tech / Dev",
    tier: "hardcore" as const,
    streak: 22,
    completion: 82,
    status: "active",
  },
  {
    id: "g2",
    text: "Run 5km every day for 30 days",
    category: "Health & Fitness",
    tier: "firm" as const,
    streak: 6,
    completion: 60,
    status: "active",
  },
];

const TABS: { key: ProfileTab; label: string }[] = [
  { key: "goals",   label: "Goals"   },
  { key: "journal", label: "Journal" },
  { key: "stats",   label: "Stats"   },
];

export default function ProfileClient() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("goals");

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "1.5rem 1rem" }}>

      {/* Profile header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1.25rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "5rem",
            height: "5rem",
            borderRadius: "50%",
            background: `${colors.lime.DEFAULT}18`,
            border: `2px solid ${colors.lime.DEFAULT}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.375rem",
            fontWeight: 900,
            color: colors.lime.DEFAULT,
            fontFamily: "var(--font-mono)",
            flexShrink: 0,
          }}
        >
          VO
        </div>

        {/* Identity */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontSize: "1.375rem",
              fontWeight: 900,
              color: colors.white.DEFAULT,
              letterSpacing: "-0.03em",
              margin: "0 0 0.125rem",
            }}
          >
            Victor Okafor
          </h1>
          <p style={{ fontSize: "0.85rem", color: colors.white.muted, margin: "0 0 0.625rem", fontFamily: "var(--font-mono)" }}>
            @victor_builds
          </p>
          <p style={{ fontSize: "0.875rem", color: colors.white.muted, margin: "0 0 0.875rem", lineHeight: 1.5 }}>
            Building in public. Hardcore tier. Day by day.
          </p>

          {/* Social row */}
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
            {[
              { label: "Following", value: "18" },
              { label: "Followers", value: "24" },
              { label: "Sponsors", value: "1"  },
            ].map((s) => (
              <div key={s.label}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: colors.white.DEFAULT }}>{s.value}</span>
                <span style={{ fontSize: "0.75rem", color: colors.white.muted, marginLeft: "0.3rem" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edit profile */}
        <button
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
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.lime.DEFAULT;
            e.currentTarget.style.color = colors.lime.DEFAULT;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.obsidian.border;
            e.currentTarget.style.color = colors.white.muted;
          }}
        >
          Edit Profile
        </button>
      </div>

      {/* Vitals strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { label: "Best Streak",     value: "22d",  accent: colors.lime.DEFAULT  },
          { label: "Completion Rate", value: "82%",  accent: colors.lime.DEFAULT  },
          { label: "Total Earned",    value: "₦20k", accent: colors.amber.DEFAULT },
        ].map((v) => (
          <div
            key={v.label}
            style={{
              padding: "0.875rem",
              background: colors.obsidian.surface,
              border: `1px solid ${colors.obsidian.border}`,
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.375rem",
                fontWeight: 900,
                color: v.accent,
                margin: "0 0 0.2rem",
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-display)",
              }}
            >
              {v.value}
            </p>
            <p style={{ fontSize: "0.7rem", color: colors.white.muted, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {v.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tier badge */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(["hardcore", "firm"] as const).map((tier) => {
          const tc = tierColors[tier];
          return (
            <span
              key={tier}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "100px",
                background: `${tc.accent}12`,
                border: `1px solid ${tc.accent}30`,
                fontSize: "0.7rem",
                fontWeight: 700,
                color: tc.accent,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontFamily: "var(--font-mono)",
              }}
            >
              {tc.label}
            </span>
          );
        })}
        <span
          style={{
            padding: "0.3rem 0.75rem",
            borderRadius: "100px",
            background: `${colors.lime.DEFAULT}12`,
            border: `1px solid ${colors.lime.DEFAULT}30`,
            fontSize: "0.7rem",
            fontWeight: 700,
            color: colors.lime.DEFAULT,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontFamily: "var(--font-mono)",
          }}
        >
          22-Day Streak
        </span>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${colors.obsidian.border}`,
          marginBottom: "1.25rem",
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
      {activeTab === "goals" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {MOCK_GOALS.map((goal) => {
            const tc = tierColors[goal.tier];
            return (
              <div
                key={goal.id}
                style={{
                  padding: "1.125rem",
                  background: colors.obsidian.surface,
                  border: `1px solid ${colors.obsidian.border}`,
                  borderRadius: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 600, color: colors.white.DEFAULT, margin: 0, lineHeight: 1.4 }}>
                    {goal.text}
                  </p>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.625rem",
                      borderRadius: "100px",
                      background: `${tc.accent}12`,
                      color: tc.accent,
                      border: `1px solid ${tc.accent}30`,
                      fontFamily: "var(--font-mono)",
                      textTransform: "uppercase",
                    }}
                  >
                    {tc.label}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: colors.lime.DEFAULT, fontWeight: 700 }}>
                    {goal.streak}d streak
                  </span>
                  <div style={{ flex: 1, height: "4px", borderRadius: "100px", background: colors.obsidian.elevated, overflow: "hidden" }}>
                    <div style={{ width: `${goal.completion}%`, height: "100%", background: colors.lime.DEFAULT, borderRadius: "100px" }} />
                  </div>
                  <span style={{ fontSize: "0.8rem", color: colors.white.muted }}>{goal.completion}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "journal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {MOCK_JOURNAL.map((entry, i) => (
            <div
              key={entry.id}
              style={{
                padding: "1.125rem 0",
                borderBottom: i < MOCK_JOURNAL.length - 1 ? `1px solid ${colors.obsidian.border}` : "none",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.375rem" }}>
                <span style={{ fontSize: "0.75rem", color: colors.white.ghost }}>{entry.date}</span>
                <span style={{ fontSize: "0.75rem", color: colors.white.ghost }}>·</span>
                <span style={{ fontSize: "0.75rem", color: colors.white.ghost }}>{entry.emoji} {entry.category}</span>
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: colors.white.DEFAULT, margin: "0 0 0.5rem", letterSpacing: "-0.01em" }}>
                {entry.title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: colors.white.muted, margin: 0, lineHeight: 1.6 }}>
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "stats" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { label: "Total tasks completed",  value: "186"    },
            { label: "Total proof submitted",  value: "142"    },
            { label: "Pool wins",              value: "3"      },
            { label: "Total forfeited",        value: "₦5,000" },
            { label: "Sponsors I have",        value: "1"      },
            { label: "People I sponsor",       value: "0"      },
            { label: "Days on Nudge",          value: "22"     },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "0.875rem 1.125rem",
                background: colors.obsidian.surface,
                border: `1px solid ${colors.obsidian.border}`,
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.875rem", color: colors.white.muted }}>{stat.label}</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: colors.white.DEFAULT, fontFamily: "var(--font-mono)" }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}