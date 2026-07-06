/**
 * NUDGE — Mock Dashboard Data
 * Shaped EXACTLY like the real NudgeGoal / MicroTask / NudgeUser types.
 * Swapping this for live Firestore data later is a drop-in change —
 * the components below never need to know the difference.
 */

import type { NudgeGoal, MicroTask, NudgeUser, GoalStatus } from "@/types/user";

// ─── Mock user ────────────────────────────────────────────────────────────────
export const MOCK_USER: NudgeUser = {
  uid: "mock_uid_001",
  email: "victor@example.com",
  displayName: "Victor Okafor",
  username: "victor_builds",
  role: "user",
  status: "active",
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  lastActiveAt: Date.now(),
  totalStreak: 6,
  lifetimeCompletionRate: 82,
  activeTier: "hardcore",
  followerCount: 24,
  followingCount: 18,
  sponsorCount: 0,
  sponseeCount: 1,
  feedWeights: {
    primaryCategory: "tech_execution",
    weights: { tech_execution: 60, health_fitness: 30 },
    globalDiscovery: 10,
  },
  walletBalance: 4500000, // ₦45,000 in kobo
  walletCurrency: "NGN",
  totalEarned: 2000000,
  totalForfeited: 500000,
  blockedUids: [],
  reportedUids: [],
  privacyLevel: "public",
};

// ─── Mock micro-tasks ────────────────────────────────────────────────────────
function buildTasks(status: GoalStatus): MicroTask[] {
  const allCompleted = status === "completed";
  const isSlackingOrWorse = ["slacking_l1", "slacking_l2", "slacking_l3"].includes(status);

  return [
    {
      id: "task_001",
      text: "Set up project repo and push initial commit",
      status: "completed",
      proofRequired: true,
      proofType: "github_commit",
      proofUrl: "https://github.com/example/nudge-mvp/commit/a1b2c3d",
      proofVerifiedBy: "ai",
      completedAt: Date.now() - 1000 * 60 * 60 * 20,
    },
    {
      id: "task_002",
      text: "Design and build the signup flow",
      status: "completed",
      proofRequired: true,
      proofType: "github_commit",
      proofUrl: "https://github.com/example/nudge-mvp/commit/d4e5f6g",
      proofVerifiedBy: "sponsor",
      completedAt: Date.now() - 1000 * 60 * 60 * 8,
    },
    {
      id: "task_003",
      text: "Implement dashboard with live task tracking",
      status: isSlackingOrWorse ? "pending" : allCompleted ? "completed" : "in_progress",
      proofRequired: true,
      proofType: "github_commit",
      dueAt: Date.now() + 1000 * 60 * 60 * 4,
    },
    {
      id: "task_004",
      text: "Submit 30-second proof video of deployed build",
      status: "pending",
      proofRequired: true,
      proofType: "live_video",
      dueAt: Date.now() + 1000 * 60 * 60 * 10,
    },
    {
      id: "task_005",
      text: "Write today's progress log for the feed",
      status: "pending",
      proofRequired: false,
      proofType: "text_log",
      dueAt: Date.now() + 1000 * 60 * 60 * 14,
    },
  ];
}

// ─── Mock goal: ON TRACK state ────────────────────────────────────────────────
export const MOCK_GOAL_ALIGNED: NudgeGoal = {
  id: "goal_aligned_001",
  text: "Ship the Nudge MVP web app end to end",
  category: "tech_execution",
  tier: "hardcore",
  status: "active",
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  currentStreak: 6,
  longestStreak: 11,
  completionRate: 82,
  microTasks: buildTasks("active"),
  partnerType: "peer_invite",
  partnerEmail: "tunde@example.com",
  stakeAmount: 1000000, // ₦10,000 in kobo
  stakeCurrency: "NGN",
};

// ─── Mock goal: AT RISK / SLACKING state (Level 2 — social exposure) ─────────
export const MOCK_GOAL_AT_RISK: NudgeGoal = {
  id: "goal_at_risk_001",
  text: "Ship the Nudge MVP web app end to end",
  category: "tech_execution",
  tier: "hardcore",
  status: "slacking_l2",
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  currentStreak: 0,
  longestStreak: 11,
  completionRate: 71,
  microTasks: buildTasks("slacking_l2"),
  partnerType: "peer_invite",
  partnerEmail: "tunde@example.com",
  stakeAmount: 1000000,
  stakeCurrency: "NGN",
};

// ─── Helper: deadline countdown text (mock) ──────────────────────────────────
export const MOCK_DEADLINE_LABEL = {
  active: "Today, 9:00 PM",
  slacking_l2: "23h 12m overdue",
} as const;