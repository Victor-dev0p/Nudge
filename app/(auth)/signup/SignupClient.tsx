"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { colors, motion as motionTokens } from "@/lib/theme";
import type { SignupFlowState, NudgeUser, NudgeGoal } from "@/types/user";
import { COLLECTIONS } from "@/types/user";

import { StepIndicator } from "@/components/signup/StepIndicator";
import { ArcherVisual } from "@/components/signup/ArcherVisual";
import { StepManifest } from "@/components/signup/StepManifest";
import { StepWeight } from "@/components/signup/StepWeight";
import { StepAlliance } from "@/components/signup/StepAlliance";
import { HardcoreParticles, LaunchOverlay, SignupKeyframes } from "@/components/signup/signup.ui";

const INITIAL_STATE: SignupFlowState = {
  step: 1,
  goalText: "",
  goalCategory: null,
  tier: null,
  stakeAmount: 0,
  partnerType: "none",
  partnerEmail: "",
  partnerId: "",
};

export default function SignupClient() {
  const router = useRouter();
  const [flow, setFlow] = useState<SignupFlowState>(INITIAL_STATE);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [launched, setLaunched] = useState(false);
  const goalInputRef = useRef<HTMLTextAreaElement>(null);

  const accentColor =
    flow.tier === "hardcore"
      ? colors.amber.DEFAULT
      : flow.tier === "firm"
      ? colors.lime.DEFAULT
      : flow.tier === "soft"
      ? colors.white.muted
      : colors.lime.DEFAULT;

  const isHardcore = flow.tier === "hardcore";

  // ─── Username availability check (debounced) ──────────────────────────────
  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.length < 3) return;
    const q = query(
      collection(db, COLLECTIONS.users),
      where("username", "==", value.toLowerCase())
    );
    const snap = await getDocs(q);
    setUsernameError(snap.empty ? "" : "This handle is already taken.");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => checkUsername(username), 600);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  useEffect(() => {
    if (flow.step === 1) goalInputRef.current?.focus();
  }, [flow.step]);

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const goToStep = (step: 1 | 2 | 3) => {
    setError("");
    setFlow((prev) => ({ ...prev, step }));
  };

  const validateStep1 = (): boolean => {
    if (!flow.goalText.trim() || flow.goalText.trim().length < 10) {
      setError("Give your goal more detail — at least 10 characters.");
      return false;
    }
    if (!flow.goalCategory) {
      setError("Select a category for your goal.");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!flow.tier) {
      setError("Choose your accountability tier to proceed.");
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!email || !password || !displayName || !username) {
      setError("All fields are required.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (username.length < 3 || !/^[a-z0-9_]+$/.test(username)) {
      setError("Username must be at least 3 characters — lowercase letters, numbers, underscores only.");
      return false;
    }
    if (usernameError) {
      setError(usernameError);
      return false;
    }
    return true;
  };

  // ─── Final submit ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setIsLoading(true);
    setError("");

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = credential;

      await updateProfile(user, { displayName });

      const now = Date.now();

      // Build the user doc — only include optional fields when they have real values.
      // (avoids "undefined" type mismatches against optional NudgeUser fields)
      const nudgeUser: NudgeUser = {
        uid: user.uid,
        email: user.email ?? email,
        displayName,
        username: username.toLowerCase(),
        role: "user",
        status: "active",
        createdAt: now,
        lastActiveAt: now,
        totalStreak: 0,
        lifetimeCompletionRate: 0,
        activeTier: flow.tier!,
        followerCount: 0,
        followingCount: 0,
        sponsorCount: 0,
        sponseeCount: 0,
        feedWeights: {
          primaryCategory: flow.goalCategory!,
          weights: { [flow.goalCategory!]: 60 },
          globalDiscovery: 10,
        },
        walletBalance: 0,
        walletCurrency: "NGN",
        totalEarned: 0,
        totalForfeited: 0,
        blockedUids: [],
        reportedUids: [],
        privacyLevel: "public",
      };

      await setDoc(doc(db, COLLECTIONS.users, user.uid), nudgeUser);

      // Build the first goal — same rule, optional fields only added when present.
      const goalId = `${user.uid}_goal_${now}`;
      const firstGoal: NudgeGoal = {
        id: goalId,
        text: flow.goalText.trim(),
        category: flow.goalCategory!,
        tier: flow.tier!,
        status: "active",
        createdAt: now,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        microTasks: [],
        partnerType: flow.partnerType,
        ...(flow.partnerEmail ? { partnerEmail: flow.partnerEmail } : {}),
        ...(flow.partnerId ? { partnerId: flow.partnerId } : {}),
        ...(flow.stakeAmount > 0
          ? { stakeAmount: flow.stakeAmount, stakeCurrency: "NGN" as const }
          : {}),
      };

      await setDoc(doc(db, COLLECTIONS.goals(user.uid), goalId), firstGoal);

      setLaunched(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(
        message.includes("email-already-in-use")
          ? "An account with this email already exists."
          : message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const goalProgress = Math.min(flow.goalText.length / 60, 1);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: isHardcore
          ? `radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.08) 0%, ${colors.obsidian.DEFAULT} 60%)`
          : `radial-gradient(ellipse at 50% 0%, rgba(204,255,0,0.06) 0%, ${colors.obsidian.DEFAULT} 60%)`,
        transition: `background ${motionTokens.slow} ${motionTokens.easing.ease}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isHardcore && <HardcoreParticles />}
      {launched && <LaunchOverlay accentColor={accentColor} />}

      <div style={{ position: "absolute", top: "clamp(1rem, 3vw, 2rem)", left: "clamp(1rem, 4vw, 2rem)" }}>
        <span className="nudge-wordmark" style={{ fontSize: "1.125rem", color: accentColor }}>
          NUDGE
        </span>
      </div>

      <StepIndicator currentStep={flow.step} accentColor={accentColor} />

      <ArcherVisual
        step={flow.step}
        tier={flow.tier}
        goalProgress={goalProgress}
        hasPartner={flow.partnerType !== "none"}
        launched={launched}
        accentColor={accentColor}
      />

      <div style={{ width: "100%", maxWidth: "520px", marginTop: "2rem" }}>
        {flow.step === 1 && (
          <StepManifest
            flow={flow}
            setFlow={setFlow}
            error={error}
            setError={setError}
            goalInputRef={goalInputRef}
            accentColor={accentColor}
            onNext={() => validateStep1() && goToStep(2)}
          />
        )}

        {flow.step === 2 && (
          <StepWeight
            flow={flow}
            setFlow={setFlow}
            error={error}
            setError={setError}
            accentColor={accentColor}
            onBack={() => goToStep(1)}
            onNext={() => validateStep2() && goToStep(3)}
          />
        )}

        {flow.step === 3 && (
          <StepAlliance
            flow={flow}
            setFlow={setFlow}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            displayName={displayName}
            setDisplayName={setDisplayName}
            username={username}
            setUsername={setUsername}
            usernameError={usernameError}
            error={error}
            isLoading={isLoading}
            accentColor={accentColor}
            isHardcore={isHardcore}
            onBack={() => goToStep(2)}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: colors.white.muted }}>
        Already in?{" "}
        <a
          href="/login"
          style={{ color: accentColor, textDecoration: "none", fontWeight: 600 }}
        >
          Log in
        </a>
      </p>

      <SignupKeyframes />
    </div>
  );
}