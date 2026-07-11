// app/(main)/dashboard/DashboardClient.tsx

"use client";

import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDashboard } from "@/lib/useDashboard";
import { COLLECTIONS } from "@/types/user";
import { colors, motion as motionTokens } from "@/lib/theme";

import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { MicroTaskList } from "@/components/dashboard/MicroTaskList";
import { RelapseButton } from "@/components/dashboard/RelapseButton";

export default function DashboardClient() {
  const router = useRouter();
  const { user, goal, tasks, loading, error } = useDashboard();

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: "100dvh",
        background: colors.obsidian.DEFAULT,
        display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column", gap: "1rem",
      }}>
        <span className="nudge-wordmark" style={{ fontSize: "1rem", color: colors.lime.DEFAULT }}>
          NUDGE
        </span>
        <div style={{
          width: "20px", height: "20px", borderRadius: "50%",
          border: `2px solid ${colors.obsidian.border}`,
          borderTopColor: colors.lime.DEFAULT,
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{
        minHeight: "100dvh", background: colors.obsidian.DEFAULT,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
      }}>
        <p style={{ color: colors.status.danger, fontSize: "0.9rem" }}>{error}</p>
      </div>
    );
  }

  // ─── No goal yet ─────────────────────────────────────────────────────────────
  if (!goal) {
    return (
      <div style={{
        minHeight: "100dvh", background: colors.obsidian.DEFAULT,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "1rem", padding: "2rem", textAlign: "center",
      }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: colors.white.DEFAULT, letterSpacing: "-0.03em" }}>
          No active goal yet.
        </h2>
        <p style={{ color: colors.white.muted, fontSize: "0.9rem" }}>
          Set your first target and draw the bow.
        </p>
        <button
          onClick={() => router.push("/signup")}
          style={{
            padding: "0.875rem 1.75rem", borderRadius: "10px",
            border: "none", background: colors.lime.DEFAULT,
            color: colors.obsidian.DEFAULT, fontWeight: 700,
            fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Set a Goal →
        </button>
      </div>
    );
  }

  const isWarning = !["active", "completed", "recovery"].includes(goal.status);
  const accent = isWarning ? colors.amber.DEFAULT : colors.lime.DEFAULT;

  const nextDue = tasks.find((t) => t.status === "pending" && t.dueAt);
  const deadlineLabel =
    goal.status === "recovery"
      ? "Pressure paused"
      : nextDue?.dueAt
      ? `Due ${new Date(nextDue.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : "No pending deadlines";

  // ─── Toggle task complete → writes to Firestore ──────────────────────────────
  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    if (!user || !goal) return;
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      await updateDoc(
        doc(db, COLLECTIONS.tasks(user.uid, goal.id), taskId),
        {
          status: newStatus,
          ...(newStatus === "completed"
            ? { completedAt: Date.now() }
            : { completedAt: null }),
        }
      );
    } catch (e) {
      console.error("Failed to update task:", e);
    }
  };

  // ─── Relapse → writes recovery status to Firestore ───────────────────────────
  const handleRelapse = async () => {
    if (!user || !goal) return;
    try {
      await updateDoc(
        doc(db, COLLECTIONS.goals(user.uid), goal.id),
        { status: "recovery" }
      );
    } catch (e) {
      console.error("Failed to update goal status:", e);
    }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: isWarning
        ? `radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.05) 0%, ${colors.obsidian.DEFAULT} 50%)`
        : colors.obsidian.DEFAULT,
      transition: `background ${motionTokens.slow} ${motionTokens.easing.ease}`,
      padding: "clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)",
    }}>
      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "2rem", flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <span className="nudge-wordmark" style={{ fontSize: "1rem", color: accent }}>
            NUDGE
          </span>
          <span style={{ color: colors.obsidian.border }}>/</span>
          <span style={{ fontSize: "0.875rem", color: colors.white.muted }}>
            @{user?.username}
          </span>
        </div>
        <div style={{
          width: "2.25rem", height: "2.25rem", borderRadius: "50%",
          background: `${accent}18`, border: `1.5px solid ${accent}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.7rem", fontWeight: 700, color: accent,
          fontFamily: "var(--font-mono)",
        }}>
          {user?.displayName?.split(" ").map((n) => n[0]).join("") ?? "?"}
        </div>
      </header>

      <main style={{
        maxWidth: "920px", margin: "0 auto",
        display: "flex", flexDirection: "column", gap: "1.25rem",
      }}>
        <StatusBanner status={goal.status} deadlineLabel={deadlineLabel} />
        <GoalCard goal={goal} />
        <StreakDisplay
          currentStreak={goal.currentStreak}
          longestStreak={goal.longestStreak}
          status={goal.status}
        />
        <MicroTaskList
          tasks={tasks}
          status={goal.status}
          onToggle={handleTaskToggle}
        />
        <RelapseButton
          isRecovery={goal.status === "recovery"}
          onClick={handleRelapse}
        />
      </main>
    </div>
  );
}