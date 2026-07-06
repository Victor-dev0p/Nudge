/**
 * NUDGE — Core TypeScript Types
 * These types map 1:1 to Firestore document structures.
 * Every field here is intentional — nothing gets stored that isn't used.
 */

import type { TierKey } from "@/lib/theme";

// ─── Accountability Tier ──────────────────────────────────────────────────────
export type AccountabilityTier = TierKey; // "soft" | "firm" | "hardcore"

// ─── Goal — one macro goal a user is tracking ────────────────────────────────
export interface NudgeGoal {
  id: string;
  text: string;                           // "Write my book" / "Stay sober 30 days"
  category: GoalCategory;
  tier: AccountabilityTier;
  status: GoalStatus;
  createdAt: number;                      // epoch ms
  deadlineAt?: number;                    // optional hard deadline
  currentStreak: number;                  // consecutive days of verified proof
  longestStreak: number;
  completionRate: number;                 // 0–100 lifetime %
  microTasks: MicroTask[];               // AI-generated breakdown
  partnerId?: string;                     // UID of accountability partner
  partnerType: PartnerType;
  partnerEmail?: string;                  // set when partnerType === "peer_invite", before partner accepts
  stakeAmount?: number;                   // amount locked in pool (cents/kobo)
  stakeCurrency?: "USD" | "NGN";
}

// ─── Goal Category ────────────────────────────────────────────────────────────
export type GoalCategory =
  | "tech_execution"
  | "business_strategy"
  | "health_fitness"
  | "mental_health_trauma"
  | "addiction_recovery"
  | "learning_skill"
  | "creative"
  | "financial"
  | "relationship"
  | "other";

// ─── Goal Status ──────────────────────────────────────────────────────────────
export type GoalStatus =
  | "active"           // normal, on track
  | "at_risk"          // missed a deadline, grace period active
  | "slacking_l1"      // Level 1: internal pressure (0–4h)
  | "slacking_l2"      // Level 2: social exposure (4–24h)
  | "slacking_l3"      // Level 3: disruption + forfeit countdown (24–48h)
  | "recovery"         // "I slipped up" button pressed
  | "forfeited"        // stake lost, streak dead
  | "completed"        // goal fully achieved
  | "paused";

// ─── Micro Task — AI-generated step ──────────────────────────────────────────
export interface MicroTask {
  id: string;
  text: string;
  status: "pending" | "in_progress" | "awaiting_review" | "completed" | "rejected";
  proofRequired: boolean;
  proofType: ProofType;
  proofUrl?: string;                      // Firebase Storage URL
  proofVerifiedBy?: "sponsor" | "ai" | "auto";
  dueAt?: number;
  completedAt?: number;
}

// ─── Proof Type ───────────────────────────────────────────────────────────────
export type ProofType =
  | "live_video"         // 30s live camera capture (no gallery upload)
  | "photo"              // static photo proof
  | "text_log"           // written entry
  | "github_commit"      // commit SHA string
  | "external_link"      // URL to published work
  | "none";              // low-stakes tasks

// ─── Partner Type ─────────────────────────────────────────────────────────────
export type PartnerType =
  | "none"                 // no partner, AI-only
  | "peer_invite"          // friend via unique link
  | "community_peer"       // matched from feed
  | "certified_practitioner"; // paid marketplace sponsor

// ─── NudgeUser — main Firestore document at /users/{uid} ─────────────────────
export interface NudgeUser {
  uid: string;
  email: string;
  displayName: string;
  username: string;                        // @handle, unique
  avatarUrl?: string;                      // Firebase Storage URL
  bio?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: number;
  lastActiveAt: number;

  // Profile vitals (computed, updated on task completion)
  totalStreak: number;                     // best active streak across all goals
  lifetimeCompletionRate: number;          // 0–100
  activeTier: AccountabilityTier;         // highest tier among active goals

  // Social
  followerCount: number;
  followingCount: number;
  sponsorCount: number;                    // how many they sponsor
  sponseeCount: number;                    // how many sponsor them

  // Feed preferences
  feedWeights: FeedWeights;

  // Financials
  walletBalance: number;                   // in smallest unit (cents/kobo)
  walletCurrency: "USD" | "NGN";
  totalEarned: number;                     // lifetime from pool wins
  totalForfeited: number;                  // lifetime losses

  // Practitioner fields (only populated if role === "practitioner")
  practitioner?: PractitionerProfile;

  // Privacy & Safety
  blockedUids: string[];
  reportedUids: string[];
  privacyLevel: "public" | "community" | "private";
}

// ─── User Role ────────────────────────────────────────────────────────────────
export type UserRole =
  | "user"               // standard member
  | "practitioner"       // verified certified sponsor
  | "admin";             // platform admin

// ─── User Status ──────────────────────────────────────────────────────────────
export type UserStatus =
  | "onboarding"         // mid-signup, hasn't completed archer flow
  | "active"
  | "suspended"
  | "banned";

// ─── Feed Weights — drive the algorithmic mix ─────────────────────────────────
export interface FeedWeights {
  // Keys match GoalCategory, values are 0–100 representing % weight
  primaryCategory: GoalCategory;
  weights: Partial<Record<GoalCategory, number>>;
  globalDiscovery: number;                 // always 10 by default
}

// ─── Certified Practitioner Profile ──────────────────────────────────────────
export interface PractitionerProfile {
  specializations: GoalCategory[];
  credentials: PractitionerCredential[];
  bondAmount: number;                       // security deposit held in escrow
  bondCurrency: "USD" | "NGN";
  verificationStatus: "pending_review" | "approved" | "suspended" | "banned";
  approvedAt?: number;
  rating: number;                           // 0–5, averaged from sponsee reviews
  reviewCount: number;
  successRate: number;                      // % of sponsees who hit their goals
  activeSponseeCount: number;
  billingModel: PractitionerBillingModel;
  monthlyRate?: number;                     // for "flat_monthly"
  perEventRate?: number;                    // for "per_event"
  linkedInUrl?: string;
  websiteUrl?: string;
  licenseNumber?: string;
}

// ─── Practitioner Credential ─────────────────────────────────────────────────
export interface PractitionerCredential {
  id: string;
  type: "license" | "certification" | "degree" | "corporate_id";
  title: string;
  issuingBody: string;
  fileUrl: string;                          // Firebase Storage URL (private bucket)
  verifiedAt?: number;
  expiresAt?: number;
}

// ─── Practitioner Billing ─────────────────────────────────────────────────────
export type PractitionerBillingModel =
  | "flat_monthly"        // fixed fee, 15% platform cut
  | "per_event"           // per milestone sprint, 20% cut
  | "hybrid_stakes";      // low base + % of slacker pool, 10% cut

// ─── Signup Flow State — held in component, then written to Firestore on submit
export interface SignupFlowState {
  step: 1 | 2 | 3;
  // Step 1
  goalText: string;
  goalCategory: GoalCategory | null;
  // Step 2
  tier: AccountabilityTier | null;
  stakeAmount: number;
  // Step 3
  partnerType: PartnerType;
  partnerEmail?: string;
  partnerId?: string;
}

// ─── High-Risk Event ─────────────────────────────────────────────────────────
export interface HighRiskEvent {
  id: string;
  userId: string;
  goalId: string;
  description: string;                      // "Going to a party with alcohol"
  estimatedDurationMs: number;
  startAt: number;
  checkIn1DueAt: number;                    // on arrival
  checkIn2DueAt: number;                    // estimatedDuration + 1hr grace
  stakeAmount: number;
  status: "declared" | "check_in_1_pending" | "check_in_1_done" | "check_in_2_pending" | "completed" | "forfeited";
  checkIn1VideoUrl?: string;
  checkIn2VideoUrl?: string;
  aiRiskScore?: number;                     // 0–100, higher = more risk detected
}

// ─── Chat Message (Firestore: /chats/{chatId}/messages/{msgId}) ──────────────
export interface ChatMessage {
  id: string;
  senderId: string;
  type: "text" | "voice_note" | "proof_card" | "system_alert" | "emergency_sos";
  content?: string;
  proofCard?: ProofCard;
  sentAt: number;
  readAt?: number;
}

// ─── Proof Card — immutable verification block injected into DM thread ────────
export interface ProofCard {
  taskId: string;
  goalId: string;
  mediaUrl: string;                         // Firebase Storage — immutable
  mediaType: "video" | "photo" | "text";
  status: "awaiting_review" | "approved" | "rejected" | "auto_verified";
  verifiedBy?: "sponsor" | "ai";
  verifiedAt?: number;
  sponsorNotes?: string;
}

// ─── Pool (Stake Pool for a goal sprint) ─────────────────────────────────────
export interface StakePool {
  id: string;
  goalCategory: GoalCategory;
  startAt: number;
  endAt: number;
  totalStaked: number;                      // running total in smallest unit
  participantCount: number;
  successCount: number;
  slackerCount: number;
  forfeitedAmount: number;
  status: "open" | "active" | "settled" | "zero_slacker";
  nudgeCut: number;                         // 10% of forfeited
  practitionerCut: number;                  // 10% of forfeited
  userPayoutPool: number;                   // 80% of forfeited
  currency: "USD" | "NGN";
}

// ─── Feed Post ────────────────────────────────────────────────────────────────
export interface FeedPost {
  id: string;
  authorId: string;
  goalId?: string;
  goalCategory?: GoalCategory;
  type: "progress_log" | "relapse_slip" | "journal" | "milestone" | "system_alert";
  content: string;
  mediaUrls?: string[];
  proofVerified: boolean;
  fuelCount: number;                        // "likes"
  alignCount: number;                       // "retweets"
  replyCount: number;
  tier?: AccountabilityTier;
  isPublic: boolean;
  createdAt: number;
  expiresAt?: number;                       // for system-generated slacking alerts
}

// ─── Utility: Firestore collection paths ─────────────────────────────────────
export const COLLECTIONS = {
  users: "users",
  goals: (uid: string) => `users/${uid}/goals`,
  tasks: (uid: string, goalId: string) => `users/${uid}/goals/${goalId}/tasks`,
  chats: "chats",
  messages: (chatId: string) => `chats/${chatId}/messages`,
  posts: "posts",
  pools: "pools",
  poolMembers: (poolId: string) => `pools/${poolId}/members`,
  highRiskEvents: (uid: string) => `users/${uid}/highRiskEvents`,
  reports: "reports",
  practitionerApplications: "practitionerApplications",
} as const;