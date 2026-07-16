// components/profile/GoalsTab.tsx

"use client";

import React from "react";
import { colors, tierColors } from "@/lib/theme";
import type { NudgeGoal } from "@/types/user";

const CATEGORY_LABELS: Record<string, string> = {
  tech_execution: "Tech / Dev", business_strategy: "Business",
  health_fitness: "Health & Fitness", mental_health_trauma: "Mental Health",
  addiction_recovery: "Recovery", learning_skill: "Learning",
  creative: "Creative", financial: "Financial",
  relationship: "Relationships", other: "Other",
};

export function GoalsTab({ goals }: { goals: NudgeGoal[] }) {
  if (goals.length === 0) {
    return <p style={{ textAlign: "center", color: colors.white.ghost, fontSize: "0.875rem", padding: "2rem 0" }}>No active goals yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {goals.map((goal) => {
        const tc = tierColors[goal.tier];
        const isActive = goal.status === "active";
        return (
          <div key={goal.id} style={{ padding: "1.125rem", background: colors.obsidian.surface, border: `1px solid ${colors.obsidian.border}`, borderRadius: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div>
                <p style={{ fontSize: "0.7rem", color: colors.white.ghost, margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
                  {CATEGORY_LABELS[goal.category] ?? goal.category}
                </p>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: colors.white.DEFAULT, margin: 0, lineHeight: 1.4 }}>{goal.text}</p>
              </div>
              <span style={{ flexShrink: 0, fontSize: "0.65rem", fontWeight: 700, padding: "0.25rem 0.625rem", borderRadius: "100px", background: `${tc.accent}12`, color: tc.accent, border: `1px solid ${tc.accent}30`, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                {tc.label}
              </span>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: isActive ? colors.lime.DEFAULT : colors.white.ghost, fontWeight: 700 }}>
                {goal.currentStreak}d streak
              </span>
              <div style={{ flex: 1, height: "4px", borderRadius: "100px", background: colors.obsidian.elevated, overflow: "hidden" }}>
                <div style={{ width: `${goal.completionRate}%`, height: "100%", background: isActive ? colors.lime.DEFAULT : colors.white.ghost, borderRadius: "100px", transition: "width 600ms" }} />
              </div>
              <span style={{ fontSize: "0.8rem", color: colors.white.muted }}>{goal.completionRate}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}