// app/api/invites/send/route.ts

import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { generateInviteToken } from "@/lib/invites";
import { sendPartnerInviteEmail } from "@/lib/resend";
import type { PartnerInvite } from "@/types/invites";
import { INVITES_COLLECTION } from "@/types/invites";

// ─── Firebase Admin init ──────────────────────────────────────────────────────
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const {
      inviterUid,
      inviterName,
      inviterUsername,
      goalId,
      goalText,
      partnerEmail,
    } = await req.json();

    if (!inviterUid || !partnerEmail || !goalId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if partner already has a Nudge account
    const usersSnap = await db
      .collection("users")
      .where("email", "==", partnerEmail.toLowerCase())
      .limit(1)
      .get();

    const partnerExists = !usersSnap.empty;
    const partnerDoc = partnerExists ? usersSnap.docs[0] : null;

    // Generate invite token and write to Firestore
    const token = generateInviteToken();
    const now = Date.now();

    const invite: PartnerInvite = {
      token,
      inviterUid,
      inviterName,
      inviterUsername,
      goalId,
      goalText,
      partnerEmail: partnerEmail.toLowerCase(),
      status: "pending",
      createdAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    await db.collection(INVITES_COLLECTION).doc(token).set(invite);

    // If partner is already on Nudge → write in-app notification
    if (partnerDoc) {
      await db
        .collection("notifications")
        .add({
          uid: partnerDoc.id,
          type: "partner_invite",
          title: `${inviterName} wants you as their accountability partner`,
          body: `For their goal: "${goalText}"`,
          data: { token, inviterUid, goalId },
          read: false,
          createdAt: now,
        });
    }

    // Send email via Resend
    const emailResult = await sendPartnerInviteEmail({
      to: partnerEmail,
      inviterName,
      inviterUsername,
      goalText,
      token,
    });

    if (!emailResult.success) {
      console.error("[Nudge] Email send failed:", emailResult.error);
      // Don't fail the whole request — invite is saved, email just didn't send
    }

    return NextResponse.json({
      success: true,
      token,
      partnerAlreadyOnNudge: partnerExists,
      emailSent: emailResult.success,
    });
  } catch (err) {
    console.error("[Nudge] Invite send error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}