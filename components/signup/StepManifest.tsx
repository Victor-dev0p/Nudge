"use client";

import React from "react";
import { colors, motion as motionTokens } from "@/lib/theme";
import type { SignupFlowState, GoalCategory } from "@/types/user";
import { CATEGORIES } from "./signup.constants";
import { NudgeButton, ErrorMessage } from "./signup.ui";

interface StepManifestProps {
  flow: SignupFlowState;
  setFlow: React.Dispatch<React.SetStateAction<SignupFlowState>>;
  error: string;
  setError: (e: string) => void;
  goalInputRef: React.RefObject<HTMLTextAreaElement | null>;
  accentColor: string;
  onNext: () => void;
}

export function StepManifest({
  flow,
  setFlow,
  error,
  setError,
  goalInputRef,
  accentColor,
  onNext,
}: StepManifestProps) {
  const selectCategory = (key: GoalCategory) => {
    setFlow((prev) => ({ ...prev, goalCategory: key }));
    setError("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Heading */}
      <div>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            fontWeight: 900,
            color: colors.white.DEFAULT,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}
        >
          What are we{" "}
          <span style={{ color: accentColor }}>conquering?</span>
        </h1>
        <p style={{ color: colors.white.muted, fontSize: "0.9rem" }}>
          Be specific. The arrow needs a target.
        </p>
      </div>

      {/* Goal textarea */}
      <textarea
        ref={goalInputRef}
        value={flow.goalText}
        onChange={(e) => {
          setFlow((prev) => ({ ...prev, goalText: e.target.value }));
          setError("");
        }}
        placeholder="e.g. Ship my SaaS MVP in 30 days / Stay sober this month / Run 5km daily"
        rows={3}
        style={{
          width: "100%",
          background: colors.obsidian.surface,
          border: `1.5px solid ${
            flow.goalText.length > 9 ? `${accentColor}60` : colors.obsidian.border
          }`,
          borderRadius: "10px",
          padding: "1rem",
          color: colors.white.DEFAULT,
          fontSize: "1rem",
          lineHeight: 1.6,
          resize: "none",
          outline: "none",
          fontFamily: "inherit",
          transition: `border-color ${motionTokens.fast}`,
        }}
      />

      {/* Category pills */}
      <div>
        <p
          style={{
            color: colors.white.muted,
            fontSize: "0.75rem",
            marginBottom: "0.75rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Category
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {CATEGORIES.map((cat) => {
            const isSelected = flow.goalCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => selectCategory(cat.key)}
                style={{
                  padding: "0.4rem 0.875rem",
                  borderRadius: "100px",
                  border: `1.5px solid ${isSelected ? accentColor : colors.obsidian.border}`,
                  background: isSelected ? `${accentColor}18` : "transparent",
                  color: isSelected ? accentColor : colors.white.muted,
                  fontSize: "0.8rem",
                  fontWeight: isSelected ? 600 : 400,
                  cursor: "pointer",
                  transition: `all ${motionTokens.fast}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontFamily: "inherit",
                }}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <NudgeButton onClick={onNext} accentColor={accentColor}>
        Lock the Target →
      </NudgeButton>
    </div>
  );
}