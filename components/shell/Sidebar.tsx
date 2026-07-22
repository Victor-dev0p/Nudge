// components/shell/Sidebar.tsx

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { colors, motion as motionTokens } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { NAV_ITEMS } from "./ShellNav.config";
import { NavIcon, NotificationsIcon } from "./ShellIcons";

interface SidebarProps {
  unreadCount: number;
}

export function Sidebar({ unreadCount }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <aside style={{
      position: "fixed",
      top: 0, left: 0, bottom: 0,
      width: "240px",
      background: colors.obsidian.surface,
      borderRight: `1px solid ${colors.obsidian.border}`,
      display: "flex",
      flexDirection: "column",
      zIndex: 50,
    }}>
      {/* Wordmark + notification bell */}
      <div style={{
        padding: "1.5rem 1.5rem 1rem",
        borderBottom: `1px solid ${colors.obsidian.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span className="nudge-wordmark" style={{ fontSize: "0.9rem" }}>NUDGE</span>
        <Link href="/notifications" style={{ position: "relative", color: colors.white.ghost, display: "flex", alignItems: "center" }}>
          <NotificationsIcon size={18} color="currentColor" />
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          // Use real unread count for messages badge
          const badge = item.key === "messages" && unreadCount > 0 ? unreadCount : null;

          return (
            <Link
              key={item.key}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 0.875rem", borderRadius: "10px",
                background: isActive ? `${colors.lime.DEFAULT}12` : "transparent",
                color: isActive ? colors.lime.DEFAULT : colors.white.muted,
                fontWeight: isActive ? 600 : 400, fontSize: "0.9rem",
                transition: `all ${motionTokens.fast}`, textDecoration: "none",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = colors.obsidian.elevated; e.currentTarget.style.color = colors.white.DEFAULT; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = colors.white.muted; } }}
            >
              <NavIcon icon={item.icon} size={18} color={isActive ? colors.lime.DEFAULT : "currentColor"} />
              <span>{item.label}</span>
              {badge && (
                <span style={{
                  marginLeft: "auto", minWidth: "18px", height: "18px",
                  borderRadius: "100px", background: colors.lime.DEFAULT,
                  fontSize: "0.6rem", fontWeight: 700, color: colors.obsidian.DEFAULT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 4px", fontFamily: "var(--font-mono)",
                }}>
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User block */}
      <div style={{
        padding: "1rem 1.25rem",
        borderTop: `1px solid ${colors.obsidian.border}`,
        display: "flex", alignItems: "center", gap: "0.75rem",
      }}>
        <div style={{
          width: "2rem", height: "2rem", borderRadius: "50%",
          background: `${colors.lime.DEFAULT}18`,
          border: `1.5px solid ${colors.lime.DEFAULT}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.65rem", fontWeight: 700, color: colors.lime.DEFAULT,
          fontFamily: "var(--font-mono)", flexShrink: 0,
          overflow: "hidden",
        }}>
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: colors.white.DEFAULT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.displayName ?? "Loading..."}
          </p>
          <p style={{ fontSize: "0.7rem", color: colors.white.ghost, margin: 0, fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.email ?? ""}
          </p>
        </div>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: colors.lime.DEFAULT, flexShrink: 0, boxShadow: `0 0 6px ${colors.lime.DEFAULT}` }} />
      </div>
    </aside>
  );
}