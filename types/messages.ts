// types/messages.ts

export interface ParticipantProfile {
  uid: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  role: "peer" | "practitioner";
}

export interface ChatThread {
  id: string;                        // sorted uid pair: "uid1_uid2"
  participantIds: string[];          // [uid1, uid2]
  participants: ParticipantProfile[]; // full profile of BOTH users
  lastMessage: string;
  lastMessageAt: number;
  unreadCount: number;
  updatedAt: number;
}

// Derived at runtime — never stored in Firestore
export interface ResolvedThread extends ChatThread {
  partner: ParticipantProfile;       // the OTHER user, not me
}

export interface ChatMessage {
  id: string;
  senderId: string;
  type: "text" | "proof_card" | "system";
  content?: string;
  sentAt: number;
  readAt?: number;
  proofCard?: ProofCardPayload;
  // Edit
  editedAt?: number;
  originalContent?: string;
  // Delete
  deletedForEveryone?: boolean;
  deletedFor?: string[];           // UIDs who soft-deleted this message
  // View once
  viewOnce?: boolean;
  viewedBy?: string[];             // UIDs who have viewed it
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

// Always produces the same ID regardless of which user initiates
export function getChatId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join("_");
}

// Resolve which participant is "the partner" from the current user's perspective
export function resolvePartner(
  thread: ChatThread,
  currentUid: string
): ParticipantProfile | null {
  return thread.participants?.find((p) => p.uid !== currentUid) ?? null;
}