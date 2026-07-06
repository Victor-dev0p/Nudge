"use client";

import React from "react";
import { colors, motion as motionTokens } from "@/lib/theme";
import { SIGNUP_STEPS } from "./signup.constants";

interface StepIndicatorProps {
  currentStep: number;
  accentColor: string;
}

export function StepIndicator({ currentStep, accentColor }: StepIndicatorProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
      {SIGNUP_STEPS.map((step, i) => {
        const isActive = step.number === currentStep;
        const isDone = step.number < currentStep;

        return (
          <React.Fragment key={step.number}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: isActive ? 1 : isDone ? 0.7 : 0.35,
                transition: `opacity ${motionTokens.normal} ${motionTokens.easing.ease}`,
              }}
            >
              <div
                style={{
                  width: "1.75rem",
                  height: "1.75rem",
                  borderRadius: "50%",
                  border: `1.5px solid ${isActive || isDone ? accentColor : colors.white.ghost}`,
                  background: isDone ? accentColor : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: isDone
                    ? colors.obsidian.DEFAULT
                    : isActive
                    ? accentColor
                    : colors.white.ghost,
                  transition: `all ${motionTokens.normal} ${motionTokens.easing.ease}`,
                  flexShrink: 0,
                }}
              >
                {isDone ? "✓" : step.number}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? accentColor : colors.white.muted,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  transition: `color ${motionTokens.normal}`,
                }}
              >
                {step.label}
              </span>
            </div>

            {i < SIGNUP_STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: isDone ? accentColor : colors.obsidian.border,
                  transition: `background ${motionTokens.slow}`,
                  maxWidth: "3rem",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}