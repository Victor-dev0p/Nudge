// app/(app)/messages/MessagesClient.tsx

"use client";

import React, { useState } from "react";
import { colors, motion as motionTokens } from "@/lib/theme";

interface MockThread {
  id: string;
  name: string;
  handle: string;
  initials: string;
  role: "sponsor" | "peer" | "practitioner";
  lastMessage: string;
  time: string;
  unread: number;
  tierColor: string;
}

interface MockMessage {
  id: string;
  from: "me" | "them";
  type: "text" | "proof_card" | "system";
  content?: string;
  proofCard?: {
    taskText: string;
    proofType: string;
    status: "awaiting_review" | "approved" | "rejected" | "auto_verified";
    verifiedBy?: string;
  };
  time: string;
}

const MOCK_THREADS: MockThread[] = [
  {
    id: "t1",
    name: "Tunde Adeyemi",
    handle: "@tunde_builds",
    initials: "TA",
    role: "peer",
    lastMessage: "Proof submitted — check the card above.",
    time: "2m",
    unread: 3,
    tierColor: colors.lime.DEFAULT,
  },
  {
    id: "t2",
    name: "Dr. Sola Akin",
    handle: "@dr_sola",
    initials: "SA",
    role: "practitioner",
    lastMessage: "Great work this week. How are you feeling about the pattern we discussed?",
    time: "1h",
    unread: 0,
    tierColor: colors.amber.DEFAULT,
  },
  {
    id: "t3",
    name: "Zara Mensah",
    handle: "@zara_ships",
    initials: "ZM",
    role: "peer",
    lastMessage: "You've got this. Don't let the spiral win tonight.",
    time: "3h",
    unread: 0,
    tierColor: colors.lime.DEFAULT,
  },
];

const MOCK_MESSAGES: MockMessage[] = [
  { id: "m1", from: "me", type: "text", content: "Submitting today's proof now.", time: "9:41 AM" },
  {
    id: "m2",
    from: "me",
    type: "proof_card",
    proofCard: {
      taskText: "Implement dashboard with live task tracking",
      proofType: "GitHub Commit",
      status: "awaiting_review",
    },
    time: "9:42 AM",
  },
  { id: "m3", from: "them", type: "text", content: "On it, reviewing now.", time: "9:48 AM" },
  {
    id: "m4",
    from: "them",
    type: "proof_card",
    proofCard: {
      taskText: "Implement dashboard with live task tracking",
      proofType: "GitHub Commit",
      status: "approved",
      verifiedBy: "Tunde Adeyemi",
    },
    time: "9:51 AM",
  },
  { id: "m5", from: "them", type: "text", content: "Approved. Streak saved. Keep going — day 10 tomorrow.", time: "9:51 AM" },
];

export default function MessagesClient() {
  const [activeThread, setActiveThread] = useState<string>("t1");
  const [newMessage, setNewMessage] = useState("");
  const [showThreadList, setShowThreadList] = useState(true);

  const active = MOCK_THREADS.find((t) => t.id === activeThread)!;

  return (
    <div
      style={{
        display: "flex",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {/* Thread list */}
      <div
        style={{
          width: "300px",
          flexShrink: 0,
          borderRight: `1px solid ${colors.obsidian.border}`,
          display: "flex",
          flexDirection: "column",
          background: colors.obsidian.surface,
        }}
      >
        <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: `1px solid ${colors.obsidian.border}` }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: colors.white.DEFAULT, letterSpacing: "-0.02em", margin: 0 }}>
            Messages
          </h2>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {MOCK_THREADS.map((thread) => {
            const isActive = activeThread === thread.id;
            return (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                style={{
                  width: "100%",
                  padding: "0.875rem 1.25rem",
                  background: isActive ? `${colors.lime.DEFAULT}08` : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${isActive ? colors.lime.DEFAULT : "transparent"}`,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  transition: `all ${motionTokens.fast}`,
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "50%",
                    background: `${thread.tierColor}18`,
                    border: `1.5px solid ${thread.tierColor}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: thread.tierColor,
                    fontFamily: "var(--font-mono)",
                    flexShrink: 0,
                  }}
                >
                  {thread.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: colors.white.DEFAULT }}>
                      {thread.name}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: colors.white.ghost }}>{thread.time}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.2rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: colors.white.ghost,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {thread.lastMessage}
                    </span>
                    {thread.unread > 0 && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          minWidth: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: colors.lime.DEFAULT,
                          color: colors.obsidian.DEFAULT,
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-mono)",
                          flexShrink: 0,
                        }}
                      >
                        {thread.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thread view */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Thread header */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: `1px solid ${colors.obsidian.border}`,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: colors.obsidian.surface,
          }}
        >
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              background: `${active.tierColor}18`,
              border: `1.5px solid ${active.tierColor}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.6rem",
              fontWeight: 700,
              color: active.tierColor,
              fontFamily: "var(--font-mono)",
            }}
          >
            {active.initials}
          </div>
          <div>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: colors.white.DEFAULT, margin: 0 }}>
              {active.name}
            </p>
            <p style={{ fontSize: "0.75rem", color: colors.white.ghost, margin: 0 }}>
              {active.handle} ·{" "}
              <span
                style={{
                  color:
                    active.role === "practitioner"
                      ? colors.amber.DEFAULT
                      : colors.lime.DEFAULT,
                }}
              >
                {active.role === "practitioner" ? "✓ Certified Practitioner" : "Accountability Peer"}
              </span>
            </p>
          </div>

          {/* Safety shield */}
          <button
            style={{
              marginLeft: "auto",
              background: "none",
              border: `1px solid ${colors.obsidian.border}`,
              borderRadius: "8px",
              padding: "0.375rem 0.75rem",
              color: colors.white.muted,
              fontSize: "0.75rem",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: `all ${motionTokens.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.status.danger;
              e.currentTarget.style.color = colors.status.danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.obsidian.border;
              e.currentTarget.style.color = colors.white.muted;
            }}
          >
            🛡 Report
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {MOCK_MESSAGES.map((msg) => {
            const isMe = msg.from === "me";
            if (msg.type === "proof_card" && msg.proofCard) {
              return <ProofCard key={msg.id} card={msg.proofCard} time={msg.time} />;
            }
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background: isMe ? `${colors.lime.DEFAULT}18` : colors.obsidian.elevated,
                    border: `1px solid ${isMe ? colors.lime.DEFAULT + "30" : colors.obsidian.border}`,
                  }}
                >
                  <p style={{ fontSize: "0.875rem", color: colors.white.DEFAULT, margin: 0, lineHeight: 1.5 }}>
                    {msg.content}
                  </p>
                  <p style={{ fontSize: "0.65rem", color: colors.white.ghost, margin: "0.25rem 0 0", textAlign: isMe ? "right" : "left" }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input bar */}
        <div
          style={{
            padding: "0.875rem 1.25rem",
            borderTop: `1px solid ${colors.obsidian.border}`,
            display: "flex",
            gap: "0.75rem",
            background: colors.obsidian.surface,
          }}
        >
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message..."
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              background: colors.obsidian.elevated,
              border: `1px solid ${colors.obsidian.border}`,
              borderRadius: "10px",
              color: colors.white.DEFAULT,
              fontSize: "0.875rem",
              outline: "none",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
          />
          <button
            style={{
              padding: "0.75rem 1.125rem",
              borderRadius: "10px",
              background: newMessage.trim() ? colors.lime.DEFAULT : colors.obsidian.elevated,
              border: "none",
              color: newMessage.trim() ? colors.obsidian.DEFAULT : colors.white.ghost,
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: newMessage.trim() ? "pointer" : "default",
              transition: `all ${motionTokens.fast}`,
              fontFamily: "inherit",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function ProofCard({
  card,
  time,
}: {
  card: NonNullable<MockMessage["proofCard"]>;
  time: string;
}) {
  const statusColor =
    card.status === "approved" || card.status === "auto_verified"
      ? colors.lime.DEFAULT
      : card.status === "rejected"
      ? colors.status.danger
      : colors.amber.DEFAULT;

  const statusLabel =
    card.status === "approved"
      ? "✓ Approved"
      : card.status === "auto_verified"
      ? "✓ Auto-verified by AI"
      : card.status === "rejected"
      ? "✕ Rejected"
      : "⏳ Awaiting review";

  return (
    <div
      style={{
        background: colors.obsidian.elevated,
        border: `1.5px solid ${statusColor}40`,
        borderRadius: "12px",
        padding: "1rem 1.125rem",
        maxWidth: "400px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: statusColor,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
          }}
        >
          Proof Card
        </span>
      </div>
      <p style={{ fontSize: "0.875rem", color: colors.white.DEFAULT, margin: "0 0 0.5rem", lineHeight: 1.4 }}>
        {card.taskText}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: colors.white.ghost, fontFamily: "var(--font-mono)" }}>
          {card.proofType}
        </span>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: statusColor }}>
          {statusLabel}
        </span>
      </div>
      {card.status === "awaiting_review" && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "8px",
              background: `${colors.lime.DEFAULT}18`,
              border: `1px solid ${colors.lime.DEFAULT}40`,
              color: colors.lime.DEFAULT,
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ✓ Approve
          </button>
          <button
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "8px",
              background: `${colors.status.danger}12`,
              border: `1px solid ${colors.status.danger}40`,
              color: colors.status.danger,
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ✕ Reject
          </button>
        </div>
      )}
      <p style={{ fontSize: "0.65rem", color: colors.white.ghost, margin: "0.5rem 0 0", textAlign: "right" }}>{time}</p>
    </div>
  );
}