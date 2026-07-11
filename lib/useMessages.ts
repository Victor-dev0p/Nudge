// lib/useMessages.ts

import { useEffect, useState, useCallback } from "react";
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

// ─── Thread list — resolves partner per current user ─────────────────────────
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
      const resolved = snap.docs.map((d) => {
        const thread = { id: d.id, ...d.data() } as ChatThread;
        const partner = resolvePartner(thread, user.uid);
        return { ...thread, partner: partner! } as ResolvedThread;
      }).filter((t) => !!t.partner); // safety: skip if partner can't be resolved

      setThreads(resolved);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return { threads, loading };
}

// ─── Messages in a single thread ─────────────────────────────────────────────
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

// ─── Send text message ────────────────────────────────────────────────────────
export async function sendMessage(
  chatId: string,
  senderId: string,
  content: string
) {
  if (!content.trim()) return;

  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId,
    type: "text",
    content: content.trim(),
    sentAt: Date.now(),
  });

  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: content.trim(),
    lastMessageAt: Date.now(),
    updatedAt: Date.now(),
  });
}

// ─── Send proof card ──────────────────────────────────────────────────────────
export async function sendProofCard(
  chatId: string,
  senderId: string,
  proofCard: ProofCardPayload
) {
  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId, type: "proof_card", sentAt: Date.now(), proofCard,
  });
  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: "Proof submitted",
    lastMessageAt: Date.now(),
    updatedAt: Date.now(),
  });
}

// ─── Approve or reject proof card ────────────────────────────────────────────
export async function verifyProofCard(
  chatId: string,
  messageId: string,
  decision: "approved" | "rejected"
) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    "proofCard.status": decision,
    "proofCard.verifiedBy": "sponsor",
    "proofCard.verifiedAt": Date.now(),
  });
}

// ─── Get or create a thread — stores both participant profiles ────────────────
export async function getOrCreateThread(
  currentUid: string,
  partnerUid: string
): Promise<string> {
  const chatId = getChatId(currentUid, partnerUid);
  const chatRef = doc(db, CHAT_COLLECTIONS.chats, chatId);

  const existing = await getDoc(chatRef);
  if (existing.exists()) return chatId;

  // Fetch both user profiles from Firestore
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
    lastMessage: "",
    lastMessageAt: Date.now(),
    updatedAt: Date.now(),
    unreadCount: 0,
  });

  return chatId;
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
// Writes typing state to the chat doc under the user's UID key.
// Stored as: { typing: { "{uid}": true } }

export async function setTyping(chatId: string, uid: string, isTyping: boolean) {
  try {
    await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
      [`typing.${uid}`]: isTyping ? true : deleteField(),
    });
  } catch {
    // Non-critical — silently ignore if this fails
  }
}

// Hook: returns true if the partner is currently typing
export function usePartnerTyping(chatId: string | null, partnerUid: string | null): boolean {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!chatId || !partnerUid) return;

    const unsub = onSnapshot(doc(db, CHAT_COLLECTIONS.chats, chatId), (snap) => {
      const data = snap.data();
      setIsTyping(data?.typing?.[partnerUid] === true);
    });

    return () => unsub();
  }, [chatId, partnerUid]);

  return isTyping;
}

// ─── Edit message (within 15 minutes of sending) ──────────────────────────────
export async function editMessage(
  chatId: string,
  messageId: string,
  newContent: string,
  originalContent: string
) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    content: newContent.trim(),
    editedAt: Date.now(),
    originalContent,
  });
}

// ─── Delete for me (soft delete — hidden for this user only) ─────────────────
export async function deleteForMe(chatId: string, messageId: string, uid: string) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    deletedFor: arrayUnion(uid),
  });
}

// ─── Delete for everyone ──────────────────────────────────────────────────────
export async function deleteForEveryone(chatId: string, messageId: string) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    deletedForEveryone: true,
    content: undefined,
  });
}

// ─── Mark view-once message as viewed ────────────────────────────────────────
export async function markViewed(chatId: string, messageId: string, uid: string) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    viewedBy: arrayUnion(uid),
  });
}

// ─── Send view-once message ───────────────────────────────────────────────────
export async function sendViewOnceMessage(
  chatId: string,
  senderId: string,
  content: string
) {
  if (!content.trim()) return;
  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId, type: "text",
    content: content.trim(),
    sentAt: Date.now(),
    viewOnce: true,
    viewedBy: [],
  });
  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: "View once message",
    lastMessageAt: Date.now(),
    updatedAt: Date.now(),
  });
}

// ─── useThreadTyping: returns map of chatId → true for threads where partner is typing
// Used in thread list to show typing indicator without opening the thread
export function useThreadsTyping(
  threads: Array<{ id: string; partner: { uid: string } | null }>,
  currentUid: string
): Record<string, boolean> {
  const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (threads.length === 0) return;

    const unsubs = threads.map((thread) => {
      if (!thread.partner) return () => {};
      const partnerUid = thread.partner.uid;

      return onSnapshot(doc(db, CHAT_COLLECTIONS.chats, thread.id), (snap) => {
        const data = snap.data();
        const isTyping = data?.typing?.[partnerUid] === true;
        setTypingMap((prev) => ({ ...prev, [thread.id]: isTyping }));
      });
    });

    return () => unsubs.forEach((u) => u());
  }, [threads, currentUid]);

  return typingMap;
}