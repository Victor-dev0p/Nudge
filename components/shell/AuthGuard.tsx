// components/shell/AuthGuard.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { colors } from "@/lib/theme";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // While Firebase checks session — show minimal branded loader
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: colors.obsidian.DEFAULT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <span
          className="nudge-wordmark"
          style={{ fontSize: "1rem", color: colors.lime.DEFAULT }}
        >
          NUDGE
        </span>
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: `2px solid ${colors.obsidian.border}`,
            borderTopColor: colors.lime.DEFAULT,
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not logged in — render nothing while redirect fires
  if (!user) return null;

  // Authenticated — render children
  return <>{children}</>;
}