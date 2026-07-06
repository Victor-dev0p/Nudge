"use client";

import React from "react";
import { colors, uiState } from "@/lib/theme";
import type { GoalStatus } from "@/types/user";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  status: GoalStatus;
}

export function StreakDisplay({ currentStreak, longestStreak, status }: StreakDisplayProps) {
  const isWarning = !["active", "completed"].includes(status);
  const accent = isWarning ? colors.amber.DEFAULT : colors.lime.DEFAULT;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1.25rem",
        background: colors.obsidian.surface,
        border: `1px solid ${colors.obsidian.border}`,
        borderRadius: "14px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.5rem",
            fontWeight: 900,
            color: accent,
            lineHeight: 1,
            margin: 0,
            transition: "color 350ms",
          }}
        >
          {currentStreak}
        </p>
        <p
          style={{
            fontSize: "0.7rem",
            color: colors.white.muted,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: "0.375rem",
          }}
        >
          Current Streak
        </p>
      </div>

      <div style={{ width: "1px", height: "2.5rem", background: colors.obsidian.border }} />

      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.5rem",
            fontWeight: 900,
            color: colors.white.muted,
            lineHeight: 1,
            margin: 0,
          }}
        >
          {longestStreak}
        </p>
        <p
          style={{
            fontSize: "0.7rem",
            color: colors.white.muted,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: "0.375rem",
          }}
        >
          Longest Streak
        </p>
      </div>
    </div>
  );
}