// lib/useProfile.ts

import { useEffect, useState } from "react";
import {
  doc, collection, onSnapshot, query,
  orderBy, addDoc, updateDoc, deleteDoc, serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { db, storage, auth } from "@/lib/firebase";
import type { NudgeUser, NudgeGoal } from "@/types/user";
import { COLLECTIONS } from "@/types/user";
import type { JournalEntry } from "@/types/profile";
import { JOURNAL_COLLECTION } from "@/types/profile";

// ─── Full profile data shape ──────────────────────────────────────────────────
export interface ProfileData {
  user: NudgeUser | null;
  goals: NudgeGoal[];
  journal: JournalEntry[];
  loading: boolean;
  error: string | null;
}

// ─── Load any user's profile ──────────────────────────────────────────────────
export function useProfile(uid: string | null): ProfileData {
  const [data, setData] = useState<ProfileData>({
    user: null, goals: [], journal: [], loading: true, error: null,
  });

  useEffect(() => {
    if (!uid) { setData((p) => ({ ...p, loading: false, error: "No user ID." })); return; }

    // User doc
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

    // Goals
    const goalsUnsub = onSnapshot(
      collection(db, COLLECTIONS.goals(uid)),
      (snap) => {
        const goals = snap.docs.map((d) => d.data() as NudgeGoal);
        setData((p) => ({ ...p, goals }));
      }
    );

    // Journal — public entries visible to all; private only to owner
    const journalUnsub = onSnapshot(
      query(collection(db, JOURNAL_COLLECTION(uid)), orderBy("createdAt", "desc")),
      (snap) => {
        const journal = snap.docs.map((d) => ({ id: d.id, ...d.data() } as JournalEntry));
        setData((p) => ({ ...p, journal }));
      }
    );

    return () => { userUnsub(); goalsUnsub(); journalUnsub(); };
  }, [uid]);

  return data;
}

// ─── Update own profile (display name + bio) ──────────────────────────────────
export async function updateProfileInfo(
  uid: string,
  displayName: string,
  bio: string
) {
  await updateDoc(doc(db, COLLECTIONS.users, uid), { displayName, bio });
  // Keep Firebase Auth displayName in sync
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName });
  }
}

// ─── Upload avatar to Firebase Storage ───────────────────────────────────────
export async function uploadAvatar(
  uid: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, `avatars/${uid}/avatar_${Date.now()}`);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        // Write URL to Firestore user doc
        await updateDoc(doc(db, COLLECTIONS.users, uid), { avatarUrl: url });
        // Keep Firebase Auth photoURL in sync
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: url });
        }
        resolve(url);
      }
    );
  });
}

// ─── Journal CRUD ─────────────────────────────────────────────────────────────
export async function createJournalEntry(
  uid: string,
  entry: Omit<JournalEntry, "id" | "uid" | "createdAt" | "updatedAt">
) {
  const now = Date.now();
  await addDoc(collection(db, JOURNAL_COLLECTION(uid)), {
    ...entry,
    uid,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateJournalEntry(
  uid: string,
  entryId: string,
  updates: Partial<Pick<JournalEntry, "title" | "content" | "isPublic">>
) {
  await updateDoc(
    doc(db, JOURNAL_COLLECTION(uid), entryId),
    { ...updates, updatedAt: Date.now() }
  );
}

export async function deleteJournalEntry(uid: string, entryId: string) {
  await deleteDoc(doc(db, JOURNAL_COLLECTION(uid), entryId));
}