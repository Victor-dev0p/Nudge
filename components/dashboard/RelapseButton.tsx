"use client";

import React from "react";
import { colors } from "@/lib/theme";

interface RelapseButtonProps {
  onClick: () => void;
  isRecovery: boolean;
}

export function RelapseButton({ onClick, isRecovery }: RelapseButtonProps) {
  if (isRecovery) {
    return (
      <div
        style={{
          padding: "0.875rem 1.25rem",
          borderRadius: "12px",
          background: `${colors.status.safe}12`,
          border: `1px solid ${colors.status.safe}40`,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "0.85rem", color: colors.status.safe, fontWeight: 600, margin: 0 }}>
          You&apos;re in recovery mode. Pressure is paused.
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "0.875rem 1.25rem",
        borderRadius: "12px",
        border: `1.5px solid ${colors.obsidian.border}`,
        background: "transparent",
        color: colors.white.muted,
        fontSize: "0.85rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 200ms",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.status.safe;
        e.currentTarget.style.color = colors.status.safe;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.obsidian.border;
        e.currentTarget.style.color = colors.white.muted;
      }}
    >
      I Slipped Up — Pause the Pressure
    </button>
  );
}