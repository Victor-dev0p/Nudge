// app/(app)/discover/DiscoverClient.tsx

"use client";

import React, { useState } from "react";
import { colors, motion as motionTokens } from "@/lib/theme";

type DiscoverTab = "practitioners" | "peers";
type Category = "all" | "tech_execution" | "business_strategy" | "health_fitness" | "addiction_recovery" | "mental_health_trauma";

interface MockPractitioner {
  id: string;
  name: string;
  handle: string;
  initials: string;
  specialization: string;
  category: Exclude<Category, "all">;
  categoryEmoji: string;
  bio: string;
  rating: number;
  reviewCount: number;
  successRate: number;
  activeSponsees: number;
  billingModel: string;
  monthlyRate: string;
  verified: boolean;
}

interface MockPeer {
  id: string;
  name: string;
  handle: string;
  initials: string;
  category: Exclude<Category, "all">;
  categoryEmoji: string;
  bio: string;
  currentStreak: number;
  completionRate: number;
  tier: "soft" | "firm" | "hardcore";
  sponsoring: number;
}

const MOCK_PRACTITIONERS: MockPractitioner[] = [
  {
    id: "pr1",
    name: "Dr. Sola Akin",
    handle: "@dr_sola",
    initials: "SA",
    specialization: "Addiction & Behavioral Recovery",
    category: "addiction_recovery",
    categoryEmoji: "🛡️",
    bio: "Clinical psychologist with 12 years in addiction recovery. Certified CBT practitioner. Sponsor to 6 active Nudge users.",
    rating: 4.9,
    reviewCount: 34,
    successRate: 91,
    activeSponsees: 6,
    billingModel: "Flat Monthly",
    monthlyRate: "₦25,000/mo",
    verified: true,
  },
  {
    id: "pr2",
    name: "Emeka Okafor",
    handle: "@emeka_executes",
    initials: "EO",
    specialization: "Startup Execution & Business Strategy",
    category: "business_strategy",
    categoryEmoji: "📈",
    bio: "2x founder, operator. I help builders ship without burning out. Focus on structured accountability for execution milestones.",
    rating: 4.7,
    reviewCount: 21,
    successRate: 88,
    activeSponsees: 4,
    billingModel: "Per Event",
    monthlyRate: "₦15,000/sprint",
    verified: true,
  },
  {
    id: "pr3",
    name: "Coach Fatima",
    handle: "@fatima_strong",
    initials: "FC",
    specialization: "High-Performance & Fitness",
    category: "health_fitness",
    categoryEmoji: "🔥",
    bio: "NSCA-certified strength coach. I review your daily proof videos and call you out when form or intensity drops. No shortcuts.",
    rating: 4.8,
    reviewCount: 47,
    successRate: 94,
    activeSponsees: 9,
    billingModel: "Hybrid Stakes",
    monthlyRate: "₦10,000 + pool %",
    verified: true,
  },
];

const MOCK_PEERS: MockPeer[] = [
  {
    id: "pe1",
    name: "Tunde Adeyemi",
    handle: "@tunde_builds",
    initials: "TA",
    category: "tech_execution",
    categoryEmoji: "⚡",
    bio: "Full-stack dev. Building in public. Looking to sponsor 1 developer who is serious about shipping.",
    currentStreak: 9,
    completionRate: 87,
    tier: "hardcore",
    sponsoring: 1,
  },
  {
    id: "pe2",
    name: "Amaka Osei",
    handle: "@amaka_runs",
    initials: "AO",
    category: "health_fitness",
    categoryEmoji: "🔥",
    bio: "Marathon runner. 3 years sober. I know what discipline feels like and I can help you find yours.",
    currentStreak: 21,
    completionRate: 96,
    tier: "hardcore",
    sponsoring: 2,
  },
  {
    id: "pe3",
    name: "Zara Mensah",
    handle: "@zara_ships",
    initials: "ZM",
    category: "business_strategy",
    categoryEmoji: "📈",
    bio: "Product manager turned founder. Open to sponsoring one person tackling a business execution goal.",
    currentStreak: 14,
    completionRate: 79,
    tier: "firm",
    sponsoring: 1,
  },
];

const CATEGORY_FILTERS: { key: Category; label: string; emoji: string }[] = [
  { key: "all",                  label: "All",               emoji: "◎"  },
  { key: "tech_execution",       label: "Tech / Dev",        emoji: "⚡" },
  { key: "business_strategy",    label: "Business",          emoji: "📈" },
  { key: "health_fitness",       label: "Health & Fitness",  emoji: "🔥" },
  { key: "addiction_recovery",   label: "Recovery",          emoji: "🛡️" },
  { key: "mental_health_trauma", label: "Mental Health",     emoji: "🧠" },
];

const TABS: { key: DiscoverTab; label: string }[] = [
  { key: "practitioners", label: "Certified Practitioners" },
  { key: "peers",         label: "Community Peers"         },
];

export default function DiscoverClient() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>("practitioners");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const filteredPractitioners = MOCK_PRACTITIONERS.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialization.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredPeers = MOCK_PEERS.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "1.5rem 1rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: colors.white.DEFAULT, letterSpacing: "-0.03em", margin: "0 0 0.25rem" }}>
          Discover
        </h1>
        <p style={{ fontSize: "0.85rem", color: colors.white.muted }}>
          Find the right person to watch your aim.
        </p>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or specialization..."
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          background: colors.obsidian.surface,
          border: `1px solid ${colors.obsidian.border}`,
          borderRadius: "10px",
          color: colors.white.DEFAULT,
          fontSize: "0.875rem",
          outline: "none",
          fontFamily: "inherit",
          marginBottom: "1rem",
          boxSizing: "border-box",
          transition: `border-color ${motionTokens.fast}`,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`)}
        onBlur={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
      />

      {/* Category filters */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: "100px",
                border: `1.5px solid ${isActive ? colors.lime.DEFAULT : colors.obsidian.border}`,
                background: isActive ? `${colors.lime.DEFAULT}15` : "transparent",
                color: isActive ? colors.lime.DEFAULT : colors.white.muted,
                fontSize: "0.78rem",
                fontWeight: isActive ? 700 : 400,
                cursor: "pointer",
                transition: `all ${motionTokens.fast}`,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tabs */}
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

      {/* Practitioner cards */}
      {activeTab === "practitioners" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredPractitioners.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "1.375rem",
                background: colors.obsidian.surface,
                border: `1px solid ${colors.obsidian.border}`,
                borderRadius: "14px",
              }}
            >
              {/* Top row */}
              <div style={{ display: "flex", gap: "0.875rem", marginBottom: "0.875rem" }}>
                <div
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "50%",
                    background: `${colors.amber.DEFAULT}18`,
                    border: `1.5px solid ${colors.amber.DEFAULT}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: colors.amber.DEFAULT,
                    fontFamily: "var(--font-mono)",
                    flexShrink: 0,
                  }}
                >
                  {p.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: colors.white.DEFAULT }}>{p.name}</span>
                    {p.verified && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: colors.amber.DEFAULT,
                          background: `${colors.amber.DEFAULT}12`,
                          border: `1px solid ${colors.amber.DEFAULT}30`,
                          borderRadius: "100px",
                          padding: "0.15rem 0.5rem",
                          fontFamily: "var(--font-mono)",
                          textTransform: "uppercase",
                        }}
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: colors.white.muted, margin: "0.125rem 0 0" }}>
                    {p.categoryEmoji} {p.specialization}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "0.95rem", fontWeight: 800, color: colors.amber.DEFAULT, margin: 0 }}>
                    {p.monthlyRate}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: colors.white.ghost, margin: "0.125rem 0 0" }}>
                    {p.billingModel}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p style={{ fontSize: "0.85rem", color: colors.white.muted, margin: "0 0 0.875rem", lineHeight: 1.6 }}>
                {p.bio}
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                {[
                  { label: "Rating",       value: `${p.rating}★`        },
                  { label: "Success rate", value: `${p.successRate}%`    },
                  { label: "Sponsees",     value: `${p.activeSponsees}`  },
                  { label: "Reviews",      value: `${p.reviewCount}`     },
                ].map((s) => (
                  <div key={s.label}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: colors.white.DEFAULT }}>{s.value}</span>
                    <span style={{ fontSize: "0.7rem", color: colors.white.ghost, marginLeft: "0.3rem" }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: `1.5px solid ${colors.amber.DEFAULT}`,
                  background: "transparent",
                  color: colors.amber.DEFAULT,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: `all ${motionTokens.fast}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${colors.amber.DEFAULT}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Request Sponsorship
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Peer cards */}
      {activeTab === "peers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {filteredPeers.map((p) => {
            const tierColor = p.tier === "hardcore" ? colors.amber.DEFAULT : p.tier === "firm" ? colors.lime.DEFAULT : colors.white.muted;
            return (
              <div
                key={p.id}
                style={{
                  padding: "1.125rem 1.25rem",
                  background: colors.obsidian.surface,
                  border: `1px solid ${colors.obsidian.border}`,
                  borderRadius: "12px",
                  display: "flex",
                  gap: "0.875rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
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
                  {p.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <div>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: colors.white.DEFAULT }}>{p.name}</span>
                      <span style={{ fontSize: "0.8rem", color: colors.white.ghost, marginLeft: "0.5rem" }}>{p.handle}</span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: tierColor,
                        background: `${tierColor}12`,
                        border: `1px solid ${tierColor}30`,
                        borderRadius: "100px",
                        padding: "0.15rem 0.5rem",
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        flexShrink: 0,
                      }}
                    >
                      {p.tier}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: colors.white.ghost, margin: "0 0 0.5rem" }}>
                    {p.categoryEmoji} {p.category.replace("_", " ")}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: colors.white.muted, margin: "0 0 0.75rem", lineHeight: 1.5 }}>
                    {p.bio}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <span style={{ fontSize: "0.78rem", color: colors.lime.DEFAULT, fontWeight: 700 }}>
                        {p.currentStreak}d streak
                      </span>
                      <span style={{ fontSize: "0.78rem", color: colors.white.muted }}>
                        {p.completionRate}% completion
                      </span>
                    </div>
                    <button
                      style={{
                        padding: "0.4rem 0.875rem",
                        borderRadius: "8px",
                        border: `1.5px solid ${colors.lime.DEFAULT}`,
                        background: "transparent",
                        color: colors.lime.DEFAULT,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: `all ${motionTokens.fast}`,
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = `${colors.lime.DEFAULT}15`)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Invite to Partner
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}