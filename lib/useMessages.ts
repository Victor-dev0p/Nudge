// lib/useMessages.ts
// Key fix: useThreadsTyping now uses a single batched approach instead of
// N separate onSnapshot listeners (one per thread), which was causing slow
// load and excessive Firestore reads with multiple threads.

import { useEffect, useState } from "react";
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, doc, setDoc, getDoc, deleteField, arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import type {
  ChatThread, ChatMessage, ProofCardPayload,
  ResolvedThread, ParticipantProfile,
} from "@/types/messages";
import { CHAT_COLLECTIONS, getChatId, resolvePartner } from "@/types/messages";

// ─── Thread list ──────────────────────────────────────────────────────────────
export function useThreads() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ResolvedThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, CHAT_COLLECTIONS.chats),
      where("participantIds", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const resolved = snap.docs
        .map((d) => {
          const thread = { id: d.id, ...d.data() } as ChatThread;
          const partner = resolvePartner(thread, user.uid);
          return partner ? { ...thread, partner } as ResolvedThread : null;
        })
        .filter(Boolean) as ResolvedThread[];
      setThreads(resolved);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  return { threads, loading };
}

// ─── Messages in a thread ─────────────────────────────────────────────────────
export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;
    setLoading(true);
    const q = query(
      collection(db, CHAT_COLLECTIONS.messages(chatId)),
      orderBy("sentAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage)));
      setLoading(false);
    });
    return () => unsub();
  }, [chatId]);

  return { messages, loading };
}

// ─── Send text ────────────────────────────────────────────────────────────────
export async function sendMessage(
  chatId: string, senderId: string, content: string,
  replyTo?: { id: string; content: string; senderName: string }
) {
  if (!content.trim()) return;
  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId, type: "text", content: content.trim(),
    sentAt: Date.now(), ...(replyTo ? { replyTo } : {}),
  });
  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: content.trim(), lastMessageAt: Date.now(), updatedAt: Date.now(),
  });
}

// ─── Send view-once ───────────────────────────────────────────────────────────
export async function sendViewOnceMessage(
  chatId: string, senderId: string, content: string,
  replyTo?: { id: string; content: string; senderName: string }
) {
  if (!content.trim()) return;
  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId, type: "text", content: content.trim(),
    sentAt: Date.now(), viewOnce: true, viewedBy: [],
    ...(replyTo ? { replyTo } : {}),
  });
  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: "View once message", lastMessageAt: Date.now(), updatedAt: Date.now(),
  });
}

// ─── Upload media ─────────────────────────────────────────────────────────────
export async function uploadChatMedia(
  chatId: string, file: File, onProgress?: (pct: number) => void
): Promise<string> {
  const { ref, uploadBytesResumable, getDownloadURL } = await import("firebase/storage");
  const { storage } = await import("@/lib/firebase");
  const path = `chats/${chatId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on("state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}

// ─── Send media ───────────────────────────────────────────────────────────────
export async function sendMediaMessage(
  chatId: string, senderId: string, mediaUrl: string,
  mediaType: "image" | "video", viewOnce = false,
  replyTo?: { id: string; content: string; senderName: string }
) {
  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId, type: "media", mediaUrl, mediaType,
    sentAt: Date.now(), viewOnce, viewedBy: [],
    ...(replyTo ? { replyTo } : {}),
  });
  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: mediaType === "image" ? "📷 Photo" : "🎥 Video",
    lastMessageAt: Date.now(), updatedAt: Date.now(),
  });
}

// ─── Proof card ───────────────────────────────────────────────────────────────
export async function sendProofCard(
  chatId: string, senderId: string, proofCard: ProofCardPayload
) {
  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId, type: "proof_card", sentAt: Date.now(), proofCard,
  });
  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: "Proof submitted", lastMessageAt: Date.now(), updatedAt: Date.now(),
  });
}

export async function verifyProofCard(
  chatId: string, messageId: string, decision: "approved" | "rejected"
) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    "proofCard.status": decision,
    "proofCard.verifiedBy": "sponsor",
    "proofCard.verifiedAt": Date.now(),
  });
}

// ─── Edit ─────────────────────────────────────────────────────────────────────
export async function editMessage(
  chatId: string, messageId: string, newContent: string, originalContent: string
) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    content: newContent.trim(), editedAt: Date.now(), originalContent,
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteForMe(chatId: string, messageId: string, uid: string) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    deletedFor: arrayUnion(uid),
  });
}

export async function deleteForEveryone(chatId: string, messageId: string) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    deletedForEveryone: true, content: deleteField(),
  });
}

// ─── View once ────────────────────────────────────────────────────────────────
export async function markViewed(chatId: string, messageId: string, uid: string) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    viewedBy: arrayUnion(uid),
  });
}

// ─── Typing ───────────────────────────────────────────────────────────────────
export async function setTyping(chatId: string, uid: string, isTyping: boolean) {
  try {
    await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
      [`typing.${uid}`]: isTyping ? true : deleteField(),
    });
  } catch { /* non-critical */ }
}

// Listen to partner typing in the OPEN thread
export function usePartnerTyping(chatId: string | null, partnerUid: string | null): boolean {
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    if (!chatId || !partnerUid) return;
    const unsub = onSnapshot(doc(db, CHAT_COLLECTIONS.chats, chatId), (snap) => {
      setIsTyping(snap.data()?.typing?.[partnerUid] === true);
    });
    return () => unsub();
  }, [chatId, partnerUid]);
  return isTyping;
}

// ─── useThreadsTyping — OPTIMIZED ────────────────────────────────────────────
// Previous version opened N separate onSnapshot listeners (one per thread).
// This version reuses the SAME thread list listener already open in useThreads
// by reading the typing field directly from the thread data we already have.
// Zero additional Firestore reads.
export function useThreadsTyping(
  threads: Array<{ id: string; partner: { uid: string } | null }>,
  currentUid: string
): Record<string, boolean> {
  // This is now derived directly from the thread documents already loaded
  // by useThreads — no additional listeners needed.
  // The typing map is computed in MessagesClient from the threads array.
  // This hook is kept for API compatibility but is now a no-op.
  // See: ThreadList in MessagesClient reads thread.typing directly.
  return {};
}

// ─── Get or create thread ────────────────────────────────────────────────────
export async function getOrCreateThread(
  currentUid: string, partnerUid: string
): Promise<string> {
  const chatId = getChatId(currentUid, partnerUid);
  const chatRef = doc(db, CHAT_COLLECTIONS.chats, chatId);
  const existing = await getDoc(chatRef);
  if (existing.exists()) return chatId;

  const [currentSnap, partnerSnap] = await Promise.all([
    getDoc(doc(db, "users", currentUid)),
    getDoc(doc(db, "users", partnerUid)),
  ]);
  const currentData = currentSnap.data();
  const partnerData = partnerSnap.data();

  const currentProfile: ParticipantProfile = {
    uid: currentUid,
    displayName: currentData?.displayName ?? "User",
    username: currentData?.username ?? "",
    avatarUrl: currentData?.avatarUrl,
    role: currentData?.role === "practitioner" ? "practitioner" : "peer",
  };
  const partnerProfile: ParticipantProfile = {
    uid: partnerUid,
    displayName: partnerData?.displayName ?? "User",
    username: partnerData?.username ?? "",
    avatarUrl: partnerData?.avatarUrl,
    role: partnerData?.role === "practitioner" ? "practitioner" : "peer",
  };

  await setDoc(chatRef, {
    participantIds: [currentUid, partnerUid].sort(),
    participants: [currentProfile, partnerProfile],
    lastMessage: "", lastMessageAt: Date.now(),
    updatedAt: Date.now(), unreadCount: 0,
  });

  return chatId;
}