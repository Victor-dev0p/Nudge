// lib/usePushNotifications.ts

"use client";

import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/types/user";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications(uid: string | null) {
  useEffect(() => {
    if (!uid || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (!VAPID_PUBLIC_KEY) return;

    async function subscribe() {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const registration = await navigator.serviceWorker.ready;

        // Check for existing subscription first
        const existing = await registration.pushManager.getSubscription();
        const subscription = existing ?? await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
        });

        // Save subscription to Firestore on the user doc
        await updateDoc(doc(db, COLLECTIONS.users, uid!), {
          pushSubscription: JSON.parse(JSON.stringify(subscription)),
          pushEnabled: true,
        });
      } catch (err) {
        // Silently fail — push notifications are non-critical
        console.warn("[Nudge Push] Subscription failed:", err);
      }
    }

    subscribe();
  }, [uid]);
}