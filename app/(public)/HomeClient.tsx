"use client";

import React, { useEffect, useRef, useState } from "react";
import { colors, motion as motionTokens } from "@/lib/theme";
import { TargetIcon, DrawnBowIcon, AllianceIcon, ProofIcon } from "@/components/StepIcons";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(6rem, 12vw, 10rem) clamp(1rem, 5vw, 3rem) clamp(4rem, 8vw, 6rem)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 10%, ${colors.lime.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Decorative target rings */}
      <TargetRings />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "800px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: `all ${motionTokens.dramatic} ${motionTokens.easing.ease}`,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.375rem 0.875rem",
            borderRadius: "100px",
            border: `1px solid ${colors.lime.DEFAULT}30`,
            background: colors.lime.glow,
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: colors.lime.DEFAULT,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: colors.lime.DEFAULT,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              fontFamily: "var(--font-mono)",
            }}
          >
            Accountability with teeth
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2.75rem, 9vw, 6.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: "1.5rem",
            fontFamily: "var(--font-display)",
          }}
        >
          <span style={{ color: colors.white.DEFAULT }}>The wind picks up.</span>
          <br />
          <span style={{ color: colors.lime.DEFAULT }}>
            Will you still shoot?
          </span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: colors.white.muted,
            lineHeight: 1.65,
            maxWidth: "560px",
            margin: "0 auto 2.5rem",
          }}
        >
          Nudge breaks your goals into precise micro-steps, pairs you with an
          accountability partner, and applies real consequences when you miss.
          Not reminders. Pressure.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.875rem",
            justifyContent: "center",
          }}
        >
          <a
            href="/signup"
            style={{
              display: "inline-block",
              padding: "0.9375rem 2rem",
              borderRadius: "10px",
              background: colors.lime.DEFAULT,
              color: colors.obsidian.DEFAULT,
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "-0.01em",
              transition: `all ${motionTokens.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.lime.dim;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.lime.DEFAULT;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Draw the Bow — Start Free
          </a>
          <a
            href="#how"
            style={{
              display: "inline-block",
              padding: "0.9375rem 2rem",
              borderRadius: "10px",
              border: `1.5px solid ${colors.obsidian.border}`,
              color: colors.white.muted,
              fontWeight: 500,
              fontSize: "0.95rem",
              transition: `all ${motionTokens.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.white.ghost;
              e.currentTarget.style.color = colors.white.DEFAULT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.obsidian.border;
              e.currentTarget.style.color = colors.white.muted;
            }}
          >
            See how it works
          </a>
        </div>

        {/* Social proof micro-line */}
        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.8rem",
            color: colors.white.ghost,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.03em",
          }}
        >
          No app store required · Works on any device · Free to start
        </p>
      </div>

      {/* Scroll cue */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.375rem",
          opacity: 0.4,
          animation: "bounceY 2s ease-in-out infinite",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "40px",
            background: `linear-gradient(to bottom, ${colors.lime.DEFAULT}, transparent)`,
          }}
        />
      </div>
    </section>
  );
}

// ─── Target rings decoration ──────────────────────────────────────────────────
function TargetRings() {
  return (
    <div
      style={{
        position: "absolute",
        right: "-5%",
        top: "50%",
        transform: "translateY(-50%)",
        width: "clamp(200px, 35vw, 480px)",
        aspectRatio: "1",
        pointerEvents: "none",
        opacity: 0.07,
      }}
    >
      <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        {[220, 180, 140, 100, 60, 24].map((r, i) => (
          <circle
            key={i}
            cx="240"
            cy="240"
            r={r}
            stroke={colors.lime.DEFAULT}
            strokeWidth={i === 5 ? "3" : "1"}
          />
        ))}
        {/* Crosshairs */}
        <line x1="240" y1="20" x2="240" y2="80" stroke={colors.lime.DEFAULT} strokeWidth="1" />
        <line x1="240" y1="400" x2="240" y2="460" stroke={colors.lime.DEFAULT} strokeWidth="1" />
        <line x1="20" y1="240" x2="80" y2="240" stroke={colors.lime.DEFAULT} strokeWidth="1" />
        <line x1="400" y1="240" x2="460" y2="240" stroke={colors.lime.DEFAULT} strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "State your target",
      body: "Tell Nudge what you're conquering — a business goal, a habit, a recovery milestone. The AI breaks it into daily micro-tasks you can actually execute.",
      accent: colors.lime.DEFAULT,
      Icon: TargetIcon,
    },
    {
      number: "02",
      title: "Draw the bow",
      body: "Choose your accountability tier. Soft gets gentle reminders. Hardcore means public exposure, financial stakes, and a system that floods your device when you slack.",
      accent: colors.lime.DEFAULT,
      Icon: DrawnBowIcon,
    },
    {
      number: "03",
      title: "Find your alliance",
      body: "Invite a friend, get matched from the community, or hire a certified practitioner. Your partner sees your proof and co-signs your progress.",
      accent: colors.lime.DEFAULT,
      Icon: AllianceIcon,
    },
    {
      number: "04",
      title: "Submit proof. Hit the pool.",
      body: "No checkboxes. Live video, photos, commit hashes — verified proof only. Succeed and earn from the stakes forfeited by those who didn't.",
      accent: colors.amber.DEFAULT,
      Icon: ProofIcon,
    },
  ];

  return (
    <section
      id="how"
      style={{
        padding: "clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 3rem)",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "3.5rem", maxWidth: "560px" }}>
        <span
          style={{
            display: "block",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: colors.lime.DEFAULT,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            fontFamily: "var(--font-mono)",
            marginBottom: "0.875rem",
          }}
        >
          The Process
        </span>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "1rem",
          }}
        >
          Four steps from{" "}
          <span style={{ color: colors.lime.DEFAULT }}>intention</span> to{" "}
          <span style={{ color: colors.lime.DEFAULT }}>execution.</span>
        </h2>
        <p style={{ fontSize: "1rem", lineHeight: 1.65 }}>
          Most goals die in the gap between deciding and doing. Nudge seals that
          gap with structure, social pressure, and skin in the game.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: {
    number: string;
    title: string;
    body: string;
    accent: string;
    Icon: React.ComponentType<{ accent: string; size?: number }>;
  };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { Icon } = step;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      style={{
        padding: "1.75rem",
        background: colors.obsidian.surface,
        border: `1.5px solid ${colors.obsidian.border}`,
        borderRadius: "16px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `all ${motionTokens.slow} ${motionTokens.easing.ease}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Number watermark */}
      <span
        style={{
          position: "absolute",
          top: "1rem",
          right: "1.25rem",
          fontFamily: "var(--font-mono)",
          fontSize: "3.5rem",
          fontWeight: 700,
          color: step.accent,
          opacity: 0.06,
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none" as const,
        }}
      >
        {step.number}
      </span>

      {/* Literal visual depiction of the step */}
      <div
        style={{
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "10px",
          background: `${step.accent}12`,
          border: `1px solid ${step.accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.125rem",
        }}
      >
        <Icon accent={step.accent} size={32} />
      </div>

      <h3
        style={{
          fontSize: "1.0625rem",
          fontWeight: 700,
          color: colors.white.DEFAULT,
          marginBottom: "0.625rem",
          letterSpacing: "-0.02em",
        }}
      >
        {step.title}
      </h3>
      <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: colors.white.muted }}>
        {step.body}
      </p>
    </div>
  );
}

// ─── Tiers showcase ───────────────────────────────────────────────────────────
function TiersSection() {
  const tiers = [
    {
      key: "soft",
      label: "Soft",
      tagline: "A gentle nudge.",
      color: colors.white.muted,
      features: [
        "AI-generated daily micro-tasks",
        "Gentle push notifications",
        "Personal progress tracking",
        "Community feed access",
      ],
      cta: "Start soft",
    },
    {
      key: "firm",
      label: "Firm",
      tagline: "Real eyes on you.",
      color: colors.lime.DEFAULT,
      features: [
        "Everything in Soft",
        "Partner alert on every miss",
        "Verified proof submissions",
        "DM audit log with sponsor",
      ],
      cta: "Get serious",
      highlight: true,
    },
    {
      key: "hardcore",
      label: "Hardcore",
      tagline: "Pay to stay focused.",
      color: colors.amber.DEFAULT,
      features: [
        "Everything in Firm",
        "Financial stake pool entry",
        "Live video check-ins",
        "Public slacking exposure",
        "Device disruption mode",
        "Cash rewards from slackers",
      ],
      cta: "Go all in",
    },
  ];

  return (
    <section
      style={{
        padding: "clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 3rem)",
        background: colors.obsidian.surface,
        borderTop: `1px solid ${colors.obsidian.border}`,
        borderBottom: `1px solid ${colors.obsidian.border}`,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center" as const, marginBottom: "3.5rem" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: colors.lime.DEFAULT,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              fontFamily: "var(--font-mono)",
              marginBottom: "0.875rem",
            }}
          >
            Accountability Tiers
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            Draw the bow as{" "}
            <span style={{ color: colors.lime.DEFAULT }}>far as you dare.</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
            alignItems: "start",
          }}
        >
          {tiers.map((tier) => (
            <div
              key={tier.key}
              style={{
                padding: "2rem",
                background: tier.highlight ? `${tier.color}08` : colors.obsidian.DEFAULT,
                border: `1.5px solid ${tier.highlight ? tier.color + "40" : colors.obsidian.border}`,
                borderRadius: "16px",
                position: "relative",
              }}
            >
              {tier.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "0.25rem 0.875rem",
                    background: tier.color,
                    borderRadius: "0 0 8px 8px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: colors.obsidian.DEFAULT,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Most popular
                </div>
              )}

              <div style={{ marginBottom: "1.25rem" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: tier.color,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {tier.label}
                </span>
                <h3
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: 800,
                    color: colors.white.DEFAULT,
                    letterSpacing: "-0.03em",
                    marginTop: "0.25rem",
                  }}
                >
                  {tier.tagline}
                </h3>
              </div>

              <ul style={{ listStyle: "none", marginBottom: "1.75rem", display: "flex", flexDirection: "column" as const, gap: "0.625rem" }}>
                {tier.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.625rem",
                      fontSize: "0.875rem",
                      color: colors.white.muted,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: tier.color, flexShrink: 0, marginTop: "1px" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                style={{
                  display: "block",
                  padding: "0.875rem",
                  borderRadius: "10px",
                  background: tier.highlight ? tier.color : "transparent",
                  border: `1.5px solid ${tier.highlight ? tier.color : colors.obsidian.border}`,
                  color: tier.highlight ? colors.obsidian.DEFAULT : colors.white.muted,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  textAlign: "center" as const,
                  transition: `all ${motionTokens.fast}`,
                }}
                onMouseEnter={(e) => {
                  if (!tier.highlight) {
                    e.currentTarget.style.borderColor = tier.color;
                    e.currentTarget.style.color = tier.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!tier.highlight) {
                    e.currentTarget.style.borderColor = colors.obsidian.border;
                    e.currentTarget.style.color = colors.white.muted;
                  }
                }}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Community section ────────────────────────────────────────────────────────
function CommunitySection() {
  const posts = [
    {
      handle: "@tunde_builds",
      time: "2h ago",
      content: "Day 14 of shipping daily. Backend API is live. Here's the commit.",
      category: "⚡ Tech",
      fuel: 38,
      tier: "firm",
      verified: true,
    },
    {
      handle: "@amaka_runs",
      time: "5h ago",
      content: "5km before sunrise. 21 days straight. Video proof attached.",
      category: "🔥 Fitness",
      fuel: 91,
      tier: "hardcore",
      verified: true,
    },
    {
      handle: "@david_clear",
      time: "1d ago",
      content: "30 days without a drink. I used the relapse button twice. Still here. Still fighting.",
      category: "🛡️ Recovery",
      fuel: 204,
      tier: "hardcore",
      verified: false,
    },
  ];

  return (
    <section
      id="community"
      style={{
        padding: "clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 3rem)",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: colors.lime.DEFAULT,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              fontFamily: "var(--font-mono)",
              marginBottom: "0.875rem",
            }}
          >
            The Nudge Pulse
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: "1.25rem",
            }}
          >
            A global feed of people{" "}
            <span style={{ color: colors.lime.DEFAULT }}>actually doing the work.</span>
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            Not status updates. Verified proof logs. See developers shipping, athletes
            running, people rebuilding their lives — all on one timeline. When you see
            someone winning, their stake in your pocket becomes real.
          </p>
          <a
            href="/signup"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.75rem",
              borderRadius: "10px",
              background: colors.lime.DEFAULT,
              color: colors.obsidian.DEFAULT,
              fontWeight: 700,
              fontSize: "0.9rem",
              transition: `all ${motionTokens.fast}`,
            }}
          >
            Join the Pulse →
          </a>
        </div>

        {/* Feed preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {posts.map((post, i) => (
            <div
              key={i}
              style={{
                padding: "1.125rem 1.25rem",
                background: colors.obsidian.surface,
                border: `1px solid ${colors.obsidian.border}`,
                borderRadius: "12px",
                transition: `border-color ${motionTokens.fast}`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = colors.obsidian.elevated)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = colors.obsidian.border)
              }
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: `${post.tier === "hardcore" ? colors.amber.DEFAULT : colors.lime.DEFAULT}20`,
                      border: `1px solid ${post.tier === "hardcore" ? colors.amber.DEFAULT : colors.lime.DEFAULT}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: post.tier === "hardcore" ? colors.amber.DEFAULT : colors.lime.DEFAULT,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {post.handle.slice(1, 3).toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: colors.white.DEFAULT, display: "block" }}>
                      {post.handle}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: colors.white.ghost }}>{post.time}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {post.verified && (
                    <span style={{ fontSize: "0.65rem", color: colors.lime.DEFAULT, fontFamily: "var(--font-mono)" }}>
                      ✓ PROOF
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "100px",
                      background: `${post.tier === "hardcore" ? colors.amber.DEFAULT : colors.lime.DEFAULT}15`,
                      color: post.tier === "hardcore" ? colors.amber.DEFAULT : colors.lime.DEFAULT,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {post.tier}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.875rem", color: colors.white.muted, lineHeight: 1.5, marginBottom: "0.75rem" }}>
                {post.content}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "1.125rem" }}>
                <span style={{ fontSize: "0.75rem", color: colors.white.ghost }}>{post.category}</span>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.75rem",
                    color: colors.white.ghost,
                    cursor: "pointer",
                    padding: 0,
                    transition: `color ${motionTokens.fast}`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.lime.DEFAULT)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = colors.white.ghost)}
                >
                  🔥 {post.fuel} Fuel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section
      style={{
        padding: "clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 3rem)",
        textAlign: "center" as const,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${colors.lime.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "620px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(2.25rem, 6vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: "1.25rem",
          }}
        >
          The arrow is drawn.
          <br />
          <span style={{ color: colors.lime.DEFAULT }}>Are you?</span>
        </h2>
        <p style={{ fontSize: "1rem", lineHeight: 1.65, marginBottom: "2.25rem" }}>
          Stop collecting goals. Start executing them with the system that makes
          quitting more painful than continuing.
        </p>
        <a
          href="/signup"
          style={{
            display: "inline-block",
            padding: "1rem 2.5rem",
            borderRadius: "10px",
            background: colors.lime.DEFAULT,
            color: colors.obsidian.DEFAULT,
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            transition: `all ${motionTokens.fast}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.lime.dim;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 8px 30px ${colors.lime.glow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.lime.DEFAULT;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Release the Arrow — It&apos;s Free
        </a>
      </div>
    </section>
  );
}

// ─── Main HomeClient ──────────────────────────────────────────────────────────
export default function HomeClient() {
  return (
    <>
      <main>
        <Hero />
        <HowItWorks />
        <TiersSection />
        <CommunitySection />
        <FinalCTA />
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes bounceY {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </>
  );
}