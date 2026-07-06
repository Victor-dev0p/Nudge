// app/(public)/waitlist/WaitlistClient.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { colors, motion as motionTokens } from "@/lib/theme";

// ─── Types ────────────────────────────────────────────────────────────────────
type WaitlistType = "sponsee" | "practitioner";

type SponseeDomain =
  | "tech_dev"
  | "business"
  | "health_fitness"
  | "addiction_recovery"
  | "mental_health"
  | "learning"
  | "other";

type PractitionerDesignation =
  | "executive_coach"
  | "licensed_therapist"
  | "certified_mentor"
  | "fitness_coach"
  | "addiction_counselor"
  | "other";

const SPONSEE_DOMAINS: { key: SponseeDomain; label: string; emoji: string }[] = [
  { key: "tech_dev",           label: "Tech / Dev",        emoji: "⚡" },
  { key: "business",           label: "Business",          emoji: "📈" },
  { key: "health_fitness",     label: "Health & Fitness",  emoji: "🔥" },
  { key: "addiction_recovery", label: "Recovery",          emoji: "🛡️" },
  { key: "mental_health",      label: "Mental Health",     emoji: "🧠" },
  { key: "learning",           label: "Learning / Skill",  emoji: "🎯" },
  { key: "other",              label: "Other",             emoji: "◎"  },
];

const PRACTITIONER_DESIGNATIONS: { key: PractitionerDesignation; label: string }[] = [
  { key: "executive_coach",     label: "Executive Coach"      },
  { key: "licensed_therapist",  label: "Licensed Therapist"   },
  { key: "certified_mentor",    label: "Certified Mentor"     },
  { key: "fitness_coach",       label: "Fitness / Life Coach" },
  { key: "addiction_counselor", label: "Addiction Counselor"  },
  { key: "other",               label: "Other"                },
];

const FEATURES = [
  {
    emoji: "🕹️",
    headline: "The Zero-Sum Economy",
    sub: "Put Your Money Where Your Execution Is.",
    body: "Lock a financial stake in escrow. Win and keep it. Slack and lose it to a global bonus pool paid directly to disciplined users.",
  },
  {
    emoji: "👁️",
    headline: "Uneditable Audit Logs",
    sub: "No Faking. No Photoshop.",
    body: "Traditional uploads are blocked. Users must stream live, time-boxed video check-ins to verify compliance directly to their partner's chat vault.",
  },
  {
    emoji: "🚨",
    headline: "The Anti-Ghost Patrol",
    sub: "Proactive AI & Sponsor Pings.",
    body: "Trying to hide by staying quiet? Your sponsor can trigger a 30-minute emergency proof window the moment you go radio silent.",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function WaitlistClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: colors.obsidian.DEFAULT,
        fontFamily: "var(--font-body)",
        overflowX: "hidden",
      }}
    >
      <WaitlistNav />
      <HeroSection mounted={mounted} />
      <FeaturesSection />
      <DualWaitlistSection />
      <WaitlistFooter />

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 12px ${colors.lime.DEFAULT}60; }
          50%       { box-shadow: 0 0 28px ${colors.lime.DEFAULT}90; }
        }
        @keyframes heartbeat {
          0%, 100% { background: ${colors.lime.DEFAULT}; }
          50%       { background: ${colors.amber.DEFAULT}; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50%       { opacity: 0.06; }
        }
      `}</style>
    </div>
  );
}

// ─── Waitlist Nav ─────────────────────────────────────────────────────────────
function WaitlistNav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem clamp(1rem, 5vw, 3rem)",
        background: `${colors.obsidian.DEFAULT}e0`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${colors.obsidian.border}`,
      }}
    >
      <a href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image src="/transparent-logo.png" alt="Nudge" width={88} height={30} style={{ objectFit: "contain" }} priority />
      </a>
      <a
        href="#join"
        style={{
          padding: "0.45rem 1rem",
          borderRadius: "8px",
          background: colors.lime.DEFAULT,
          color: colors.obsidian.DEFAULT,
          fontSize: "0.8rem",
          fontWeight: 700,
          textDecoration: "none",
          transition: `all ${motionTokens.fast}`,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = colors.amber.DEFAULT)}
        onMouseLeave={(e) => (e.currentTarget.style.background = colors.lime.DEFAULT)}
      >
        Join Beta
      </a>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ mounted }: { mounted: boolean }) {
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
      {/* Grid mesh background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${colors.obsidian.border} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.obsidian.border} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          animation: "gridPulse 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Radial overlay on grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${colors.obsidian.DEFAULT} 30%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Lime glow from top */}
      <div
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: `radial-gradient(ellipse at top, ${colors.lime.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "760px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: `all 800ms ${motionTokens.easing.ease}`,
        }}
      >
        {/* Beta pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.375rem 0.875rem",
            borderRadius: "100px",
            border: `1px solid ${colors.lime.DEFAULT}30`,
            background: colors.lime.glow,
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              animation: "heartbeat 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: colors.lime.DEFAULT,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
            }}
          >
            Closed Beta — Limited Spots
          </span>
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: "1.5rem",
            fontFamily: "var(--font-display)",
          }}
        >
          <span style={{ color: colors.white.DEFAULT }}>Good intentions</span>
          <br />
          <span style={{ color: colors.white.muted }}>won&apos;t save</span>
          <br />
          <span style={{ color: colors.lime.DEFAULT }}>your goals.</span>
        </h1>

        {/* Sub-headline */}
        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: colors.white.muted,
            lineHeight: 1.7,
            maxWidth: "580px",
            margin: "0 auto 2.5rem",
          }}
        >
          Nudge is the hardcore social accountability network. Commit your
          target, lock an escrow stake, and upload uneditable video proof. Win
          and split the slacker pool. Slack and lose everything.
        </p>

        {/* CTA */}
        <a
          href="#join"
          style={{
            display: "inline-block",
            padding: "1rem 2.25rem",
            borderRadius: "10px",
            background: colors.lime.DEFAULT,
            color: colors.obsidian.DEFAULT,
            fontSize: "1rem",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            textDecoration: "none",
            animation: "pulseGlow 2.5s ease-in-out infinite",
            transition: `background ${motionTokens.fast}`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = colors.amber.DEFAULT)}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.lime.DEFAULT)}
        >
          Pull the Bow String — Join Closed Beta
        </a>

        <p
          style={{
            marginTop: "1.25rem",
            fontSize: "0.78rem",
            color: colors.white.ghost,
            fontFamily: "var(--font-mono)",
          }}
        >
          No spam. No payment required to join. Cancel any time.
        </p>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section
      style={{
        padding: "clamp(4rem, 8vw, 7rem) clamp(1rem, 5vw, 3rem)",
        borderTop: `1px solid ${colors.obsidian.border}`,
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: colors.lime.DEFAULT,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
            textAlign: "center",
            marginBottom: "0.75rem",
          }}
        >
          How Nudge Closes the Loopholes
        </p>
        <h2
          style={{
            fontSize: "clamp(1.75rem, 4vw, 3rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: colors.white.DEFAULT,
            textAlign: "center",
            marginBottom: "3rem",
            fontFamily: "var(--font-display)",
          }}
        >
          Every excuse, engineered out.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: typeof FEATURES[number] }) {
  return (
    <div
      style={{
        padding: "1.75rem",
        background: colors.obsidian.surface,
        border: `1px solid ${colors.obsidian.border}`,
        borderRadius: "16px",
        transition: `border-color ${motionTokens.normal}`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}40`)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
    >
      <span style={{ fontSize: "2rem", display: "block", marginBottom: "1rem" }}>
        {feature.emoji}
      </span>
      <h3
        style={{
          fontSize: "1.0625rem",
          fontWeight: 800,
          color: colors.white.DEFAULT,
          letterSpacing: "-0.02em",
          marginBottom: "0.25rem",
          fontFamily: "var(--font-display)",
        }}
      >
        {feature.headline}
      </h3>
      <p
        style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          color: colors.lime.DEFAULT,
          marginBottom: "0.75rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        {feature.sub}
      </p>
      <p style={{ fontSize: "0.875rem", color: colors.white.muted, lineHeight: 1.65 }}>
        {feature.body}
      </p>
    </div>
  );
}

// ─── Dual Waitlist Section ────────────────────────────────────────────────────
function DualWaitlistSection() {
  return (
    <section
      id="join"
      style={{
        padding: "clamp(4rem, 8vw, 7rem) clamp(1rem, 5vw, 3rem)",
        borderTop: `1px solid ${colors.obsidian.border}`,
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: colors.lime.DEFAULT,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
            textAlign: "center",
            marginBottom: "0.75rem",
          }}
        >
          Secure Your Spot
        </p>
        <h2
          style={{
            fontSize: "clamp(1.75rem, 4vw, 3rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: colors.white.DEFAULT,
            textAlign: "center",
            marginBottom: "0.875rem",
            fontFamily: "var(--font-display)",
          }}
        >
          Two paths. One platform.
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            color: colors.white.muted,
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          Choose your role in the Nudge ecosystem.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <WaitlistForm type="sponsee" />
          <WaitlistForm type="practitioner" />
        </div>
      </div>
    </section>
  );
}

// ─── Waitlist Form ────────────────────────────────────────────────────────────
function WaitlistForm({ type }: { type: WaitlistType }) {
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState<SponseeDomain | "">("");
  const [designation, setDesignation] = useState<PractitionerDesignation | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");

  const isSponsee = type === "sponsee";
  const accent = isSponsee ? colors.lime.DEFAULT : colors.amber.DEFAULT;
  const accentGlow = isSponsee ? colors.lime.glow : colors.amber.glow;

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    if (isSponsee && !domain) return;
    if (!isSponsee && !designation) return;

    setStatus("loading");

    try {
      // Check for duplicate email in same type
      const q = query(
        collection(db, "waitlist"),
        where("email", "==", email.toLowerCase().trim()),
        where("type", "==", type)
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        setStatus("duplicate");
        return;
      }

      await addDoc(collection(db, "waitlist"), {
        email: email.toLowerCase().trim(),
        type,
        ...(isSponsee ? { domain } : { designation }),
        registeredAt: serverTimestamp(),
      });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        background: colors.obsidian.surface,
        border: `1.5px solid ${accent}30`,
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      {/* Card header */}
      <div>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: accent,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
            display: "block",
            marginBottom: "0.375rem",
          }}
        >
          {isSponsee ? "I want to hit my targets" : "I want to supervise & earn"}
        </span>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: colors.white.DEFAULT,
            letterSpacing: "-0.03em",
            margin: 0,
            fontFamily: "var(--font-display)",
          }}
        >
          {isSponsee ? "The Sponsee Path" : "The Practitioner Path"}
        </h3>
        <p style={{ fontSize: "0.82rem", color: colors.white.muted, marginTop: "0.375rem" }}>
          {isSponsee
            ? "Set goals, lock stakes, submit proof. Earn from the pool when others don't."
            : "Get verified, supervise sponsees, earn a cut of every successful milestone you oversee."}
        </p>
      </div>

      {status === "success" ? (
        <div
          style={{
            padding: "1.5rem",
            background: `${accent}10`,
            border: `1px solid ${accent}40`,
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            {isSponsee ? "🎯" : "✓"}
          </p>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: accent, margin: "0 0 0.25rem" }}>
            {isSponsee ? "Spot secured." : "Application received."}
          </p>
          <p style={{ fontSize: "0.82rem", color: colors.white.muted, margin: 0 }}>
            {isSponsee
              ? "We'll reach out when the beta opens. Stay ready."
              : "Our team will review your credentials and reach out shortly."}
          </p>
        </div>
      ) : (
        <>
          {/* Email input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: colors.white.muted,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "0.4rem",
              }}
            >
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: colors.obsidian.elevated,
                border: `1.5px solid ${colors.obsidian.border}`,
                borderRadius: "10px",
                color: colors.white.DEFAULT,
                fontSize: "0.9rem",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: `border-color ${motionTokens.fast}`,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${accent}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = colors.obsidian.border)}
            />
          </div>

          {/* Domain / Designation select */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: colors.white.muted,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "0.4rem",
              }}
            >
              {isSponsee ? "Your goal domain" : "Your professional role"}
            </label>

            {isSponsee ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {SPONSEE_DOMAINS.map((d) => {
                  const isSelected = domain === d.key;
                  return (
                    <button
                      key={d.key}
                      onClick={() => setDomain(d.key)}
                      style={{
                        padding: "0.375rem 0.75rem",
                        borderRadius: "100px",
                        border: `1.5px solid ${isSelected ? accent : colors.obsidian.border}`,
                        background: isSelected ? `${accent}15` : "transparent",
                        color: isSelected ? accent : colors.white.muted,
                        fontSize: "0.78rem",
                        fontWeight: isSelected ? 700 : 400,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: `all ${motionTokens.fast}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      {d.emoji} {d.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value as PractitionerDesignation)}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  background: colors.obsidian.elevated,
                  border: `1.5px solid ${colors.obsidian.border}`,
                  borderRadius: "10px",
                  color: designation ? colors.white.DEFAULT : colors.white.ghost,
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <option value="" disabled>Select your role...</option>
                {PRACTITIONER_DESIGNATIONS.map((d) => (
                  <option key={d.key} value={d.key} style={{ background: colors.obsidian.surface }}>
                    {d.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Error / duplicate messages */}
          {status === "duplicate" && (
            <p style={{ fontSize: "0.8rem", color: colors.amber.DEFAULT, margin: 0 }}>
              This email is already on the {isSponsee ? "sponsee" : "practitioner"} waitlist.
            </p>
          )}
          {status === "error" && (
            <p style={{ fontSize: "0.8rem", color: colors.status.danger, margin: 0 }}>
              Something went wrong. Please try again.
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            style={{
              padding: "0.9rem",
              borderRadius: "10px",
              border: "none",
              background: accent,
              color: colors.obsidian.DEFAULT,
              fontSize: "0.9rem",
              fontWeight: 800,
              cursor: status === "loading" ? "wait" : "pointer",
              opacity: status === "loading" ? 0.7 : 1,
              fontFamily: "inherit",
              letterSpacing: "-0.01em",
              transition: `all ${motionTokens.fast}`,
              boxShadow: `0 0 20px ${accentGlow}`,
            }}
            onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { if (status !== "loading") e.currentTarget.style.opacity = "1"; }}
          >
            {status === "loading"
              ? "Securing your spot..."
              : isSponsee
              ? "Secure My Spot →"
              : "Apply for Verification →"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function WaitlistFooter() {
  return (
    <footer
      style={{
        padding: "1.75rem clamp(1rem, 5vw, 3rem)",
        borderTop: `1px solid ${colors.obsidian.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <a href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image src="/colored-logo.png" alt="Nudge" width={80} height={28} style={{ objectFit: "contain" }} />
      </a>

      {/* Heartbeat icon */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            animation: "heartbeat 2s ease-in-out infinite",
          }}
        />
        <span style={{ fontSize: "0.75rem", color: colors.white.ghost, fontFamily: "var(--font-mono)" }}>
          Beta launching soon
        </span>
      </div>

      <p style={{ fontSize: "0.75rem", color: colors.white.ghost, margin: 0 }}>
        © {new Date().getFullYear()} Nudge. All rights reserved.
      </p>
    </footer>
  );
}