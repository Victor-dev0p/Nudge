"use client";

import React from "react";
import { colors } from "@/lib/theme";
import type { SignupFlowState, PartnerType } from "@/types/user";
import { PARTNER_OPTIONS } from "./signup.constants";
import { NudgeButton, BackButton, ErrorMessage, FieldLabel, TextInput } from "./signup.ui";

interface StepAllianceProps {
  flow: SignupFlowState;
  setFlow: React.Dispatch<React.SetStateAction<SignupFlowState>>;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  displayName: string;
  setDisplayName: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  usernameError: string;
  error: string;
  isLoading: boolean;
  accentColor: string;
  isHardcore: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepAlliance({
  flow,
  setFlow,
  email,
  setEmail,
  password,
  setPassword,
  displayName,
  setDisplayName,
  username,
  setUsername,
  usernameError,
  error,
  isLoading,
  accentColor,
  isHardcore,
  onBack,
  onSubmit,
}: StepAllianceProps) {
  const selectPartnerType = (key: PartnerType) => {
    setFlow((prev) => ({ ...prev, partnerType: key }));
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Heading */}
      <div>
        <h2
          style={{
            fontSize: "clamp(1.125rem, 3vw, 1.75rem)",
            fontWeight: 900,
            color: colors.white.DEFAULT,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}
        >
          Lock in your{" "}
          <span style={{ color: accentColor }}>account & alliance.</span>
        </h2>
        <p style={{ color: colors.white.muted, fontSize: "0.85rem" }}>
          Who watches your aim when the wind picks up?
        </p>
      </div>

      {/* Account fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <TextInput
            value={displayName}
            onChange={setDisplayName}
            placeholder="Victor Okafor"
            accentColor={accentColor}
          />
        </div>

        <div>
          <FieldLabel>Email</FieldLabel>
          <TextInput
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            accentColor={accentColor}
          />
        </div>

        <div>
          <FieldLabel>Password</FieldLabel>
          <TextInput
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Min. 8 characters"
            accentColor={accentColor}
          />
        </div>

        <div>
          <FieldLabel>Username</FieldLabel>
          <TextInput
            value={username}
            onChange={handleUsernameChange}
            placeholder="your_handle"
            accentColor={accentColor}
            prefix="@"
          />
          {usernameError && (
            <p style={{ fontSize: "0.75rem", color: colors.status.danger, marginTop: "0.375rem" }}>
              {usernameError}
            </p>
          )}
          {username && !usernameError && username.length >= 3 && (
            <p style={{ fontSize: "0.75rem", color: colors.status.safe, marginTop: "0.375rem" }}>
              @{username} is available
            </p>
          )}
        </div>
      </div>

      {/* Partner selection */}
      <div>
        <p
          style={{
            fontSize: "0.75rem",
            color: colors.white.muted,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          Who&apos;s watching?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {PARTNER_OPTIONS.map((opt) => {
            const isSelected = flow.partnerType === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => selectPartnerType(opt.key)}
                style={{
                  padding: "0.875rem 1rem",
                  borderRadius: "10px",
                  border: `1.5px solid ${isSelected ? accentColor : colors.obsidian.border}`,
                  background: isSelected ? `${accentColor}10` : "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    width: "1.125rem",
                    height: "1.125rem",
                    borderRadius: "50%",
                    border: `1.5px solid ${isSelected ? accentColor : colors.white.ghost}`,
                    background: isSelected ? accentColor : "transparent",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: isSelected ? accentColor : colors.white.DEFAULT,
                    }}
                  >
                    {opt.label}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: colors.white.muted }}>
                    {opt.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {flow.partnerType === "peer_invite" && (
          <div style={{ marginTop: "0.75rem" }}>
            <TextInput
              type="email"
              value={flow.partnerEmail || ""}
              onChange={(v) => setFlow((prev) => ({ ...prev, partnerEmail: v }))}
              placeholder="partner@email.com"
              accentColor={accentColor}
            />
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {isHardcore && (
        <p
          style={{
            fontSize: "0.75rem",
            color: colors.amber.DEFAULT,
            padding: "0.75rem",
            background: colors.amber.glow,
            borderRadius: "8px",
            border: `1px solid ${colors.amber.DEFAULT}30`,
            lineHeight: 1.5,
          }}
        >
          ⚡ Hardcore means what it says. The system will flood your device
          with alerts, expose your slacking publicly, and liquidate your
          stake if you miss targets. You asked for this.
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <BackButton onClick={onBack} />
        <NudgeButton onClick={onSubmit} accentColor={accentColor} flex isLoading={isLoading}>
          {isLoading ? "Releasing..." : "Release the Arrow →"}
        </NudgeButton>
      </div>
    </div>
  );
}