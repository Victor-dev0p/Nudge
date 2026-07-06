/**
 * NUDGE — Brand Theme
 * Single source of truth for all design tokens.
 *
 * Color system is BEHAVIORAL — the UI shifts based on user state:
 *   ALIGNMENT MODE  → Volcanic Lime  (#CCFF00)  user is on track
 *   RELAPSE RISK    → Kinetic Amber  (#FF6B00)  user is slacking / at risk
 */

export const colors = {
  // ─── Foundation (90% of all UI) ───────────────────────────────────────────
  obsidian: {
    DEFAULT: "#0A0A0F",   // deepest background
    surface: "#111118",   // cards, modals
    elevated: "#1A1A24",  // hover states, sidebars
    border: "#2A2A38",    // subtle dividers
  },

  // ─── Typography (8% of all UI) ────────────────────────────────────────────
  white: {
    DEFAULT: "#F5F5F7",   // primary text
    muted: "#8A8A9A",     // secondary text, labels
    ghost: "#3A3A4A",     // placeholder text
  },

  // ─── Action Accents — LIVING COLORS (2% of all UI) ───────────────────────
  lime: {
    DEFAULT: "#CCFF00",   // ALIGNMENT MODE — on track, streak active
    dim: "#99BF00",       // dimmed lime for hover/pressed
    glow: "rgba(204, 255, 0, 0.15)",    // glow halos
    glowStrong: "rgba(204, 255, 0, 0.3)", // active glow rings
  },

  amber: {
    DEFAULT: "#FF6B00",   // RELAPSE RISK MODE — slacking, high-risk event
    dim: "#CC5500",       // dimmed amber for hover/pressed
    glow: "rgba(255, 107, 0, 0.15)",    // warning glow halos
    glowStrong: "rgba(255, 107, 0, 0.3)", // danger glow rings
  },

  // ─── Semantic Aliases ─────────────────────────────────────────────────────
  status: {
    aligned: "#CCFF00",   // alias → lime.DEFAULT
    warning: "#FF6B00",   // alias → amber.DEFAULT
    danger: "#FF2D2D",    // extreme — forfeit / breach
    safe: "#1AFF8C",      // recovery mode / slipped-up state
  },

  // ─── Archer Signup Specific ───────────────────────────────────────────────
  archer: {
    arrowShaft: "#CCFF00",        // arrow crystallizes lime as user types
    bowString: "#8A8A9A",         // neutral when not drawn
    bowStringTaut: "#FF6B00",     // snaps to amber on Hardcore
    bullseye: "#CCFF00",          // target glow
    wind: "rgba(255, 107, 0, 0.4)", // wind/rain particle color on Hardcore
    scopeOverlay: "#CCFF00",      // precision guide lines after partner chosen
  },
} as const;

// ─── Accountability Tier Colors ─────────────────────────────────────────────
export const tierColors = {
  soft: {
    accent: colors.white.muted,
    glow: "rgba(138, 138, 154, 0.15)",
    label: "Soft",
  },
  firm: {
    accent: colors.lime.DEFAULT,
    glow: colors.lime.glow,
    label: "Firm",
  },
  hardcore: {
    accent: colors.amber.DEFAULT,
    glow: colors.amber.glow,
    label: "Hardcore",
  },
} as const;

// ─── Dashboard UI State ──────────────────────────────────────────────────────
export const uiState = {
  alignment: {
    accent: colors.lime.DEFAULT,
    glow: colors.lime.glowStrong,
    bg: colors.obsidian.DEFAULT,
    label: "Aligned",
  },
  warning: {
    accent: colors.amber.DEFAULT,
    glow: colors.amber.glowStrong,
    bg: "#120A00",          // obsidian shifted warm for slacking state
    label: "At Risk",
  },
  recovery: {
    accent: colors.status.safe,
    glow: "rgba(26, 255, 140, 0.2)",
    bg: "#00120A",          // obsidian shifted green for recovery state
    label: "Recovery",
  },
  forfeit: {
    accent: colors.status.danger,
    glow: "rgba(255, 45, 45, 0.25)",
    bg: "#120000",
    label: "Forfeited",
  },
} as const;

// ─── Typography Scale ────────────────────────────────────────────────────────
export const typography = {
  // Display — used in hero, signup steps, big moments
  display: {
    xl: "clamp(3rem, 8vw, 7rem)",
    lg: "clamp(2.25rem, 5vw, 4rem)",
    md: "clamp(1.75rem, 3.5vw, 2.5rem)",
  },
  // Body — reading, descriptions
  body: {
    lg: "1.125rem",
    md: "1rem",
    sm: "0.875rem",
    xs: "0.75rem",
  },
  // Tracking
  tracking: {
    tight: "-0.04em",
    normal: "0em",
    wide: "0.08em",
    widest: "0.2em",
  },
  weight: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    black: "900",
  },
} as const;

// ─── Animation Durations ─────────────────────────────────────────────────────
export const motion = {
  instant: "100ms",
  fast: "200ms",
  normal: "350ms",
  slow: "600ms",
  dramatic: "1200ms",     // arrow flight, dashboard explosion
  easing: {
    sharp: "cubic-bezier(0.25, 0, 0, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// ─── Spacing (supplements Tailwind) ─────────────────────────────────────────
export const spacing = {
  section: "clamp(4rem, 10vw, 8rem)",
  container: "clamp(1.25rem, 5vw, 2rem)",
} as const;

// ─── Type exports ─────────────────────────────────────────────────────────────
export type TierKey = keyof typeof tierColors;
export type UIStateKey = keyof typeof uiState;
export type ColorToken = typeof colors;