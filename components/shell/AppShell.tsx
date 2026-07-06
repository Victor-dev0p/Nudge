// components/shell/AppShell.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

const DESKTOP_BREAKPOINT = 768;
const SIDEBAR_WIDTH = "240px";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      {/* Desktop sidebar */}
      {isDesktop && <Sidebar />}

      {/* Main content area — offset by sidebar width on desktop */}
      <main
        style={{
          flex: 1,
          marginLeft: isDesktop ? SIDEBAR_WIDTH : "0",
          // Bottom padding on mobile to clear the bottom nav
          paddingBottom: isDesktop ? "0" : "calc(4rem + env(safe-area-inset-bottom))",
          minWidth: 0,
          minHeight: "100dvh",
        }}
      >
        {children}
      </main>

      {/* Mobile bottom nav */}
      {!isDesktop && <BottomNav />}
    </div>
  );
}