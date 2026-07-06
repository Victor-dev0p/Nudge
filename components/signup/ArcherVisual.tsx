"use client";

import React from "react";
import { colors, motion as motionTokens } from "@/lib/theme";
import type { AccountabilityTier } from "@/types/user";

interface ArcherVisualProps {
  step: number;
  tier: AccountabilityTier | null;
  goalProgress: number;   // 0–1
  hasPartner: boolean;
  launched: boolean;
  accentColor: string;
}

export function ArcherVisual({
  step,
  tier,
  goalProgress,
  hasPartner,
  launched,
  accentColor,
}: ArcherVisualProps) {
  const isHardcore = tier === "hardcore";
  const drawAmount =
    tier === "hardcore" ? 1 : tier === "firm" ? 0.6 : tier === "soft" ? 0.3 : 0;

  // String pulls back as draw increases
  const bowStringX = 52 - drawAmount * 18;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "380px",
        aspectRatio: "2 / 1",
        position: "relative",
        animation:
          isHardcore && step === 2
            ? `archerShake 0.5s ${motionTokens.easing.ease} infinite`
            : "none",
      }}
    >
      <svg
        viewBox="0 0 380 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.04" />
            <stop offset="100%" stopColor={colors.obsidian.DEFAULT} stopOpacity="0" />
          </radialGradient>
          <filter id="arrowGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="380" height="190" fill="url(#bgGrad)" />

        {/* Hardcore wind streaks */}
        {isHardcore && step >= 2 &&
          [20, 45, 80, 120, 155, 175].map((y, i) => (
            <line
              key={i}
              x1={-10 + (i % 2) * 20}
              y1={y}
              x2={40 + (i % 3) * 15}
              y2={y + 2}
              stroke={colors.amber.DEFAULT}
              strokeWidth="0.5"
              strokeOpacity="0.3"
              style={{
                animation: `pulseGlow ${1.2 + i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}

        {/* Bullseye target */}
        <g transform="translate(330, 95)">
          {[28, 20, 13, 7].map((r, i) => (
            <circle
              key={i}
              r={r}
              stroke={accentColor}
              strokeWidth="1"
              strokeOpacity={launched ? 1 : 0.15 + i * 0.1}
              fill="none"
              style={{ transition: `stroke-opacity ${motionTokens.slow}` }}
            />
          ))}
          <circle
            r="3.5"
            fill={accentColor}
            opacity={launched ? 1 : 0.5}
            filter="url(#arrowGlow)"
            style={{ transition: `opacity ${motionTokens.slow}` }}
          />

          {/* Scope overlay — appears after partner is chosen */}
          {hasPartner && step >= 3 && (
            <g style={{ animation: `scopeIn ${motionTokens.normal} ${motionTokens.easing.spring} forwards` }}>
              <line x1="-40" y1="0" x2="-30" y2="0" stroke={colors.lime.DEFAULT} strokeWidth="1" strokeOpacity="0.7" />
              <line x1="30"  y1="0" x2="40"  y2="0" stroke={colors.lime.DEFAULT} strokeWidth="1" strokeOpacity="0.7" />
              <line x1="0" y1="-40" x2="0" y2="-30" stroke={colors.lime.DEFAULT} strokeWidth="1" strokeOpacity="0.7" />
              <line x1="0" y1="30"  x2="0" y2="40"  stroke={colors.lime.DEFAULT} strokeWidth="1" strokeOpacity="0.7" />
              <circle r="36" stroke={colors.lime.DEFAULT} strokeWidth="0.5" strokeOpacity="0.3" fill="none" strokeDasharray="4 4" />
            </g>
          )}
        </g>

        {/* Arrow — crystallizes as user types */}
        {step >= 1 && goalProgress > 0.05 && (
          <g style={{ animation: launched ? `arrowFly ${motionTokens.dramatic} ${motionTokens.easing.sharp} forwards` : "none" }}>
            {/* Shaft */}
            <line
              x1={bowStringX + 2}
              y1="95"
              x2={bowStringX + 2 + 260 * goalProgress}
              y2="95"
              stroke={accentColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              filter="url(#arrowGlow)"
              style={{ transition: `all ${motionTokens.normal} ${motionTokens.easing.ease}` }}
            />
            {/* Arrowhead */}
            <polygon
              points={`
                ${bowStringX + 2 + 260 * goalProgress + 10},95
                ${bowStringX + 2 + 260 * goalProgress - 2},91
                ${bowStringX + 2 + 260 * goalProgress - 2},99
              `}
              fill={accentColor}
              filter="url(#arrowGlow)"
              style={{ transition: `all ${motionTokens.normal} ${motionTokens.easing.ease}` }}
            />
            {/* Fletching */}
            <line x1={bowStringX + 2} y1="95" x2={bowStringX + 8} y2="91" stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" />
            <line x1={bowStringX + 2} y1="95" x2={bowStringX + 8} y2="99" stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" />
            {/* Goal text on shaft */}
            {goalProgress > 0.5 && (
              <text
                x={bowStringX + 10 + 130 * goalProgress}
                y="91"
                fontSize="6"
                fill={accentColor}
                fillOpacity="0.6"
                fontFamily="monospace"
                letterSpacing="0.05em"
                style={{ transition: `all ${motionTokens.slow}` }}
              >
                LOCKED
              </text>
            )}
          </g>
        )}

        {/* Bow */}
        <g>
          <path
            d={`M 52 60 Q ${40 - drawAmount * 10} 95 52 130`}
            stroke={colors.white.muted}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            style={{ transition: `d ${motionTokens.slow} ${motionTokens.easing.ease}` }}
          />
          <path
            d={`M 52 60 L ${bowStringX} 95 L 52 130`}
            stroke={tier === "hardcore" ? colors.amber.DEFAULT : colors.white.ghost}
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            filter={tier === "hardcore" ? "url(#arrowGlow)" : undefined}
            style={{ transition: `all ${motionTokens.slow} ${motionTokens.easing.ease}` }}
          />
          {drawAmount > 0 && (
            <circle
              cx={bowStringX}
              cy="95"
              r="3"
              fill={accentColor}
              fillOpacity="0.8"
              style={{ transition: `all ${motionTokens.slow} ${motionTokens.easing.ease}` }}
            />
          )}
        </g>

        {/* Archer silhouette */}
        <g opacity="0.5">
          <circle cx="28" cy="68" r="8" fill={colors.white.ghost} />
          <line x1="28" y1="76" x2="28" y2="110" stroke={colors.white.ghost} strokeWidth="3" strokeLinecap="round" />
          <line
            x1="28" y1="82"
            x2={bowStringX} y2="95"
            stroke={colors.white.ghost} strokeWidth="2" strokeLinecap="round"
            style={{ transition: `x2 ${motionTokens.slow} ${motionTokens.easing.ease}` }}
          />
          <line x1="28" y1="82" x2="52" y2="95" stroke={colors.white.ghost} strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="110" x2="18" y2="130" stroke={colors.white.ghost} strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="110" x2="38" y2="130" stroke={colors.white.ghost} strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Ground line */}
        <line x1="60" y1="165" x2="320" y2="165" stroke={colors.obsidian.border} strokeWidth="0.5" strokeDasharray="3 6" />
      </svg>
    </div>
  );
}