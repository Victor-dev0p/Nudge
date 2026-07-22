// lib/useMessages.ts

import { useEffect, useState } from "react";
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, doc, setDoc, getDoc, deleteField, arrayUnion, increment,
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

// ─── Send text — increments unread for RECIPIENT only ────────────────────────
export async function sendMessage(
  chatId: string,
  senderId: string,
  content: string,
  replyTo?: { id: string; content: string; senderName: string }
) {
  if (!content.trim()) return;

  // Get the chat to find the recipient UID
  const chatSnap = await getDoc(doc(db, CHAT_COLLECTIONS.chats, chatId));
  const participantIds: string[] = chatSnap.data()?.participantIds ?? [];
  const recipientUid = participantIds.find((id) => id !== senderId);

  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId, type: "text",
    content: content.trim(),
    sentAt: Date.now(),
    ...(replyTo ? { replyTo } : {}),
  });

  // Update thread: last message + increment unread for recipient
  // unreadCountFor is a map: { [uid]: count } so each user has their own unread count
  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: content.trim(),
    lastMessageAt: Date.now(),
    updatedAt: Date.now(),
    ...(recipientUid ? { [`unreadCountFor.${recipientUid}`]: increment(1) } : {}),
  });

  // Send push notification to recipient
  if (recipientUid) {
    try {
      await fetch("/api/notifications/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientUid,
          title: "New message on Nudge",
          body: content.trim().slice(0, 80),
          url: "/messages",
        }),
      });
    } catch {
      // Non-critical — push failing shouldn't block message send
    }
  }
}

// ─── Send view-once ───────────────────────────────────────────────────────────
export async function sendViewOnceMessage(
  chatId: string,
  senderId: string,
  content: string,
  replyTo?: { id: string; content: string; senderName: string }
) {
  if (!content.trim()) return;

  const chatSnap = await getDoc(doc(db, CHAT_COLLECTIONS.chats, chatId));
  const participantIds: string[] = chatSnap.data()?.participantIds ?? [];
  const recipientUid = participantIds.find((id) => id !== senderId);

  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId, type: "text",
    content: content.trim(),
    sentAt: Date.now(),
    viewOnce: true, viewedBy: [],
    ...(replyTo ? { replyTo } : {}),
  });

  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: "View once message",
    lastMessageAt: Date.now(),
    updatedAt: Date.now(),
    ...(recipientUid ? { [`unreadCountFor.${recipientUid}`]: increment(1) } : {}),
  });
}

// ─── Send media ───────────────────────────────────────────────────────────────
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

export async function sendMediaMessage(
  chatId: string, senderId: string, mediaUrl: string,
  mediaType: "image" | "video", viewOnce = false,
  replyTo?: { id: string; content: string; senderName: string }
) {
  const chatSnap = await getDoc(doc(db, CHAT_COLLECTIONS.chats, chatId));
  const participantIds: string[] = chatSnap.data()?.participantIds ?? [];
  const recipientUid = participantIds.find((id) => id !== senderId);

  await addDoc(collection(db, CHAT_COLLECTIONS.messages(chatId)), {
    senderId, type: "media", mediaUrl, mediaType,
    sentAt: Date.now(), viewOnce, viewedBy: [],
    ...(replyTo ? { replyTo } : {}),
  });

  await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
    lastMessage: mediaType === "image" ? "📷 Photo" : "🎥 Video",
    lastMessageAt: Date.now(), updatedAt: Date.now(),
    ...(recipientUid ? { [`unreadCountFor.${recipientUid}`]: increment(1) } : {}),
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

// ─── Edit / Delete / View once ────────────────────────────────────────────────
export async function editMessage(
  chatId: string, messageId: string, newContent: string, originalContent: string
) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    content: newContent.trim(), editedAt: Date.now(), originalContent,
  });
}

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

export async function markViewed(chatId: string, messageId: string, uid: string) {
  await updateDoc(doc(db, CHAT_COLLECTIONS.messages(chatId), messageId), {
    viewedBy: arrayUnion(uid),
  });
}

// ─── Mark thread as read — resets THIS user's unread count ───────────────────
export async function markThreadRead(chatId: string, uid: string) {
  try {
    await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
      [`unreadCountFor.${uid}`]: 0,
    });
  } catch { /* non-critical */ }
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
export async function setTyping(chatId: string, uid: string, isTyping: boolean) {
  try {
    await updateDoc(doc(db, CHAT_COLLECTIONS.chats, chatId), {
      [`typing.${uid}`]: isTyping ? true : deleteField(),
    });
  } catch { /* non-critical */ }
}

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

// No-op — typing map is now read directly from thread data in the component
export function useThreadsTyping(
  _threads: Array<{ id: string; partner: { uid: string } | null }>,
  _currentUid: string
): Record<string, boolean> {
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
    updatedAt: Date.now(),
    unreadCount: 0,
    unreadCountFor: {},
  });

  return chatId;
}