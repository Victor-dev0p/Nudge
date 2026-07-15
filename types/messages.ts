// types/messages.ts

export interface ReplyPreview {
  id: string;
  content: string;
  senderName: string;
}

export interface ParticipantProfile {
  uid: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  role: "peer" | "practitioner";
}

export interface ChatThread {
  id: string;
  participantIds: string[];
  participants: ParticipantProfile[];
  lastMessage: string;
  lastMessageAt: number;
  unreadCount: number;
  updatedAt: number;
}

export interface ResolvedThread extends ChatThread {
  partner: ParticipantProfile;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  type: "text" | "proof_card" | "system" | "media";
  content?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  sentAt: number;
  readAt?: number;
  proofCard?: ProofCardPayload;
  // Edit
  editedAt?: number;
  originalContent?: string;
  // Delete
  deletedForEveryone?: boolean;
  deletedFor?: string[];
  // View once
  viewOnce?: boolean;
  viewedBy?: string[];
  // Reply
  replyTo?: ReplyPreview;
}

export interface ProofCardPayload {
  taskId: string;
  goalId: string;
  taskText: string;
  proofType: string;
  mediaUrl?: string;
  status: "awaiting_review" | "approved" | "rejected" | "auto_verified";
  verifiedBy?: "sponsor" | "ai";
  verifiedAt?: number;
}

export const CHAT_COLLECTIONS = {
  chats: "chats",
  messages: (chatId: string) => `chats/${chatId}/messages`,
} as const;

export function getChatId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join("_");
}

export function resolvePartner(
  thread: ChatThread,
  currentUid: string
): ParticipantProfile | null {
  return thread.participants?.find((p) => p.uid !== currentUid) ?? null;
}