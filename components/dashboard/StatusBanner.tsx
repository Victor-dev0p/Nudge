"use client";

import React from "react";
import { uiState, motion as motionTokens } from "@/lib/theme";
import type { GoalStatus } from "@/types/user";

interface StatusBannerProps {
  status: GoalStatus;
  deadlineLabel: string;
}

function resolveUIState(status: GoalStatus) {
  if (status === "active" || status === "completed") return uiState.alignment;
  if (status === "recovery") return uiState.recovery;
  if (status === "forfeited") return uiState.forfeit;
  return uiState.warning; // slacking_l1, slacking_l2, slacking_l3, at_risk
}

function resolveMessage(status: GoalStatus): { headline: string; sub: string } {
  switch (status) {
    case "active":
      return {
        headline: "Aligned. Aim is steady.",
        sub: "Keep submitting proof on time to hold your streak.",
      };
    case "slacking_l1":
      return {
        headline: "The wind is picking up.",
        sub: "You've missed a deadline. Submit proof now to steady your aim.",
      };
    case "slacking_l2":
      return {
        headline: "Your sponsor has been alerted.",
        sub: "This is now visible to your accountability partner. Act before it escalates further.",
      };
    case "slacking_l3":
      return {
        headline: "Final window. Stake at risk.",
        sub: "Submit proof immediately or your stake will be forfeited to the pool.",
      };
    case "recovery":
      return {
        headline: "You're in recovery mode.",
        sub: "Pressure is paused. Take the time you need — we're still here.",
      };
    case "forfeited":
      return {
        headline: "Stake forfeited. Streak reset.",
        sub: "Your contribution has moved to the pool. The next target starts now.",
      };
    default:
      return { headline: "Status unknown.", sub: "" };
  }
}

export function StatusBanner({ status, deadlineLabel }: StatusBannerProps) {
  const state = resolveUIState(status);
  const { headline, sub } = resolveMessage(status);
  const isWarning = state === uiState.warning;

  return (
    <div
      style={{
        padding: "1.25rem 1.5rem",
        borderRadius: "14px",
        background: state.bg,
        border: `1.5px solid ${state.accent}35`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
        transition: `all ${motionTokens.slow} ${motionTokens.easing.ease}`,
        boxShadow: isWarning ? `0 0 30px ${state.glow}` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: state.accent,
            flexShrink: 0,
            animation: isWarning ? "statusPulse 1.4s ease-in-out infinite" : "none",
            boxShadow: `0 0 12px ${state.accent}`,
          }}
        />
        <div>
          <p
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: state.accent,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {headline}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--color-white-muted)", margin: "0.2rem 0 0" }}>
            {sub}
          </p>
        </div>
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: state.accent,
          padding: "0.4rem 0.75rem",
          borderRadius: "8px",
          background: `${state.accent}12`,
          whiteSpace: "nowrap",
        }}
      >
        {deadlineLabel}
      </div>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}