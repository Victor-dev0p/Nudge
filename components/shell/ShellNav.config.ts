// Single source of truth for all app shell navigation.
// Import this in both Sidebar and BottomNav — never duplicate nav items.

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: "dashboard" | "pulse" | "messages" | "profile" | "discover" | "notifications";
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard",     label: "Dashboard",     href: "/dashboard",     icon: "dashboard"     },
  { key: "pulse",         label: "Pulse",         href: "/pulse",         icon: "pulse"         },
  { key: "messages",      label: "Messages",      href: "/messages",      icon: "messages"      },
  { key: "discover",      label: "Discover",      href: "/discover",      icon: "discover"      },
  { key: "profile",       label: "Profile",       href: "/profile",       icon: "profile"       },
];

// Notifications lives in the sidebar header, not the main nav
export const NOTIFICATION_ITEM: NavItem = {
  key: "notifications",
  label: "Notifications",
  href: "/notifications",
  icon: "notifications",
};