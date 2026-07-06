"use client";

import React from "react";
import { colors, tierColors, motion as motionTokens } from "@/lib/theme";
import type { SignupFlowState, AccountabilityTier } from "@/types/user";
import { TIERS } from "./signup.constants";
import { NudgeButton, BackButton, ErrorMessage } from "./signup.ui";

interface StepWeightProps {
  flow: SignupFlowState;
  setFlow: React.Dispatch<React.SetStateAction<SignupFlowState>>;
  error: string;
  setError: (e: string) => void;
  accentColor: string;
  onBack: () => void;
  onNext: () => void;
}

export function StepWeight({
  flow,
  setFlow,
  error,
  setError,
  accentColor,
  onBack,
  onNext,
}: StepWeightProps) {
  const selectTier = (key: AccountabilityTier) => {
    setFlow((prev) => ({ ...prev, tier: key }));
    setError("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Heading */}
      <div>
        <h2
          style={{
            fontSize: "clamp(1.25rem, 3.5vw, 2rem)",
            fontWeight: 900,
            color: colors.white.DEFAULT,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}
        >
          How hard do you{" "}
          <span style={{ color: accentColor }}>draw the bow?</span>
        </h2>
        <p style={{ color: colors.white.muted, fontSize: "0.9rem" }}>
          The heavier the draw, the higher the stakes.
        </p>
      </div>

      {/* Tier cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {TIERS.map((tier) => {
          const isSelected = flow.tier === tier.key;
          const tc = tierColors[tier.key];

          return (
            <button
              key={tier.key}
              onClick={() => selectTier(tier.key)}
              style={{
                padding: "1.125rem 1.25rem",
                borderRadius: "12px",
                border: `1.5px solid ${isSelected ? tc.accent : colors.obsidian.border}`,
                background: isSelected ? tc.glow : colors.obsidian.surface,
                textAlign: "left",
                cursor: "pointer",
                transition: `all ${motionTokens.normal} ${motionTokens.easing.ease}`,
                boxShadow: isSelected ? `0 0 20px ${tc.glow}` : "none",
                fontFamily: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.375rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: isSelected ? tc.accent : colors.white.DEFAULT,
                    transition: `color ${motionTokens.fast}`,
                  }}
                >
                  {tier.label}
                </span>
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    border: `1.5px solid ${isSelected ? tc.accent : colors.white.ghost}`,
                    background: isSelected ? tc.accent : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: `all ${motionTokens.fast}`,
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: colors.obsidian.DEFAULT,
                      }}
                    />
                  )}
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: colors.white.muted, margin: 0, lineHeight: 1.4 }}>
                {tier.description}
              </p>
              {isSelected && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: tc.accent,
                    marginTop: "0.5rem",
                    fontStyle: "italic",
                    opacity: 0.8,
                  }}
                >
                  {tier.intensity}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Hardcore stake input */}
      {flow.tier === "hardcore" && (
        <div
          style={{
            padding: "1rem",
            background: colors.amber.glow,
            border: `1px solid ${colors.amber.DEFAULT}40`,
            borderRadius: "10px",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              color: colors.amber.DEFAULT,
              fontWeight: 600,
              marginBottom: "0.5rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Lock a financial stake (optional)
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ color: colors.amber.DEFAULT, fontWeight: 700 }}>₦</span>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={flow.stakeAmount || ""}
              onChange={(e) =>
                setFlow((prev) => ({ ...prev, stakeAmount: Number(e.target.value) }))
              }
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: colors.white.DEFAULT,
                fontSize: "1.125rem",
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            />
          </div>
          <p style={{ fontSize: "0.75rem", color: colors.white.muted, marginTop: "0.5rem" }}>
            Forfeited to the stake pool if you miss your targets. Paid out to disciplined users.
          </p>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <BackButton onClick={onBack} />
        <NudgeButton onClick={onNext} accentColor={accentColor} flex>
          Draw the Bow →
        </NudgeButton>
      </div>
    </div>
  );
}