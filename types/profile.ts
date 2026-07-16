// types/profile.ts

import type { GoalCategory } from "@/types/user";

export interface JournalEntry {
  id: string;
  uid: string;
  title: string;
  content: string;
  category: GoalCategory;
  goalId?: string;
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
}

export const JOURNAL_COLLECTION = (uid: string) => `users/${uid}/journal` as const;