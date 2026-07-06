"use client";

import React from "react";
import { colors, motion as motionTokens } from "@/lib/theme";

// ─── NudgeButton ──────────────────────────────────────────────────────────────
interface NudgeButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  accentColor: string;
  flex?: boolean;
  isLoading?: boolean;
}

export function NudgeButton({
  children,
  onClick,
  accentColor,
  flex = false,
  isLoading = false,
}: NudgeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={{
        flex: flex ? 1 : undefined,
        padding: "0.9375rem 1.75rem",
        borderRadius: "10px",
        border: "none",
        background: accentColor,
        color: colors.obsidian.DEFAULT,
        fontSize: "0.95rem",
        fontWeight: 700,
        cursor: isLoading ? "wait" : "pointer",
        opacity: isLoading ? 0.7 : 1,
        letterSpacing: "-0.01em",
        transition: `all ${motionTokens.fast} ${motionTokens.easing.ease}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

// ─── BackButton ───────────────────────────────────────────────────────────────
interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.875rem 1.25rem",
        borderRadius: "10px",
        border: `1.5px solid ${colors.obsidian.border}`,
        background: "transparent",
        color: colors.white.muted,
        fontSize: "0.9rem",
        cursor: "pointer",
        transition: `all ${motionTokens.fast}`,
        fontFamily: "inherit",
      }}
    >
      ← Back
    </button>
  );
}

// ─── ErrorMessage ─────────────────────────────────────────────────────────────
interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p
      style={{
        fontSize: "0.85rem",
        color: colors.status.danger,
        padding: "0.75rem 1rem",
        background: "rgba(255,45,45,0.08)",
        borderRadius: "8px",
        border: `1px solid rgba(255,45,45,0.2)`,
        margin: 0,
      }}
    >
      {message}
    </p>
  );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────
interface FieldLabelProps {
  children: React.ReactNode;
}

export function FieldLabel({ children }: FieldLabelProps) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.75rem",
        color: colors.white.muted,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        marginBottom: "0.4rem",
      }}
    >
      {children}
    </label>
  );
}

// ─── TextInput ────────────────────────────────────────────────────────────────
interface TextInputProps {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  accentColor?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  prefix?: string;
}

export function TextInput({
  type = "text",
  value,
  onChange,
  placeholder,
  accentColor,
  onKeyDown,
  prefix,
}: TextInputProps) {
  return (
    <div style={{ position: "relative" }}>
      {prefix && (
        <span
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: colors.white.ghost,
            fontSize: "0.95rem",
            pointerEvents: "none",
          }}
        >
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        style={{
          width: "100%",
          padding: prefix ? "0.875rem 1rem 0.875rem 1.875rem" : "0.875rem 1rem",
          background: colors.obsidian.surface,
          border: `1.5px solid ${colors.obsidian.border}`,
          borderRadius: "10px",
          color: colors.white.DEFAULT,
          fontSize: "0.95rem",
          outline: "none",
          transition: `border-color ${motionTokens.fast}`,
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          if (accentColor) e.currentTarget.style.borderColor = `${accentColor}60`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = colors.obsidian.border;
        }}
      />
    </div>
  );
}

// ─── HardcoreParticles ────────────────────────────────────────────────────────
export function HardcoreParticles() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 37 + 11) % 100}%`,
            width: `${1 + (i % 3) * 0.5}px`,
            height: `${8 + (i % 4) * 6}px`,
            background: colors.amber.DEFAULT,
            borderRadius: "2px",
            opacity: 0,
            ["--drift" as string]: `${-20 + (i % 5) * 10}px`,
            animation: `particleDrift ${3 + (i % 4)}s linear ${(i * 0.4) % 3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── LaunchOverlay ────────────────────────────────────────────────────────────
interface LaunchOverlayProps {
  accentColor: string;
}

export function LaunchOverlay({ accentColor }: LaunchOverlayProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: accentColor,
        zIndex: 1000,
        animation: `flashIn 2s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Global keyframes (injected once) ────────────────────────────────────────
export function SignupKeyframes() {
  return (
    <style>{`
      @keyframes particleDrift {
        0%   { transform: translateY(100vh) translateX(0px); opacity: 0; }
        10%  { opacity: 0.6; }
        90%  { opacity: 0.3; }
        100% { transform: translateY(-10vh) translateX(var(--drift)); opacity: 0; }
      }
      @keyframes flashIn {
        0%   { opacity: 0; }
        20%  { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes arrowFly {
        0%   { transform: translateX(0) scaleX(1); opacity: 1; }
        50%  { transform: translateX(60px) scaleX(0.8); opacity: 0.8; }
        100% { transform: translateX(0) scaleX(1); opacity: 1; }
      }
      @keyframes archerShake {
        0%, 100% { transform: translateX(0); }
        20%      { transform: translateX(-3px) rotate(-0.5deg); }
        40%      { transform: translateX(3px) rotate(0.5deg); }
        60%      { transform: translateX(-2px); }
        80%      { transform: translateX(2px); }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: 0.4; }
        50%      { opacity: 1; }
      }
      @keyframes scopeIn {
        0%   { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
      }
      * { box-sizing: border-box; }
      input, textarea { outline: none; font-family: inherit; }
    `}</style>
  );
}