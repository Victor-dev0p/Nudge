// components/shell/ShellIcons.tsx

"use client";

import React from "react";

interface IconProps {
  size?: number;
  color?: string;
}

export function DashboardIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function PulseIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5" />
      <path d="M2 10h3l2-4 2 8 2-6 2 3h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MessagesIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H6l-4 3V4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="6" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="10.5" x2="11" y2="10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DiscoverIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1.5" fill={color} />
      <line x1="10" y1="2" x2="10" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="15" x2="10" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="10" x2="5" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="10" x2="18" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ProfileIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke={color} strokeWidth="1.5" />
      <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function NotificationsIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 16.5a1.5 1.5 0 003 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TargetIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4" stroke={color} strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1.5" fill={color} />
    </svg>
  );
}

// Map icon key → component
import type { NavItem } from "./ShellNav.config";

const ICON_MAP: Record<NavItem["icon"], React.ComponentType<IconProps>> = {
  dashboard:     DashboardIcon,
  pulse:         PulseIcon,
  messages:      MessagesIcon,
  discover:      DiscoverIcon,
  profile:       ProfileIcon,
  notifications: NotificationsIcon,
};

export function NavIcon({ icon, size, color }: { icon: NavItem["icon"]; size?: number; color?: string }) {
  const Icon = ICON_MAP[icon];
  return <Icon size={size} color={color} />;
}