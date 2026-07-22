// components/shell/BottomNav.tsx

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { colors, motion as motionTokens } from "@/lib/theme";
import { NAV_ITEMS } from "./ShellNav.config";
import { NavIcon } from "./ShellIcons";

interface BottomNavProps {
  unreadCount: number;
}

export function BottomNav({ unreadCount }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 50,
        background: `${colors.obsidian.surface}f2`,
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${colors.obsidian.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom))",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        // Only messages gets a real badge — from live Firestore data
        const badge = item.key === "messages" && unreadCount > 0 ? unreadCount : null;

        return (
          <Link
            key={item.key}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.375rem 0.75rem",
              borderRadius: "10px",
              color: isActive ? colors.lime.DEFAULT : colors.white.ghost,
              textDecoration: "none",
              position: "relative",
              transition: `color ${motionTokens.fast}`,
              minWidth: "48px",
            }}
          >
            {/* Icon with badge */}
            <div style={{ position: "relative" }}>
              <NavIcon
                icon={item.icon}
                size={22}
                color={isActive ? colors.lime.DEFAULT : colors.white.ghost}
              />
              {badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px", right: "-6px",
                    minWidth: "16px", height: "16px",
                    borderRadius: "100px",
                    background: colors.lime.DEFAULT,
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    color: colors.obsidian.DEFAULT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    padding: "0 3px",
                  }}
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: isActive ? 700 : 400,
                letterSpacing: "0.02em",
              }}
            >
              {item.label}
            </span>

            {/* Active indicator */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-0.5rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "20px",
                  height: "2px",
                  borderRadius: "100px",
                  background: colors.lime.DEFAULT,
                  boxShadow: `0 0 8px ${colors.lime.DEFAULT}`,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}