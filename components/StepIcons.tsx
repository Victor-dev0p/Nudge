"use client";

import React from "react";
import { colors } from "@/lib/theme";

/**
 * Each icon is a literal depiction of its step's title:
 *   01 — State your target   → an arrow nocked, aimed at a bullseye
 *   02 — Draw the bow        → a fully drawn bow, string pulled back
 *   03 — Find your alliance  → two figures linked by a scope/sightline
 *   04 — Submit proof        → an arrow buried dead-center in the target
 */

interface StepIconProps {
  accent: string;
  size?: number;
}

export function TargetIcon({ accent, size = 56 }: StepIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* Bullseye rings */}
      <circle cx="40" cy="28" r="14" stroke={accent} strokeWidth="1.5" opacity="0.25" />
      <circle cx="40" cy="28" r="9" stroke={accent} strokeWidth="1.5" opacity="0.5" />
      <circle cx="40" cy="28" r="4" fill={accent} opacity="0.9" />
      {/* Arrow approaching, nocked */}
      <line x1="4" y1="28" x2="24" y2="28" stroke={colors.white.muted} strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="24,28 18,24.5 18,31.5" fill={colors.white.muted} />
      <line x1="4" y1="28" x2="9" y2="24" stroke={colors.white.muted} strokeWidth="1" opacity="0.6" />
      <line x1="4" y1="28" x2="9" y2="32" stroke={colors.white.muted} strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export function DrawnBowIcon({ accent, size = 56 }: StepIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* Bow limbs — curved, under tension */}
      <path
        d="M 38 8 Q 22 28 38 48"
        stroke={colors.white.muted}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Drawn bowstring, pulled far back to the left — full tension */}
      <path
        d="M 38 8 L 12 28 L 38 48"
        stroke={accent}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arrow nocked at full draw */}
      <line x1="12" y1="28" x2="46" y2="28" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="46,28 41,25 41,31" fill={accent} />
      {/* Draw hand marker */}
      <circle cx="12" cy="28" r="2.5" fill={accent} />
      {/* Tension lines radiating off the string to show strain */}
      <line x1="9" y1="22" x2="6" y2="19" stroke={accent} strokeWidth="1" opacity="0.4" />
      <line x1="9" y1="34" x2="6" y2="37" stroke={accent} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export function AllianceIcon({ accent, size = 56 }: StepIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* Two figures facing each other */}
      <circle cx="14" cy="18" r="5" fill={colors.white.muted} opacity="0.7" />
      <line x1="14" y1="23" x2="14" y2="36" stroke={colors.white.muted} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="14" y1="36" x2="9" y2="46" stroke={colors.white.muted} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="14" y1="36" x2="19" y2="46" stroke={colors.white.muted} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      <circle cx="42" cy="18" r="5" fill={accent} opacity="0.85" />
      <line x1="42" y1="23" x2="42" y2="36" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      <line x1="42" y1="36" x2="37" y2="46" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="42" y1="36" x2="47" y2="46" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.85" />

      {/* Connecting sightline / scope link between them */}
      <line x1="19" y1="20" x2="37" y2="20" stroke={accent} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="28" cy="20" r="3" stroke={accent} strokeWidth="1" fill="none" opacity="0.7" />
    </svg>
  );
}

export function ProofIcon({ accent, size = 56 }: StepIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* Bullseye, struck dead center */}
      <circle cx="28" cy="28" r="18" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <circle cx="28" cy="28" r="12" stroke={accent} strokeWidth="1.5" opacity="0.5" />
      <circle cx="28" cy="28" r="6" stroke={accent} strokeWidth="1.5" opacity="0.7" />
      {/* Arrow shaft embedded straight through center */}
      <line x1="2" y1="28" x2="28" y2="28" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="28" x2="8" y2="23" stroke={accent} strokeWidth="1.5" opacity="0.7" />
      <line x1="2" y1="28" x2="8" y2="33" stroke={accent} strokeWidth="1.5" opacity="0.7" />
      {/* Impact burst */}
      <circle cx="28" cy="28" r="2.5" fill={accent} />
      <line x1="28" y1="14" x2="28" y2="8" stroke={accent} strokeWidth="1" opacity="0.6" />
      <line x1="38" y1="18" x2="42" y2="14" stroke={accent} strokeWidth="1" opacity="0.6" />
      <line x1="38" y1="38" x2="42" y2="42" stroke={accent} strokeWidth="1" opacity="0.6" />
    </svg>
  );
}