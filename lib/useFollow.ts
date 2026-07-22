// lib/useFollow.ts

import { useEffect, useState } from "react";
import {
  doc, getDoc, updateDoc, increment,
  collection, addDoc, query, where, getDocs, deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/types/user";

// ─── Follow collection: /follows/{followId} ───────────────────────────────────
// Document shape: { followerId, followingId, createdAt }
const FOLLOWS = "follows";

export function getFollowId(followerId: string, followingId: string) {
  return `${followerId}_${followingId}`;
}

// ─── Check if current user follows a target ───────────────────────────────────
export function useIsFollowing(currentUid: string | null, targetUid: string | null): boolean {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!currentUid || !targetUid || currentUid === targetUid) return;

    const unsub = onSnapshot(
      doc(db, FOLLOWS, getFollowId(currentUid, targetUid)),
      (snap) => setIsFollowing(snap.exists())
    );
    return () => unsub();
  }, [currentUid, targetUid]);

  return isFollowing;
}

// ─── Follow a user ────────────────────────────────────────────────────────────
export async function followUser(followerId: string, followingId: string) {
  const followId = getFollowId(followerId, followingId);

  // Write follow doc
  await addDoc(collection(db, FOLLOWS), {
    id: followId,
    followerId,
    followingId,
    createdAt: Date.now(),
  });

  // Update counts on both users
  await Promise.all([
    updateDoc(doc(db, COLLECTIONS.users, followerId), {
      followingCount: increment(1),
    }),
    updateDoc(doc(db, COLLECTIONS.users, followingId), {
      followerCount: increment(1),
    }),
  ]);

  // Write notification to the person being followed
  await addDoc(collection(db, "notifications"), {
    uid: followingId,
    type: "new_follower",
    title: "New follower",
    body: `Someone started following you.`,
    data: { followerId },
    read: false,
    createdAt: Date.now(),
  });
}

// ─── Unfollow a user ──────────────────────────────────────────────────────────
export async function unfollowUser(followerId: string, followingId: string) {
  // Find and delete follow doc
  const q = query(
    collection(db, FOLLOWS),
    where("followerId", "==", followerId),
    where("followingId", "==", followingId)
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));

  // Decrement counts
  await Promise.all([
    updateDoc(doc(db, COLLECTIONS.users, followerId), {
      followingCount: increment(-1),
    }),
    updateDoc(doc(db, COLLECTIONS.users, followingId), {
      followerCount: increment(-1),
    }),
  ]);
}

// ─── Get followers of a user ──────────────────────────────────────────────────
export async function getFollowers(uid: string): Promise<string[]> {
  const q = query(collection(db, FOLLOWS), where("followingId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().followerId as string);
}

// ─── Get users that a user follows ───────────────────────────────────────────
export async function getFollowing(uid: string): Promise<string[]> {
  const q = query(collection(db, FOLLOWS), where("followerId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().followingId as string);
}