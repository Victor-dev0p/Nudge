// lib/useUnreadMessages.ts

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CHAT_COLLECTIONS } from "@/types/messages";
import { useAuth } from "@/lib/auth";

/**
 * Returns this user's total unread count across all threads.
 * Reads from unreadCountFor.{uid} on each chat doc — per-user unread tracking.
 */
export function useUnreadMessages(): number {
  const { user } = useAuth();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) { setTotal(0); return; }

    const q = query(
      collection(db, CHAT_COLLECTIONS.chats),
      where("participantIds", "array-contains", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      let count = 0;
      snap.docs.forEach((d) => {
        const data = d.data();
        // Read per-user unread count from the map
        const perUser = data.unreadCountFor?.[user.uid] ?? 0;
        count += perUser;
      });
      setTotal(count);
    });

    return () => unsub();
  }, [user]);

  return total;
}

/**
 * Per-thread unread count for the current user.
 * Used to show badge on individual thread rows.
 */
export function useThreadUnreadCounts(): Record<string, number> {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) { setCounts({}); return; }

    const q = query(
      collection(db, CHAT_COLLECTIONS.chats),
      where("participantIds", "array-contains", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const map: Record<string, number> = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        map[d.id] = data.unreadCountFor?.[user.uid] ?? 0;
      });
      setCounts(map);
    });

    return () => unsub();
  }, [user]);

  return counts;
}

/**
 * Mark a thread as read for the current user.
 * Call this when the user opens a thread.
 */
export async function markThreadRead(chatId: string, uid: string) {
  try {
    await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
      [`unreadCountFor.${uid}`]: 0,
    });
  } catch { /* non-critical */ }
}