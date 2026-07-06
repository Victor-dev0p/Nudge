"use client";

import React from "react";
import { colors, tierColors } from "@/lib/theme";
import type { NudgeGoal } from "@/types/user";

interface GoalCardProps {
  goal: NudgeGoal;
}

const CATEGORY_LABELS: Record<string, string> = {
  tech_execution: "Tech / Dev",
  business_strategy: "Business",
  health_fitness: "Health & Fitness",
  mental_health_trauma: "Mental Health",
  addiction_recovery: "Addiction Recovery",
  learning_skill: "Learning / Skill",
  creative: "Creative",
  financial: "Financial",
  relationship: "Relationships",
  other: "Other",
};

export function GoalCard({ goal }: GoalCardProps) {
  const tc = tierColors[goal.tier];
  const isWarning = !["active", "completed"].includes(goal.status);
  const accent = isWarning ? colors.amber.DEFAULT : colors.lime.DEFAULT;

  return (
    <div
      style={{
        padding: "1.75rem",
        background: colors.obsidian.surface,
        border: `1.5px solid ${colors.obsidian.border}`,
        borderRadius: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem" }}>
        <div>
          <span
            style={{
              fontSize: "0.7rem",
              color: colors.white.ghost,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
            }}
          >
            {CATEGORY_LABELS[goal.category] ?? goal.category}
          </span>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 800,
              color: colors.white.DEFAULT,
              letterSpacing: "-0.02em",
              marginTop: "0.25rem",
              lineHeight: 1.2,
            }}
          >
            {goal.text}
          </h2>
        </div>

        <span
          style={{
            flexShrink: 0,
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "0.3rem 0.7rem",
            borderRadius: "100px",
            background: `${tc.accent}15`,
            color: tc.accent,
            border: `1px solid ${tc.accent}30`,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontFamily: "var(--font-mono)",
          }}
        >
          {tc.label}
        </span>
      </div>

      {/* Completion rate bar */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.75rem", color: colors.white.muted }}>Completion rate</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: accent }}>{goal.completionRate}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "100px",
            background: colors.obsidian.elevated,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${goal.completionRate}%`,
              height: "100%",
              background: accent,
              borderRadius: "100px",
              transition: "width 600ms cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: `0 0 10px ${accent}80`,
            }}
          />
        </div>
      </div>

      {/* Stake + partner row */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {goal.stakeAmount && (
          <div
            style={{
              flex: "1 1 140px",
              padding: "0.75rem 1rem",
              background: colors.obsidian.elevated,
              borderRadius: "10px",
            }}
          >
            <p style={{ fontSize: "0.7rem", color: colors.white.ghost, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Staked
            </p>
            <p style={{ fontSize: "1.0625rem", fontWeight: 800, color: colors.white.DEFAULT, margin: "0.2rem 0 0" }}>
              ₦{(goal.stakeAmount / 100).toLocaleString()}
            </p>
          </div>
        )}

        {goal.partnerEmail && (
          <div
            style={{
              flex: "1 1 140px",
              padding: "0.75rem 1rem",
              background: colors.obsidian.elevated,
              borderRadius: "10px",
            }}
          >
            <p style={{ fontSize: "0.7rem", color: colors.white.ghost, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Watching
            </p>
            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: colors.white.DEFAULT, margin: "0.2rem 0 0" }}>
              {goal.partnerEmail}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}