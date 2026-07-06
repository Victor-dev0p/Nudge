"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { colors, motion as motionTokens } from "@/lib/theme";

type ViewState = "login" | "forgot";

export default function LoginClient() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed.";
      if (
        message.includes("user-not-found") ||
        message.includes("wrong-password") ||
        message.includes("invalid-credential")
      ) {
        setError("Incorrect email or password.");
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch {
      setError("Couldn't send reset email. Check the address and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: `radial-gradient(ellipse at 50% 0%, rgba(204,255,0,0.05) 0%, ${colors.obsidian.DEFAULT} 55%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)",
      }}
    >
      {/* Wordmark */}
      <div style={{ position: "absolute", top: "clamp(1rem, 3vw, 2rem)", left: "clamp(1rem, 4vw, 2rem)" }}>
        <a
          href="/"
          style={{
            fontFamily: "monospace",
            fontWeight: 900,
            fontSize: "1.125rem",
            letterSpacing: "0.2em",
            color: colors.lime.DEFAULT,
            textTransform: "uppercase" as const,
            textDecoration: "none",
          }}
        >
          NUDGE
        </a>
      </div>

      <div style={{ width: "100%", maxWidth: "420px" }}>
        {view === "login" ? (
          <>
            <div style={{ marginBottom: "2rem" }}>
              <h1
                style={{
                  fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
                  fontWeight: 900,
                  color: colors.white.DEFAULT,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  marginBottom: "0.5rem",
                }}
              >
                Back to your{" "}
                <span style={{ color: colors.lime.DEFAULT }}>target.</span>
              </h1>
              <p style={{ color: colors.white.muted, fontSize: "0.9rem" }}>
                Log in and pick up where the arrow left off.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  label: "Email",
                  value: email,
                  onChange: setEmail,
                  type: "email",
                  placeholder: "you@example.com",
                },
                {
                  label: "Password",
                  value: password,
                  onChange: setPassword,
                  type: "password",
                  placeholder: "Your password",
                },
              ].map((field) => (
                <div key={field.label}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: colors.white.muted,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase" as const,
                      marginBottom: "0.4rem",
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: colors.obsidian.surface,
                      border: `1.5px solid ${colors.obsidian.border}`,
                      borderRadius: "10px",
                      color: colors.white.DEFAULT,
                      fontSize: "0.95rem",
                      outline: "none",
                      transition: `border-color ${motionTokens.fast}`,
                      boxSizing: "border-box" as const,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = `${colors.lime.DEFAULT}60`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.obsidian.border;
                    }}
                  />
                </div>
              ))}

              <div style={{ textAlign: "right" as const, marginTop: "-0.25rem" }}>
                <button
                  onClick={() => {
                    setView("forgot");
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: colors.white.muted,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    padding: 0,
                    transition: `color ${motionTokens.fast}`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.lime.DEFAULT)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = colors.white.muted)}
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: colors.status.danger,
                    padding: "0.75rem 1rem",
                    background: "rgba(255,45,45,0.08)",
                    borderRadius: "8px",
                    border: `1px solid rgba(255,45,45,0.2)`,
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.9375rem",
                  borderRadius: "10px",
                  border: "none",
                  background: colors.lime.DEFAULT,
                  color: colors.obsidian.DEFAULT,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: isLoading ? "wait" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                  letterSpacing: "-0.01em",
                  transition: `all ${motionTokens.fast}`,
                  marginTop: "0.25rem",
                }}
              >
                {isLoading ? "Logging in..." : "Back to the Target →"}
              </button>
            </div>

            <p
              style={{
                marginTop: "1.75rem",
                fontSize: "0.875rem",
                color: colors.white.muted,
                textAlign: "center" as const,
              }}
            >
              No account yet?{" "}
              <a
                href="/signup"
                style={{
                  color: colors.lime.DEFAULT,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Draw the bow
              </a>
            </p>
          </>
        ) : (
          /* ── Forgot password view ── */
          <>
            <div style={{ marginBottom: "2rem" }}>
              <button
                onClick={() => {
                  setView("login");
                  setError("");
                  setResetSent(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: colors.white.muted,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                ← Back to login
              </button>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  fontWeight: 900,
                  color: colors.white.DEFAULT,
                  letterSpacing: "-0.03em",
                  marginBottom: "0.5rem",
                }}
              >
                Reset your{" "}
                <span style={{ color: colors.lime.DEFAULT }}>aim.</span>
              </h2>
              <p style={{ color: colors.white.muted, fontSize: "0.9rem" }}>
                Enter your email and we&apos;ll send a reset link.
              </p>
            </div>

            {resetSent ? (
              <div
                style={{
                  padding: "1.25rem",
                  background: `${colors.lime.DEFAULT}12`,
                  border: `1.5px solid ${colors.lime.DEFAULT}40`,
                  borderRadius: "12px",
                  textAlign: "center" as const,
                }}
              >
                <p
                  style={{
                    color: colors.lime.DEFAULT,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  Reset link sent.
                </p>
                <p style={{ color: colors.white.muted, fontSize: "0.85rem" }}>
                  Check your inbox and follow the link to reset your password.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: colors.obsidian.surface,
                    border: `1.5px solid ${colors.obsidian.border}`,
                    borderRadius: "10px",
                    color: colors.white.DEFAULT,
                    fontSize: "0.95rem",
                    outline: "none",
                    boxSizing: "border-box" as const,
                  }}
                />

                {error && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: colors.status.danger,
                      padding: "0.75rem 1rem",
                      background: "rgba(255,45,45,0.08)",
                      borderRadius: "8px",
                      border: `1px solid rgba(255,45,45,0.2)`,
                      margin: 0,
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "0.9375rem",
                    borderRadius: "10px",
                    border: "none",
                    background: colors.lime.DEFAULT,
                    color: colors.obsidian.DEFAULT,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: isLoading ? "wait" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                    letterSpacing: "-0.01em",
                    transition: `all ${motionTokens.fast}`,
                  }}
                >
                  {isLoading ? "Sending..." : "Send Reset Link →"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        input { font-family: inherit; }
      `}</style>
    </div>
  );
}