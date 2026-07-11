// app/(main)/messages/MessagesClient.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { colors, motion as motionTokens } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import {
  useThreads, useMessages, sendMessage, sendViewOnceMessage,
  verifyProofCard, setTyping, usePartnerTyping, useThreadsTyping,
  editMessage, deleteForMe, deleteForEveryone, markViewed,
} from "@/lib/useMessages";
import type { ResolvedThread, ChatMessage, ParticipantProfile } from "@/types/messages";

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MessagesClient() {
  const { user } = useAuth();
  const { threads, loading } = useThreads();
  const [activeThread, setActiveThread] = useState<ResolvedThread | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Typing state across ALL threads (for thread list indicator)
  const typingMap = useThreadsTyping(
    threads.map((t) => ({ id: t.id, partner: t.partner ?? null })),
    user?.uid ?? ""
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const showList = isDesktop || !activeThread;
  const showThread = isDesktop || !!activeThread;

  return (
    <div style={{ height: "100dvh", display: "flex", overflow: "hidden", background: colors.obsidian.DEFAULT }}>
      {showList && (
        <ThreadList
          threads={threads}
          loading={loading}
          activeId={activeThread?.id ?? null}
          isDesktop={isDesktop}
          typingMap={typingMap}
          onSelect={setActiveThread}
        />
      )}
      {showThread && (
        activeThread && user ? (
          <ThreadView
            thread={activeThread}
            currentUid={user.uid}
            isDesktop={isDesktop}
            onBack={() => setActiveThread(null)}
          />
        ) : isDesktop ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: "0.875rem", color: colors.white.ghost }}>Select a conversation</p>
          </div>
        ) : null
      )}
    </div>
  );
}

// ─── Thread List ──────────────────────────────────────────────────────────────
function ThreadList({ threads, loading, activeId, isDesktop, typingMap, onSelect }: {
  threads: ResolvedThread[];
  loading: boolean;
  activeId: string | null;
  isDesktop: boolean;
  typingMap: Record<string, boolean>;
  onSelect: (t: ResolvedThread) => void;
}) {
  return (
    <div style={{ width: isDesktop ? "300px" : "100%", flexShrink: 0, borderRight: isDesktop ? `1px solid ${colors.obsidian.border}` : "none", display: "flex", flexDirection: "column", background: colors.obsidian.surface, height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "1.25rem", borderBottom: `1px solid ${colors.obsidian.border}`, flexShrink: 0 }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: colors.white.DEFAULT, letterSpacing: "-0.03em", margin: 0 }}>Messages</h1>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}><Spinner /></div>
        ) : threads.length === 0 ? (
          <div style={{ padding: "2rem 1.25rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.85rem", color: colors.white.ghost, lineHeight: 1.6 }}>No conversations yet.<br />Connect with a partner to start.</p>
          </div>
        ) : threads.map((thread) => (
          <ThreadRow
            key={thread.id}
            thread={thread}
            isActive={activeId === thread.id}
            isPartnerTyping={typingMap[thread.id] === true}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Thread Row ───────────────────────────────────────────────────────────────
function ThreadRow({ thread, isActive, isPartnerTyping, onSelect }: {
  thread: ResolvedThread;
  isActive: boolean;
  isPartnerTyping: boolean;
  onSelect: (t: ResolvedThread) => void;
}) {
  const partner = thread.partner;
  return (
    <button
      onClick={() => onSelect(thread)}
      style={{ width: "100%", padding: "0.875rem 1.25rem", background: isActive ? `${colors.lime.DEFAULT}08` : "transparent", border: "none", borderLeft: `2px solid ${isActive ? colors.lime.DEFAULT : "transparent"}`, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", transition: `all ${motionTokens.fast}`, fontFamily: "inherit" }}
    >
      <UserAvatar profile={partner} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: thread.unreadCount > 0 ? 700 : 500, color: colors.white.DEFAULT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "150px" }}>
            {partner?.displayName ?? "Unknown"}
          </span>
          <span style={{ fontSize: "0.7rem", color: colors.white.ghost, flexShrink: 0 }}>{formatTime(thread.lastMessageAt)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Show typing indicator in list if partner is typing */}
          {isPartnerTyping ? (
            <span style={{ fontSize: "0.78rem", color: colors.lime.DEFAULT, display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <TypingDots small />
              typing...
            </span>
          ) : (
            <span style={{ fontSize: "0.78rem", color: colors.white.ghost, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
              {thread.lastMessage || "No messages yet"}
            </span>
          )}
          {thread.unreadCount > 0 && (
            <span style={{ marginLeft: "0.5rem", minWidth: "18px", height: "18px", borderRadius: "50%", background: colors.lime.DEFAULT, color: colors.obsidian.DEFAULT, fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
              {thread.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Thread View ──────────────────────────────────────────────────────────────
function ThreadView({ thread, currentUid, isDesktop, onBack }: {
  thread: ResolvedThread;
  currentUid: string;
  isDesktop: boolean;
  onBack: () => void;
}) {
  const { messages, loading } = useMessages(thread.id);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [viewOnce, setViewOnce] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const partner = thread.partner;
  const partnerIsTyping = usePartnerTyping(thread.id, partner?.uid ?? null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partnerIsTyping]);

  useEffect(() => {
    return () => {
      setTyping(thread.id, currentUid, false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [thread.id, currentUid]);

  const handleTextChange = (value: string) => {
    setText(value);
    setTyping(thread.id, currentUid, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(thread.id, currentUid, false), 2000);
  };

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    const msg = text;
    setText("");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTyping(thread.id, currentUid, false);
    try {
      if (viewOnce) {
        await sendViewOnceMessage(thread.id, currentUid, msg);
        setViewOnce(false);
      } else {
        await sendMessage(thread.id, currentUid, msg);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden", minWidth: 0 }}>
      {/* Header */}
      <div style={{ padding: "0.875rem 1.25rem", borderBottom: `1px solid ${colors.obsidian.border}`, display: "flex", alignItems: "center", gap: "0.875rem", background: colors.obsidian.surface, flexShrink: 0 }}>
        {!isDesktop && (
          <button onClick={onBack} style={{ background: "none", border: "none", color: colors.lime.DEFAULT, cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <UserAvatar profile={partner} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 700, color: colors.white.DEFAULT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{partner?.displayName ?? "Unknown"}</p>
          <p style={{ fontSize: "0.72rem", color: colors.white.ghost, margin: 0, fontFamily: "var(--font-mono)" }}>
            @{partner?.username} <span style={{ color: partner?.role === "practitioner" ? colors.amber.DEFAULT : colors.lime.DEFAULT }}>· {partner?.role === "practitioner" ? "✓ Certified" : "Peer"}</span>
          </p>
        </div>
        <button style={{ background: "none", border: `1px solid ${colors.obsidian.border}`, borderRadius: "8px", padding: "0.35rem 0.7rem", color: colors.white.ghost, fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.status.danger; e.currentTarget.style.color = colors.status.danger; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.obsidian.border; e.currentTarget.style.color = colors.white.ghost; }}>
          🛡 Report
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}><Spinner /></div>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: "center", color: colors.white.ghost, fontSize: "0.85rem", marginTop: "2rem" }}>No messages yet. Say something.</p>
        ) : messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.senderId === currentUid}
            currentUid={currentUid}
            chatId={thread.id}
          />
        ))}
        {/* Typing indicator inside thread */}
        {partnerIsTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0" }}>
            <TypingDots />
            <span style={{ fontSize: "0.72rem", color: colors.white.ghost }}>{partner?.displayName?.split(" ")[0]} is typing...</span>
          </div>
        )}
        <div ref={bottomRef} style={{ height: "1px", flexShrink: 0 }} />
      </div>

      {/* View once toggle */}
      {viewOnce && (
        <div style={{ padding: "0.375rem 1rem", background: `${colors.lime.DEFAULT}10`, borderTop: `1px solid ${colors.lime.DEFAULT}30`, display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", color: colors.lime.DEFAULT }}>👁 View once enabled — message disappears after read</span>
          <button onClick={() => setViewOnce(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: colors.white.ghost, fontSize: "0.7rem", cursor: "pointer" }}>✕ Cancel</button>
        </div>
      )}

      {/* Input bar */}
      <div style={{ padding: "0.75rem 1rem", paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))", borderTop: `1px solid ${colors.obsidian.border}`, display: "flex", gap: "0.625rem", alignItems: "center", background: colors.obsidian.surface, flexShrink: 0 }}>
        {/* View once button */}
        <button
          onClick={() => setViewOnce(!viewOnce)}
          title="View once"
          style={{ width: "36px", height: "36px", borderRadius: "50%", border: `1px solid ${viewOnce ? colors.lime.DEFAULT : colors.obsidian.border}`, background: viewOnce ? `${colors.lime.DEFAULT}18` : "transparent", color: viewOnce ? colors.lime.DEFAULT : colors.white.ghost, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: "0.875rem", transition: `all ${motionTokens.fast}` }}
        >
          👁
        </button>

        <input
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={viewOnce ? "View once message..." : "Message..."}
          style={{ flex: 1, padding: "0.7rem 1rem", background: colors.obsidian.elevated, border: `1px solid ${viewOnce ? colors.lime.DEFAULT + "60" : colors.obsidian.border}`, borderRadius: "22px", color: colors.white.DEFAULT, fontSize: "0.9rem", outline: "none", fontFamily: "inherit", transition: `border-color ${motionTokens.fast}` }}
          onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`)}
          onBlur={(e) => (e.currentTarget.style.borderColor = viewOnce ? `${colors.lime.DEFAULT}60` : colors.obsidian.border)}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", background: text.trim() ? colors.lime.DEFAULT : colors.obsidian.elevated, color: text.trim() ? colors.obsidian.DEFAULT : colors.white.ghost, display: "flex", alignItems: "center", justifyContent: "center", cursor: text.trim() ? "pointer" : "default", transition: `all ${motionTokens.fast}`, flexShrink: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8L14 2L8 14L7 9L2 8Z" fill="currentColor" /></svg>
        </button>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message, isMe, currentUid, chatId }: {
  message: ChatMessage;
  isMe: boolean;
  currentUid: string;
  chatId: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.content ?? "");
  const [viewed, setViewed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Skip messages deleted for everyone
  if (message.deletedForEveryone) {
    return (
      <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
        <span style={{ fontSize: "0.78rem", color: colors.white.ghost, fontStyle: "italic", padding: "0.375rem 0.75rem" }}>
          🚫 Message deleted
        </span>
      </div>
    );
  }

  // Skip messages deleted for me
  if (message.deletedFor?.includes(currentUid)) return null;

  // System messages
  if (message.type === "system") {
    return (
      <div style={{ textAlign: "center", padding: "0.5rem 1rem" }}>
        <span style={{ fontSize: "0.75rem", color: colors.white.ghost, background: colors.obsidian.elevated, padding: "0.375rem 0.75rem", borderRadius: "100px" }}>
          {message.content}
        </span>
      </div>
    );
  }

  // Proof card
  if (message.type === "proof_card" && message.proofCard) {
    return <ProofCard message={message} chatId={chatId} isMe={isMe} />;
  }

  // View once — not yet viewed by recipient
  if (message.viewOnce && !isMe && !message.viewedBy?.includes(currentUid) && !viewed) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <button
          onClick={async () => {
            setViewed(true);
            await markViewed(chatId, message.id, currentUid);
          }}
          style={{ padding: "0.625rem 1rem", borderRadius: "18px 18px 18px 4px", background: `${colors.lime.DEFAULT}15`, border: `1px solid ${colors.lime.DEFAULT}40`, color: colors.lime.DEFAULT, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          👁 <span>Tap to view once</span>
        </button>
      </div>
    );
  }

  // View once — already viewed by recipient, hide from them
  if (message.viewOnce && !isMe && (message.viewedBy?.includes(currentUid) || viewed) && !editing) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <span style={{ fontSize: "0.78rem", color: colors.white.ghost, fontStyle: "italic", padding: "0.375rem 0.75rem" }}>👁 Viewed</span>
      </div>
    );
  }

  // Can edit: own message, within 15 mins, not view once
  const canEdit = isMe && !message.viewOnce && Date.now() - message.sentAt < 15 * 60 * 1000;
  const editTimeLeft = canEdit ? Math.ceil((15 * 60 * 1000 - (Date.now() - message.sentAt)) / 60000) : 0;

  const handleEdit = async () => {
    if (!editText.trim() || editText === message.content) { setEditing(false); return; }
    await editMessage(chatId, message.id, editText, message.content ?? "");
    setEditing(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", position: "relative" }}
      onContextMenu={(e) => { e.preventDefault(); setMenuOpen(true); }}
    >
      {/* Message bubble */}
      {editing ? (
        <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <input
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleEdit(); if (e.key === "Escape") setEditing(false); }}
            style={{ padding: "0.625rem 0.875rem", borderRadius: "12px", border: `1.5px solid ${colors.lime.DEFAULT}60`, background: colors.obsidian.elevated, color: colors.white.DEFAULT, fontSize: "0.875rem", outline: "none", fontFamily: "inherit" }}
          />
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button onClick={() => setEditing(false)} style={{ fontSize: "0.72rem", color: colors.white.ghost, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={handleEdit} style={{ fontSize: "0.72rem", color: colors.lime.DEFAULT, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Save</button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ maxWidth: "72%", padding: "0.625rem 0.875rem", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: isMe ? `${colors.lime.DEFAULT}20` : colors.obsidian.elevated, border: `1px solid ${isMe ? colors.lime.DEFAULT + "30" : colors.obsidian.border}`, cursor: "context-menu", position: "relative" }}
        >
          {message.viewOnce && isMe && (
            <div style={{ fontSize: "0.65rem", color: colors.lime.DEFAULT, marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              👁 View once
            </div>
          )}
          <p style={{ fontSize: "0.875rem", color: colors.white.DEFAULT, margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
            {message.content}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", justifyContent: isMe ? "flex-end" : "flex-start", marginTop: "0.25rem" }}>
            {message.editedAt && (
              <span style={{ fontSize: "0.6rem", color: colors.white.ghost, fontStyle: "italic" }}>edited</span>
            )}
            <span style={{ fontSize: "0.62rem", color: colors.white.ghost }}>{formatTime(message.sentAt)}</span>
          </div>
        </div>
      )}

      {/* Context menu */}
      {menuOpen && !editing && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            [isMe ? "right" : "left"]: "0",
            bottom: "calc(100% + 4px)",
            background: colors.obsidian.elevated,
            border: `1px solid ${colors.obsidian.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            zIndex: 50,
            minWidth: "160px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {canEdit && (
            <ContextMenuItem
              label={`✏️ Edit (${editTimeLeft}m left)`}
              onClick={() => { setEditing(true); setEditText(message.content ?? ""); setMenuOpen(false); }}
            />
          )}
          <ContextMenuItem
            label="🗑 Delete for me"
            onClick={async () => { await deleteForMe(chatId, message.id, currentUid); setMenuOpen(false); }}
          />
          {isMe && (
            <ContextMenuItem
              label="🗑 Delete for everyone"
              danger
              onClick={async () => { await deleteForEveryone(chatId, message.id); setMenuOpen(false); }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Context Menu Item ────────────────────────────────────────────────────────
function ContextMenuItem({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ width: "100%", padding: "0.75rem 1rem", background: "none", border: "none", textAlign: "left", fontSize: "0.85rem", color: danger ? colors.status.danger : colors.white.DEFAULT, cursor: "pointer", fontFamily: "inherit", transition: `background ${motionTokens.fast}` }}
      onMouseEnter={(e) => (e.currentTarget.style.background = colors.obsidian.surface)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {label}
    </button>
  );
}

// ─── Proof Card ───────────────────────────────────────────────────────────────
function ProofCard({ message, chatId, isMe }: { message: ChatMessage; chatId: string; isMe: boolean }) {
  const card = message.proofCard!;
  const [acting, setActing] = useState(false);
  const statusColor = card.status === "approved" || card.status === "auto_verified" ? colors.lime.DEFAULT : card.status === "rejected" ? colors.status.danger : colors.amber.DEFAULT;
  const statusLabel = card.status === "approved" ? "✓ Approved" : card.status === "auto_verified" ? "✓ Auto-verified" : card.status === "rejected" ? "✕ Rejected" : "⏳ Awaiting review";

  return (
    <div style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "85%", background: colors.obsidian.elevated, border: `1.5px solid ${statusColor}40`, borderRadius: "14px", padding: "0.875rem 1rem", minWidth: "240px" }}>
      <span style={{ fontSize: "0.62rem", fontWeight: 700, color: statusColor, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)", display: "block", marginBottom: "0.5rem" }}>Proof Card</span>
      <p style={{ fontSize: "0.85rem", color: colors.white.DEFAULT, margin: "0 0 0.5rem", lineHeight: 1.4 }}>{card.taskText}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.72rem", color: colors.white.ghost, fontFamily: "var(--font-mono)" }}>{card.proofType}</span>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: statusColor }}>{statusLabel}</span>
      </div>
      {card.status === "awaiting_review" && !isMe && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button onClick={async () => { setActing(true); try { await verifyProofCard(chatId, message.id, "approved"); } finally { setActing(false); } }} disabled={acting} style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", background: `${colors.lime.DEFAULT}18`, border: `1px solid ${colors.lime.DEFAULT}40`, color: colors.lime.DEFAULT, fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓ Approve</button>
          <button onClick={async () => { setActing(true); try { await verifyProofCard(chatId, message.id, "rejected"); } finally { setActing(false); } }} disabled={acting} style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", background: `${colors.status.danger}12`, border: `1px solid ${colors.status.danger}40`, color: colors.status.danger, fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✕ Reject</button>
        </div>
      )}
      <p style={{ fontSize: "0.62rem", color: colors.white.ghost, margin: "0.5rem 0 0", textAlign: "right" }}>{formatTime(message.sentAt)}</p>
    </div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots({ small }: { small?: boolean }) {
  const size = small ? 4 : 5;
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: size, height: size, borderRadius: "50%", background: colors.white.ghost, animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes typingBounce { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-4px);opacity:1} }`}</style>
    </div>
  );
}

// ─── User Avatar ──────────────────────────────────────────────────────────────
function UserAvatar({ profile, size }: { profile: ParticipantProfile | null; size: number }) {
  const initials = profile?.displayName ? profile.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
  const color = profile?.role === "practitioner" ? colors.amber.DEFAULT : colors.lime.DEFAULT;
  if (profile?.avatarUrl) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `1.5px solid ${color}40` }}>
        <Image src={profile.avatarUrl} alt={profile.displayName} width={size} height={size} style={{ objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: `${color}18`, border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 700, color, fontFamily: "var(--font-mono)" }}>
      {initials}
    </div>
  );
}

function Spinner() {
  return <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${colors.obsidian.border}`, borderTopColor: colors.lime.DEFAULT, animation: "spin 0.7s linear infinite" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

function formatTime(ms: number): string {
  if (!ms) return "";
  const diff = Date.now() - ms;
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return new Date(ms).toLocaleDateString([], { month: "short", day: "numeric" });
}