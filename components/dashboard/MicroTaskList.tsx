"use client";

import React from "react";
import { colors } from "@/lib/theme";
import type { MicroTask, GoalStatus } from "@/types/user";

interface MicroTaskListProps {
  tasks: MicroTask[];
  status: GoalStatus;
  onToggle?: (taskId: string, currentStatus: string) => void;
}

const PROOF_LABELS: Record<MicroTask["proofType"], string> = {
  live_video: "Live video",
  photo: "Photo proof",
  text_log: "Text log",
  github_commit: "Commit hash",
  external_link: "Link",
  none: "No proof needed",
};

function TaskStatusIcon({ status, accent }: { status: MicroTask["status"]; accent: string }) {
  if (status === "completed") {
    return (
      <div
        style={{
          width: "1.375rem",
          height: "1.375rem",
          borderRadius: "6px",
          background: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ color: colors.obsidian.DEFAULT, fontSize: "0.75rem", fontWeight: 900 }}>✓</span>
      </div>
    );
  }
  if (status === "awaiting_review") {
    return (
      <div
        style={{
          width: "1.375rem",
          height: "1.375rem",
          borderRadius: "6px",
          border: `1.5px solid ${accent}`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "0.65rem", color: accent }}>⏳</span>
      </div>
    );
  }
  if (status === "in_progress") {
    return (
      <div
        style={{
          width: "1.375rem",
          height: "1.375rem",
          borderRadius: "6px",
          border: `1.5px solid ${accent}`,
          background: `${accent}18`,
          flexShrink: 0,
        }}
      />
    );
  }
  if (status === "rejected") {
    return (
      <div
        style={{
          width: "1.375rem",
          height: "1.375rem",
          borderRadius: "6px",
          border: `1.5px solid ${colors.status.danger}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "0.7rem", color: colors.status.danger }}>✕</span>
      </div>
    );
  }
  // pending
  return (
    <div
      style={{
        width: "1.375rem",
        height: "1.375rem",
        borderRadius: "6px",
        border: `1.5px solid ${colors.obsidian.border}`,
        flexShrink: 0,
      }}
    />
  );
}

export function MicroTaskList({ tasks, status, onToggle }: MicroTaskListProps) {
  const isWarning = !["active", "completed"].includes(status);
  const accent = isWarning ? colors.amber.DEFAULT : colors.lime.DEFAULT;

  return (
    <div
      style={{
        background: colors.obsidian.surface,
        border: `1px solid ${colors.obsidian.border}`,
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1rem 1.25rem",
          borderBottom: `1px solid ${colors.obsidian.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: colors.white.DEFAULT, margin: 0 }}>
          Today&apos;s micro-tasks
        </p>
        <span
          style={{
            fontSize: "0.7rem",
            color: colors.white.ghost,
            fontFamily: "var(--font-mono)",
          }}
        >
          AI-generated
        </span>
      </div>

      <div>
        {tasks.map((task, i) => (
          <div
            key={task.id}
            onClick={() => onToggle?.(task.id, task.status)}
            style={{
              padding: "1rem 1.25rem",
              borderBottom: i < tasks.length - 1 ? `1px solid ${colors.obsidian.border}` : "none",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.875rem",
              cursor: onToggle ? "pointer" : "default",
            }}
          >
            <TaskStatusIcon status={task.status} accent={accent} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: task.status === "completed" ? colors.white.muted : colors.white.DEFAULT,
                  margin: 0,
                  textDecoration: task.status === "completed" ? "line-through" : "none",
                  lineHeight: 1.5,
                }}
              >
                {task.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginTop: "0.375rem" }}>
                {task.proofRequired && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: colors.white.ghost,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {PROOF_LABELS[task.proofType]}
                  </span>
                )}
                {task.dueAt && task.status === "pending" && (
                  <span style={{ fontSize: "0.7rem", color: isWarning ? colors.amber.DEFAULT : colors.white.ghost }}>
                    Due {new Date(task.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}