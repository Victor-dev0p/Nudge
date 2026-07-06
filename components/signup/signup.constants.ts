import type { AccountabilityTier, GoalCategory } from "@/types/user";

export const SIGNUP_STEPS = [
  { number: 1 as const, label: "The Manifest" },
  { number: 2 as const, label: "The Weight" },
  { number: 3 as const, label: "The Alliance" },
];

export const TIERS: {
  key: AccountabilityTier;
  label: string;
  description: string;
  intensity: string;
}[] = [
  {
    key: "soft",
    label: "Soft",
    description: "Gentle reminders. No disruption. Light wind.",
    intensity: "The bow is held loosely. The wind is calm.",
  },
  {
    key: "firm",
    label: "Firm",
    description: "Partner alerts. Social accountability. Moderate pressure.",
    intensity: "The bow is half-drawn. The wind picks up.",
  },
  {
    key: "hardcore",
    label: "Hardcore",
    description: "Aggressive disruption. Public exposure. Financial stakes. Full storm.",
    intensity: "Full draw. The storm rages. You commit or you fall.",
  },
];

export const CATEGORIES: { key: GoalCategory; label: string; emoji: string }[] = [
  { key: "tech_execution",     label: "Tech / Dev",        emoji: "⚡" },
  { key: "business_strategy",  label: "Business",          emoji: "📈" },
  { key: "health_fitness",     label: "Health & Fitness",  emoji: "🔥" },
  { key: "mental_health_trauma", label: "Mental Health",   emoji: "🧠" },
  { key: "addiction_recovery", label: "Addiction Recovery",emoji: "🛡️" },
  { key: "learning_skill",     label: "Learning / Skill",  emoji: "🎯" },
  { key: "creative",           label: "Creative",          emoji: "✦"  },
  { key: "financial",          label: "Financial",         emoji: "💎" },
  { key: "relationship",       label: "Relationships",     emoji: "🤝" },
  { key: "other",              label: "Other",             emoji: "◎"  },
];

export const PARTNER_OPTIONS: {
  key: "none" | "peer_invite" | "community_peer" | "certified_practitioner";
  label: string;
  description: string;
}[] = [
  {
    key: "none",
    label: "AI Only",
    description: "Nudge AI watches over you. No human partner yet.",
  },
  {
    key: "peer_invite",
    label: "Invite a Friend",
    description: "Send a private link to someone you trust.",
  },
  {
    key: "community_peer",
    label: "Community Peer",
    description: "Matched from the Nudge community.",
  },
  {
    key: "certified_practitioner",
    label: "Certified Practitioner",
    description: "A verified professional from our marketplace.",
  },
];