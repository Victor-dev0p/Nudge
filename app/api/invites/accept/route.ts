// app/api/invites/accept/route.ts

import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { PartnerInvite } from "@/types/invites";
import { INVITES_COLLECTION } from "@/types/invites";
import { getChatId } from "@/types/messages";
import { CHAT_COLLECTIONS } from "@/types/messages";
import { colors } from "@/lib/theme";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
})}

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const { token, accepterUid } = await req.json();

    if (!token || !accepterUid) {
      return NextResponse.json({ error: "Missing token or user." }, { status: 400 });
    }

    // Fetch invite
    const inviteSnap = await db.collection(INVITES_COLLECTION).doc(token).get();
    if (!inviteSnap.exists) {
      return NextResponse.json({ error: "Invite not found." }, { status: 404 });
    }

    const invite = inviteSnap.data() as PartnerInvite;

    if (invite.status !== "pending") {
      return NextResponse.json({ error: "Invite already used or expired." }, { status: 400 });
    }

    if (Date.now() > invite.expiresAt) {
      await inviteSnap.ref.update({ status: "expired" });
      return NextResponse.json({ error: "Invite has expired." }, { status: 400 });
    }

    if (accepterUid === invite.inviterUid) {
      return NextResponse.json({ error: "You can't accept your own invite." }, { status: 400 });
    }

    // Fetch both user docs
    const [inviterSnap, accepterSnap] = await Promise.all([
      db.collection("users").doc(invite.inviterUid).get(),
      db.collection("users").doc(accepterUid).get(),
    ]);

    if (!inviterSnap.exists || !accepterSnap.exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const inviter = inviterSnap.data()!;
    const accepter = accepterSnap.data()!;

    const now = Date.now();
    const chatId = getChatId(invite.inviterUid, accepterUid);

    // Run everything in a batch
    const batch = db.batch();

    // 1. Mark invite as accepted
    batch.update(inviteSnap.ref, {
      status: "accepted",
      partnerUid: accepterUid,
      acceptedAt: now,
    });

    // 2. Update the inviter's goal with the partner UID
    batch.update(
      db.collection("users").doc(invite.inviterUid)
        .collection("goals").doc(invite.goalId),
      { partnerId: accepterUid }
    );

    // 3. Create chat thread between the two users
    const chatRef = db.collection(CHAT_COLLECTIONS.chats).doc(chatId);
    batch.set(chatRef, {
      participantIds: [invite.inviterUid, accepterUid],
      // From inviter's perspective
      partnerName: accepter.displayName,
      partnerUsername: accepter.username,
      partnerInitials: accepter.displayName
        ?.split(" ")
        .map((n: string) => n[0])
        .join("") ?? "?",
      partnerTierColor: colors.lime.DEFAULT,
      partnerRole: accepter.role === "practitioner" ? "practitioner" : "peer",
      lastMessage: "",
      lastMessageAt: now,
      updatedAt: now,
      unreadCount: 0,
    }, { merge: true });

    // 4. Send a system welcome message into the thread
    const msgRef = db
      .collection(CHAT_COLLECTIONS.chats)
      .doc(chatId)
      .collection("messages")
      .doc();

    batch.set(msgRef, {
      senderId: "system",
      type: "system",
      content: `${accepter.displayName} (@${accepter.username}) has accepted the accountability partnership for "${invite.goalText}". The bow is drawn.`,
      sentAt: now,
    });

    // 5. Notify inviter that their partner accepted
    const notifRef = db.collection("notifications").doc();
    batch.set(notifRef, {
      uid: invite.inviterUid,
      type: "partner_accepted",
      title: `${accepter.displayName} accepted your partnership`,
      body: `You now have an accountability partner for: "${invite.goalText}"`,
      data: { chatId, partnerUid: accepterUid },
      read: false,
      createdAt: now,
    });

    // 6. Update sponsee/sponsor counts
    batch.update(db.collection("users").doc(invite.inviterUid), {
      sponseeCount: FieldValue.increment(1),
    });
    batch.update(db.collection("users").doc(accepterUid), {
      sponsorCount: FieldValue.increment(1),
    });

    await batch.commit();

    return NextResponse.json({ success: true, chatId });
  } catch (err) {
    console.error("[Nudge] Invite accept error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}