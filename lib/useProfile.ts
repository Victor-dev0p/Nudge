// lib/useProfile.ts

import { useEffect, useState } from "react";
import {
  doc, collection, onSnapshot, query, where,
  orderBy, addDoc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { db, storage, auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import type { NudgeUser, NudgeGoal } from "@/types/user";
import { COLLECTIONS } from "@/types/user";
import type { JournalEntry } from "@/types/profile";
import { JOURNAL_COLLECTION } from "@/types/profile";

export interface ProfileData {
  user: NudgeUser | null;
  goals: NudgeGoal[];
  journal: JournalEntry[];
  loading: boolean;
  error: string | null;
}

export function useProfile(uid: string | null): ProfileData {
  const { user: authUser } = useAuth();
  const isOwnProfile = !!authUser && authUser.uid === uid;

  const [data, setData] = useState<ProfileData>({
    user: null, goals: [], journal: [], loading: true, error: null,
  });

  useEffect(() => {
    if (!uid) { setData((p) => ({ ...p, loading: false, error: "No user ID." })); return; }

    const userUnsub = onSnapshot(
      doc(db, COLLECTIONS.users, uid),
      (snap) => {
        if (!snap.exists()) {
          setData((p) => ({ ...p, loading: false, error: "User not found." }));
          return;
        }
        setData((p) => ({ ...p, user: snap.data() as NudgeUser, loading: false }));
      },
      () => setData((p) => ({ ...p, loading: false, error: "Failed to load profile." }))
    );

    // Goals — owner sees all, everyone else sees only isPublic == true
    const goalsQuery = isOwnProfile
      ? collection(db, COLLECTIONS.goals(uid))
      : query(collection(db, COLLECTIONS.goals(uid)), where("isPublic", "==", true));

    const goalsUnsub = onSnapshot(goalsQuery, (snap) => {
      const goals = snap.docs.map((d) => d.data() as NudgeGoal);
      setData((p) => ({ ...p, goals }));
    });

    // Journal — same pattern. Sorting done client-side to avoid needing
    // a composite index for where + orderBy on different fields.
    const journalQuery = isOwnProfile
      ? collection(db, JOURNAL_COLLECTION(uid))
      : query(collection(db, JOURNAL_COLLECTION(uid)), where("isPublic", "==", true));

    const journalUnsub = onSnapshot(journalQuery, (snap) => {
      const journal = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as JournalEntry))
        .sort((a, b) => b.createdAt - a.createdAt);
      setData((p) => ({ ...p, journal }));
    });

    return () => { userUnsub(); goalsUnsub(); journalUnsub(); };
  }, [uid, isOwnProfile]);

  return data;
}

// ─── Update own profile (display name + bio) ──────────────────────────────────
export async function updateProfileInfo(uid: string, displayName: string, bio: string) {
  await updateDoc(doc(db, COLLECTIONS.users, uid), { displayName, bio });
  if (auth.currentUser) await updateProfile(auth.currentUser, { displayName });
}

// ─── Upload avatar to Firebase Storage ───────────────────────────────────────
export async function uploadAvatar(uid: string, file: File, onProgress?: (pct: number) => void): Promise<string> {
  const storageRef = ref(storage, `avatars/${uid}/avatar_${Date.now()}`);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        await updateDoc(doc(db, COLLECTIONS.users, uid), { avatarUrl: url });
        if (auth.currentUser) await updateProfile(auth.currentUser, { photoURL: url });
        resolve(url);
      }
    );
  });
}

// ─── Journal CRUD ─────────────────────────────────────────────────────────────
export async function createJournalEntry(uid: string, entry: Omit<JournalEntry, "id" | "uid" | "createdAt" | "updatedAt">) {
  const now = Date.now();
  await addDoc(collection(db, JOURNAL_COLLECTION(uid)), { ...entry, uid, createdAt: now, updatedAt: now });
}

export async function updateJournalEntry(uid: string, entryId: string, updates: Partial<Pick<JournalEntry, "title" | "content" | "isPublic">>) {
  await updateDoc(doc(db, JOURNAL_COLLECTION(uid), entryId), { ...updates, updatedAt: Date.now() });
}

export async function deleteJournalEntry(uid: string, entryId: string) {
  await deleteDoc(doc(db, JOURNAL_COLLECTION(uid), entryId));
}