// types/invites.ts

export type InviteStatus = "pending" | "accepted" | "expired";

export interface PartnerInvite {
  token: string;               // unique random token — used in the invite URL
  inviterUid: string;          // UID of the user who sent the invite
  inviterName: string;
  inviterUsername: string;
  goalId: string;              // the goal this partnership is for
  goalText: string;
  partnerEmail: string;        // email the invite was sent to
  partnerUid?: string;         // filled in when partner accepts
  status: InviteStatus;
  createdAt: number;
  acceptedAt?: number;
  expiresAt: number;           // 7 days from creation
}

export const INVITES_COLLECTION = "invites" as const;