// components/profile/StatsTab.tsx

"use client";

import React from "react";
import { colors } from "@/lib/theme";
import type { NudgeUser, NudgeGoal } from "@/types/user";

interface StatsTabProps {
  user: NudgeUser;
  goals: NudgeGoal[];
}

export function StatsTab({ user, goals }: StatsTabProps) {
  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const activeGoals = goals.filter((g) => g.status === "active").length;
  const totalTasks = goals.reduce((acc, g) => acc + g.microTasks.length, 0);
  const completedTasks = goals.reduce(
    (acc, g) => acc + g.microTasks.filter((t) => t.status === "completed").length,
    0
  );
  const daysSince = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));

  const stats = [
    { label: "Active goals",       value: activeGoals.toString()                                    },
    { label: "Completed goals",    value: completedGoals.toString()                                  },
    { label: "Total tasks",        value: totalTasks.toString()                                      },
    { label: "Tasks completed",    value: completedTasks.toString()                                  },
    { label: "Lifetime completion",value: `${user.lifetimeCompletionRate}%`                         },
    { label: "Longest streak",     value: `${user.totalStreak}d`                                    },
    { label: "Total earned",       value: `₦${(user.totalEarned / 100).toLocaleString()}`           },
    { label: "Total forfeited",    value: `₦${(user.totalForfeited / 100).toLocaleString()}`        },
    { label: "People I sponsor",   value: user.sponsorCount.toString()                              },
    { label: "My sponsors",        value: user.sponseeCount.toString()                              },
    { label: "Followers",          value: user.followerCount.toString()                             },
    { label: "Following",          value: user.followingCount.toString()                            },
    { label: "Days on Nudge",      value: daysSince.toString()                                      },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            padding: "0.875rem 1.125rem",
            background: colors.obsidian.surface,
            border: `1px solid ${colors.obsidian.border}`,
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.875rem", color: colors.white.muted }}>{stat.label}</span>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: colors.white.DEFAULT, fontFamily: "var(--font-mono)" }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}