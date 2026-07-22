// components/shell/AppShell.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { useAuth } from "@/lib/auth";
import { useUnreadMessages } from "@/lib/useUnreadMessages";
import { usePushNotifications } from "@/lib/usePushNotifications";

const DESKTOP_BREAKPOINT = 768;
const SIDEBAR_WIDTH = "240px";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const { user } = useAuth();
  const unreadCount = useUnreadMessages();

  // Register push notifications for the current user
  usePushNotifications(user?.uid ?? null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      {isDesktop && <Sidebar unreadCount={unreadCount} />}

      <main
        style={{
          flex: 1,
          marginLeft: isDesktop ? SIDEBAR_WIDTH : "0",
          paddingBottom: isDesktop ? "0" : "calc(4rem + env(safe-area-inset-bottom))",
          minWidth: 0,
          minHeight: "100dvh",
        }}
      >
        {children}
      </main>

      {!isDesktop && <BottomNav unreadCount={unreadCount} />}

      {/* PWA install prompt — shows on Android automatically, iOS with instructions */}
      <PWAInstallPrompt />
    </div>
  );
}