"use client";

import { useState } from "react";
import { colors, motion as motionTokens } from "@/lib/theme";
import { MOCK_USER, MOCK_GOAL_ALIGNED, MOCK_GOAL_AT_RISK, MOCK_DEADLINE_LABEL } from "@/lib/mockData";

import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { MicroTaskList } from "@/components/dashboard/MicroTaskList";
import { RelapseButton } from "@/components/dashboard/RelapseButton";
import { DevStateToggle } from "@/components/dashboard/DevStateToggle";

type MockView = "aligned" | "at_risk";

export default function DashboardClient() {
  const [view, setView] = useState<MockView>("aligned");
  const [recoveryActive, setRecoveryActive] = useState(false);

  const goal = view === "aligned" ? MOCK_GOAL_ALIGNED : MOCK_GOAL_AT_RISK;
  const displayStatus = recoveryActive ? "recovery" : goal.status;
  const deadlineLabel = recoveryActive
    ? "Pressure paused"
    : MOCK_DEADLINE_LABEL[view === "aligned" ? "active" : "slacking_l2"];

  const isWarning = !["active", "completed", "recovery"].includes(displayStatus);
  const accent = isWarning ? colors.amber.DEFAULT : colors.lime.DEFAULT;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: isWarning
          ? `radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.05) 0%, ${colors.obsidian.DEFAULT} 50%)`
          : colors.obsidian.DEFAULT,
        transition: `background ${motionTokens.slow} ${motionTokens.easing.ease}`,
        padding: "clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <span className="nudge-wordmark" style={{ fontSize: "1rem", color: accent }}>
            NUDGE
          </span>
          <span style={{ color: colors.obsidian.border }}>/</span>
          <span style={{ fontSize: "0.875rem", color: colors.white.muted }}>
            @{MOCK_USER.username}
          </span>
        </div>

        <div
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "50%",
            background: `${accent}18`,
            border: `1.5px solid ${accent}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: accent,
            fontFamily: "var(--font-mono)",
          }}
        >
          {MOCK_USER.displayName.split(" ").map((n) => n[0]).join("")}
        </div>
      </header>

      {/* Main grid */}
      <main
        style={{
          maxWidth: "920px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <StatusBanner status={displayStatus} deadlineLabel={deadlineLabel} />

        <GoalCard goal={goal} />

        <StreakDisplay
          currentStreak={recoveryActive ? goal.currentStreak : goal.currentStreak}
          longestStreak={goal.longestStreak}
          status={displayStatus}
        />

        <MicroTaskList tasks={goal.microTasks} status={displayStatus} />

        <RelapseButton
          isRecovery={recoveryActive}
          onClick={() => setRecoveryActive(true)}
        />
      </main>

      {/* Dev-only state preview toggle — remove once wired to real data */}
      <DevStateToggle
        currentView={view}
        onChange={(v) => {
          setView(v);
          setRecoveryActive(false);
        }}
      />
    </div>
  );
}