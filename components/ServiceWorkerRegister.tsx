// components/ServiceWorkerRegister.tsx

"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("[Nudge SW] Registered:", reg.scope))
        .catch((err) => console.error("[Nudge SW] Registration failed:", err));
    }
  }, []);

  return null;
}