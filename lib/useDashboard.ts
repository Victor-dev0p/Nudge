// lib/useDashboard.ts

import { useEffect, useState } from "react";
import { doc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { COLLECTIONS } from "@/types/user";
import type { NudgeUser, NudgeGoal, MicroTask, GoalStatus } from "@/types/user";

export interface DashboardData {
  user: NudgeUser | null;
  goal: NudgeGoal | null;
  tasks: MicroTask[];
  loading: boolean;
  error: string | null;
}

/**
 * Computes the current goal status based on task completion and time.
 * This drives the lime/amber UI state shift without manual toggling.
 */
function computeGoalStatus(goal: NudgeGoal, tasks: MicroTask[]): GoalStatus {
  // Keep manual states (recovery, forfeited, completed) as-is
  if (["recovery", "forfeited", "completed", "paused"].includes(goal.status)) {
    return goal.status;
  }

  const now = Date.now();
  const pendingOverdue = tasks.filter(
    (t) => t.status === "pending" && t.dueAt && t.dueAt < now
  );

  if (pendingOverdue.length === 0) return "active";

  const mostOverdueMs = Math.max(...pendingOverdue.map((t) => now - (t.dueAt ?? now)));
  const hoursOverdue = mostOverdueMs / (1000 * 60 * 60);

  if (hoursOverdue >= 48) return "slacking_l3";
  if (hoursOverdue >= 24) return "slacking_l2";
  if (hoursOverdue >= 4)  return "slacking_l1";
  return "active";
}

/**
 * Computes the completion rate (0–100) from task list.
 */
function computeCompletionRate(tasks: MicroTask[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === "completed" || t.status === "awaiting_review").length;
  return Math.round((done / tasks.length) * 100);
}

export function useDashboard(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    user: null,
    goal: null,
    tasks: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Wait for Firebase auth to resolve
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setData({ user: null, goal: null, tasks: [], loading: false, error: null });
        return;
      }

      const uid = firebaseUser.uid;

      // Listen to user document
      const userUnsub = onSnapshot(
        doc(db, COLLECTIONS.users, uid),
        (userSnap) => {
          if (!userSnap.exists()) {
            setData((prev) => ({ ...prev, loading: false, error: "User not found." }));
            return;
          }

          const user = userSnap.data() as NudgeUser;

          // Listen to goals sub-collection — get the first active goal
          const goalsUnsub = onSnapshot(
            collection(db, COLLECTIONS.goals(uid)),
            (goalsSnap) => {
              const goals = goalsSnap.docs.map((d) => d.data() as NudgeGoal);
              const activeGoal = goals.find((g) => g.status !== "completed" && g.status !== "paused") ?? goals[0] ?? null;

              if (!activeGoal) {
                setData({ user, goal: null, tasks: [], loading: false, error: null });
                return;
              }

              // Listen to tasks sub-collection for the active goal
              const tasksQuery = query(
                collection(db, COLLECTIONS.tasks(uid, activeGoal.id)),
                orderBy("dueAt", "asc")
              );

              const tasksUnsub = onSnapshot(tasksQuery, (tasksSnap) => {
                const tasks = tasksSnap.docs.map((d) => d.data() as MicroTask);

                // Compute live status and completion from real task data
                const liveStatus = computeGoalStatus(activeGoal, tasks);
                const liveCompletion = computeCompletionRate(tasks);

                const hydratedGoal: NudgeGoal = {
                  ...activeGoal,
                  status: liveStatus,
                  completionRate: liveCompletion,
                };

                setData({
                  user,
                  goal: hydratedGoal,
                  tasks,
                  loading: false,
                  error: null,
                });
              });

              // Return tasks unsub via closure — cleaned up when goals change
              return tasksUnsub;
            }
          );

          // Cleanup goals listener on user change
          return () => goalsUnsub();
        }
      );

      return () => userUnsub();
    });

    return () => unsubscribeAuth();
  }, []);

  return data;
}