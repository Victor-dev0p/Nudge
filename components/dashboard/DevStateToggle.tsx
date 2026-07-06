"use client";

import React from "react";
import { colors } from "@/lib/theme";

interface DevStateToggleProps {
  currentView: "aligned" | "at_risk";
  onChange: (view: "aligned" | "at_risk") => void;
}

/**
 * TEMPORARY — for previewing both dashboard states during the static UI pass.
 * Remove once real Firestore status drives the dashboard automatically.
 */
export function DevStateToggle({ currentView, onChange }: DevStateToggleProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.25rem",
        right: "1.25rem",
        zIndex: 200,
        display: "flex",
        gap: "0.375rem",
        padding: "0.375rem",
        background: colors.obsidian.elevated,
        border: `1px solid ${colors.obsidian.border}`,
        borderRadius: "100px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
      }}
    >
      <span
        style={{
          fontSize: "0.65rem",
          color: colors.white.ghost,
          alignSelf: "center",
          padding: "0 0.5rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        DEV
      </span>
      {(["aligned", "at_risk"] as const).map((view) => {
        const isActive = currentView === view;
        const accent = view === "aligned" ? colors.lime.DEFAULT : colors.amber.DEFAULT;
        return (
          <button
            key={view}
            onClick={() => onChange(view)}
            style={{
              padding: "0.4rem 0.875rem",
              borderRadius: "100px",
              border: "none",
              background: isActive ? accent : "transparent",
              color: isActive ? colors.obsidian.DEFAULT : colors.white.muted,
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 200ms",
              fontFamily: "inherit",
            }}
          >
            {view === "aligned" ? "Aligned" : "At Risk"}
          </button>
        );
      })}
    </div>
  );
}