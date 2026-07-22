// types/posts.ts

import type { GoalCategory } from "@/types/user";

export type PostType = "progress_log" | "journal" | "relapse_slip" | "milestone" | "system_alert";

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl?: string;
  authorTier: "soft" | "firm" | "hardcore";
  type: PostType;
  content: string;
  category: GoalCategory;
  goalId?: string;
  proofVerified: boolean;
  fuelCount: number;
  fueledBy: string[];        // UIDs who fueled
  alignCount: number;
  replyCount: number;
  isPublic: boolean;
  createdAt: number;
  // Journal-specific
  journalEntryId?: string;
  journalTitle?: string;
}

export const POSTS_COLLECTION = "posts" as const;
export const POST_REPLIES_COLLECTION = (postId: string) => `posts/${postId}/replies` as const;

export interface PostReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: number;
  fuelCount: number;
  fueledBy: string[];
}