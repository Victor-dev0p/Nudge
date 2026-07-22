// lib/usePulse.ts

import { useEffect, useState } from "react";
import {
  collection, query, orderBy, limit, onSnapshot,
  addDoc, updateDoc, doc, arrayUnion, arrayRemove,
  increment, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FeedPost, PostReply } from "@/types/posts";
import { POSTS_COLLECTION, POST_REPLIES_COLLECTION } from "@/types/posts";
import type { NudgeUser, GoalCategory } from "@/types/user";

// ─── Feed hook — real-time, latest 50 posts ───────────────────────────────────
export function useFeed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FeedPost)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { posts, loading };
}

// ─── Replies for a post ───────────────────────────────────────────────────────
export function useReplies(postId: string | null) {
  const [replies, setReplies] = useState<PostReply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, POST_REPLIES_COLLECTION(postId)),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PostReply)));
      setLoading(false);
    });
    return () => unsub();
  }, [postId]);

  return { replies, loading };
}

// ─── Create a new post ────────────────────────────────────────────────────────
export async function createPost(
  user: NudgeUser,
  content: string,
  category: GoalCategory,
  type: FeedPost["type"] = "progress_log",
  extras?: {
    goalId?: string;
    proofVerified?: boolean;
    journalEntryId?: string;
    journalTitle?: string;
  }
): Promise<string> {
  const ref = await addDoc(collection(db, POSTS_COLLECTION), {
    authorId: user.uid,
    authorName: user.displayName,
    authorUsername: user.username,
    authorAvatarUrl: user.avatarUrl ?? null,
    authorTier: user.activeTier,
    type,
    content: content.trim(),
    category,
    goalId: extras?.goalId ?? null,
    proofVerified: extras?.proofVerified ?? false,
    fuelCount: 0,
    fueledBy: [],
    alignCount: 0,
    replyCount: 0,
    isPublic: true,
    createdAt: Date.now(),
    journalEntryId: extras?.journalEntryId ?? null,
    journalTitle: extras?.journalTitle ?? null,
  });
  return ref.id;
}

// ─── Publish a journal entry to Pulse ─────────────────────────────────────────
export async function publishJournalToFeed(
  user: NudgeUser,
  entryId: string,
  title: string,
  content: string,
  category: GoalCategory
): Promise<string> {
  return createPost(
    user,
    `📖 **${title}**\n\n${content}`,
    category,
    "journal",
    { journalEntryId: entryId, journalTitle: title }
  );
}

// ─── Fuel (like) a post ───────────────────────────────────────────────────────
export async function fuelPost(postId: string, uid: string, alreadyFueled: boolean) {
  const ref = doc(db, POSTS_COLLECTION, postId);
  if (alreadyFueled) {
    await updateDoc(ref, {
      fueledBy: arrayRemove(uid),
      fuelCount: increment(-1),
    });
  } else {
    await updateDoc(ref, {
      fueledBy: arrayUnion(uid),
      fuelCount: increment(1),
    });
  }
}

// ─── Reply to a post ──────────────────────────────────────────────────────────
export async function replyToPost(
  postId: string,
  user: NudgeUser,
  content: string
) {
  await addDoc(collection(db, POST_REPLIES_COLLECTION(postId)), {
    postId,
    authorId: user.uid,
    authorName: user.displayName,
    authorUsername: user.username,
    authorAvatarUrl: user.avatarUrl ?? null,
    content: content.trim(),
    createdAt: Date.now(),
    fuelCount: 0,
    fueledBy: [],
  });
  // Increment reply count on the post
  await updateDoc(doc(db, POSTS_COLLECTION, postId), {
    replyCount: increment(1),
  });
}

// ─── Align — clone a goal structure into current user's dashboard ─────────────
export async function alignPost(postId: string, uid: string) {
  await updateDoc(doc(db, POSTS_COLLECTION, postId), {
    alignCount: increment(1),
  });
  // TODO: clone the referenced goal structure into the user's goals — Phase next
}