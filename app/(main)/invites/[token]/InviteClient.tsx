// app/(main)/invites/[token]/InviteClient.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getInviteByToken } from "@/lib/invites";
import { colors, motion as motionTokens } from "@/lib/theme";
import type { PartnerInvite } from "@/types/invites";

type PageState = "loading" | "ready" | "accepting" | "accepted" | "invalid" | "expired" | "own_invite";

export default function InviteClient({ token }: { token: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [invite, setInvite] = useState<PartnerInvite | null>(null);
  const [state, setState] = useState<PageState>("loading");
  const [chatId, setChatId] = useState<string | null>(null);

  // Load the invite on mount
  useEffect(() => {
    if (authLoading) return;

    getInviteByToken(token).then((inv) => {
      if (!inv) { setState("invalid"); return; }
      if (inv.status === "accepted") { setState("accepted"); setChatId(null); return; }
      if (inv.status === "expired" || Date.now() > inv.expiresAt) { setState("expired"); return; }
      if (user && inv.inviterUid === user.uid) { setState("own_invite"); return; }
      setInvite(inv);
      setState("ready");
    });
  }, [token, authLoading, user]);

  // Not logged in — redirect to signup with token so they come back after
  useEffect(() => {
    if (!authLoading && !user && state === "ready") {
      router.replace(`/signup?invite=${token}`);
    }
  }, [authLoading, user, state, token, router]);

  const handleAccept = async () => {
    if (!user || !invite) return;
    setState("accepting");

    try {
      const res = await fetch("/api/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, accepterUid: user.uid }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Something went wrong.");
        setState("ready");
        return;
      }

      setChatId(data.chatId);
      setState("accepted");
    } catch {
      alert("Failed to accept. Please try again.");
      setState("ready");
    }
  };

  // ─── Render states ──────────────────────────────────────────────────────────
  if (state === "loading" || authLoading) {
    return <FullPageMessage icon="⏳" title="Loading invite..." subtitle="" />;
  }

  if (state === "invalid") {
    return (
      <FullPageMessage
        icon="✕"
        iconColor={colors.status.danger}
        title="Invite not found."
        subtitle="This link is invalid or has been removed."
        action={{ label: "Go to Nudge", href: "/" }}
      />
    );
  }

  if (state === "expired") {
    return (
      <FullPageMessage
        icon="⏰"
        iconColor={colors.amber.DEFAULT}
        title="Invite expired."
        subtitle="This invite link is more than 7 days old. Ask your partner to send a new one."
        action={{ label: "Go to Dashboard", href: "/dashboard" }}
      />
    );
  }

  if (state === "own_invite") {
    return (
      <FullPageMessage
        icon="↩"
        iconColor={colors.amber.DEFAULT}
        title="That's your own invite."
        subtitle="You can't accept your own accountability partnership."
        action={{ label: "Go to Dashboard", href: "/dashboard" }}
      />
    );
  }

  if (state === "accepted") {
    return (
      <FullPageMessage
        icon="🎯"
        iconColor={colors.lime.DEFAULT}
        title="Partnership accepted."
        subtitle={`You're now watching ${invite?.inviterName ?? "your partner"}'s aim. The bow is drawn.`}
        action={{
          label: "Open Messages →",
          href: chatId ? "/messages" : "/dashboard",
        }}
      />
    );
  }

  if (!invite || !user) return null;

  // ─── Ready state — show invite details and accept button ───────────────────
  return (
    <div style={{
      minHeight: "100dvh",
      background: `radial-gradient(ellipse at 50% 0%, ${colors.lime.glow} 0%, ${colors.obsidian.DEFAULT} 55%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: colors.obsidian.surface,
        border: `1.5px solid ${colors.obsidian.border}`,
        borderRadius: "20px",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "1.75rem 1.75rem 1.25rem",
          borderBottom: `1px solid ${colors.obsidian.border}`,
        }}>
          <span className="nudge-wordmark" style={{ fontSize: "0.875rem" }}>NUDGE</span>
        </div>

        {/* Body */}
        <div style={{ padding: "1.75rem" }}>
          <h1 style={{
            fontSize: "clamp(1.375rem, 4vw, 1.875rem)",
            fontWeight: 900,
            color: colors.white.DEFAULT,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "0.625rem",
          }}>
            <span style={{ color: colors.lime.DEFAULT }}>{invite.inviterName}</span>
            {" "}wants you
            <br />watching their aim.
          </h1>

          <p style={{
            fontSize: "0.875rem",
            color: colors.white.muted,
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}>
            <strong style={{ color: colors.white.DEFAULT }}>@{invite.inviterUsername}</strong> has
            invited you to be their accountability partner on Nudge.
          </p>

          {/* Goal block */}
          <div style={{
            padding: "1rem 1.25rem",
            background: colors.obsidian.elevated,
            borderLeft: `3px solid ${colors.lime.DEFAULT}`,
            borderRadius: "0 10px 10px 0",
            marginBottom: "1.5rem",
          }}>
            <p style={{ fontSize: "0.72rem", color: colors.lime.DEFAULT, fontWeight: 700, margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
              Their goal
            </p>
            <p style={{ fontSize: "0.95rem", color: colors.white.DEFAULT, margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
              &ldquo;{invite.goalText}&rdquo;
            </p>
          </div>

          {/* What this means */}
          <div style={{ marginBottom: "1.75rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {[
              "You'll be notified when they're slacking or at risk",
              "You can approve or reject their proof submissions",
              "You'll have a private direct message thread with them",
            ].map((point) => (
              <div key={point} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                <span style={{ color: colors.lime.DEFAULT, flexShrink: 0, marginTop: "1px" }}>✓</span>
                <p style={{ fontSize: "0.85rem", color: colors.white.muted, margin: 0, lineHeight: 1.5 }}>{point}</p>
              </div>
            ))}
          </div>

          {/* Logged in as */}
          <p style={{
            fontSize: "0.78rem",
            color: colors.white.ghost,
            marginBottom: "1rem",
            fontFamily: "var(--font-mono)",
          }}>
            Accepting as <span style={{ color: colors.white.muted }}>{user.displayName}</span>{" "}
            (@{user.email})
          </p>

          {/* Accept button */}
          <button
            onClick={handleAccept}
            disabled={state === "accepting"}
            style={{
              width: "100%",
              padding: "0.9375rem",
              borderRadius: "10px",
              border: "none",
              background: colors.lime.DEFAULT,
              color: colors.obsidian.DEFAULT,
              fontSize: "0.95rem",
              fontWeight: 800,
              cursor: state === "accepting" ? "wait" : "pointer",
              opacity: state === "accepting" ? 0.7 : 1,
              letterSpacing: "-0.01em",
              transition: `all ${motionTokens.fast}`,
              fontFamily: "inherit",
            }}
          >
            {state === "accepting" ? "Accepting..." : "Accept the Partnership →"}
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.625rem",
              borderRadius: "10px",
              border: "none",
              background: "transparent",
              color: colors.white.ghost,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable full-page message ──────────────────────────────────────────────
function FullPageMessage({
  icon,
  iconColor,
  title,
  subtitle,
  action,
}: {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  action?: { label: string; href: string };
}) {
  const router = useRouter();
  return (
    <div style={{
      minHeight: "100dvh",
      background: colors.obsidian.DEFAULT,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      padding: "2rem",
      textAlign: "center",
    }}>
      <span style={{ fontSize: "2.5rem" }}>{icon}</span>
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: 900,
        color: iconColor ?? colors.white.DEFAULT,
        letterSpacing: "-0.03em",
        margin: 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: "0.9rem", color: colors.white.muted, maxWidth: "360px", lineHeight: 1.6, margin: 0 }}>
          {subtitle}
        </p>
      )}
      {action && (
        <button
          onClick={() => router.push(action.href)}
          style={{
            marginTop: "0.5rem",
            padding: "0.875rem 1.75rem",
            borderRadius: "10px",
            border: "none",
            background: colors.lime.DEFAULT,
            color: colors.obsidian.DEFAULT,
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}