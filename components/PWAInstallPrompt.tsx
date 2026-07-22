// components/PWAInstallPrompt.tsx

"use client";

import { useEffect, useState } from "react";
import { colors, motion as motionTokens } from "@/lib/theme";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    if (sessionStorage.getItem("pwa-prompt-dismissed")) return;

    const isIOSDevice = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as { standalone?: boolean }).standalone;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      setTimeout(() => setShow(true), 3000);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setShow(false);
    setInstallEvent(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
  };

  if (!show || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        maxWidth: "420px",
        zIndex: 300,
        background: colors.obsidian.elevated,
        border: `1.5px solid ${colors.lime.DEFAULT}40`,
        borderRadius: "16px",
        padding: "1.125rem",
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${colors.lime.DEFAULT}20`,
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        animation: `slideUp 300ms ${motionTokens.easing.spring} forwards`,
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Icon */}
      <div style={{
        width: "44px", height: "44px", borderRadius: "10px",
        background: `${colors.lime.DEFAULT}15`,
        border: `1px solid ${colors.lime.DEFAULT}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span className="nudge-wordmark" style={{ fontSize: "0.6rem", color: colors.lime.DEFAULT }}>N</span>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "0.9rem", fontWeight: 700, color: colors.white.DEFAULT, margin: "0 0 0.2rem" }}>
          Install Nudge
        </p>
        {isIOS ? (
          <p style={{ fontSize: "0.78rem", color: colors.white.muted, margin: "0 0 0.75rem", lineHeight: 1.5 }}>
            Tap the <strong style={{ color: colors.white.DEFAULT }}>Share</strong> icon in Safari, then <strong style={{ color: colors.white.DEFAULT }}>Add to Home Screen</strong> to install.
          </p>
        ) : (
          <p style={{ fontSize: "0.78rem", color: colors.white.muted, margin: "0 0 0.75rem", lineHeight: 1.5 }}>
            Add Nudge to your desktop or home screen for offline support and quick access.
          </p>
        )}

        {!isIOS && (
          <button
            onClick={handleInstall}
            style={{
              padding: "0.5rem 1.125rem",
              borderRadius: "8px",
              border: "none",
              background: colors.lime.DEFAULT,
              color: colors.obsidian.DEFAULT,
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Install App
          </button>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        style={{ background: "none", border: "none", color: colors.white.ghost, cursor: "pointer", padding: "0.25rem", flexShrink: 0, fontSize: "1rem" }}
      >
        ✕
      </button>
    </div>
  );
}