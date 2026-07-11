// lib/invites.ts

import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PartnerInvite } from "@/types/invites";
import { INVITES_COLLECTION } from "@/types/invites";

// Generate a random invite token (client-safe, non-crypto)
export function generateInviteToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 32 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// Fetch an invite by token (used on the accept page)
export async function getInviteByToken(token: string): Promise<PartnerInvite | null> {
  const snap = await getDoc(doc(db, INVITES_COLLECTION, token));
  if (!snap.exists()) return null;
  return snap.data() as PartnerInvite;
}

// Check if a pending invite already exists for this email + goal
export async function getPendingInvite(
  inviterUid: string,
  partnerEmail: string
): Promise<PartnerInvite | null> {
  const q = query(
    collection(db, INVITES_COLLECTION),
    where("inviterUid", "==", inviterUid),
    where("partnerEmail", "==", partnerEmail),
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as PartnerInvite;
}