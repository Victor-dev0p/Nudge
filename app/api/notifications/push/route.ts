// app/api/notifications/push/route.ts

import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import webpush from "web-push";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_CONTACT_EMAIL ?? "admin@nudge.app"}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const { recipientUid, title, body, url } = await req.json();

    if (!recipientUid || !title || !body) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    // Get recipient's push subscription from Firestore
    const userSnap = await db.collection("users").doc(recipientUid).get();
    const userData = userSnap.data();

    if (!userData?.pushSubscription || !userData?.pushEnabled) {
      return NextResponse.json({ skipped: true, reason: "No subscription." });
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url ?? "/dashboard",
    });

    await webpush.sendNotification(userData.pushSubscription, payload);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Nudge Push] Send failed:", err);
    return NextResponse.json({ error: "Push failed." }, { status: 500 });
  }
}