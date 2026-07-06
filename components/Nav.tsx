// components/Nav.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { colors, motion as motionTokens } from "@/lib/theme";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        background: scrolled ? `${colors.obsidian.DEFAULT}e8` : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${colors.obsidian.border}` : "1px solid transparent",
        transition: `all ${motionTokens.normal} ${motionTokens.easing.ease}`,
      }}
    >
      <a href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="/transparent-logo.png"
          alt="Nudge"
          width={96}
          height={32}
          style={{ objectFit: "contain" }}
          priority
        />
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 3vw, 2rem)" }}>
        <NavLink href="#how">How it works</NavLink>
        <NavLink href="#community">Community</NavLink>
        <NavLink href="/login">Log in</NavLink>
        <a
          href="/signup"
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: colors.obsidian.DEFAULT,
            background: colors.lime.DEFAULT,
            padding: "0.5rem 1.125rem",
            borderRadius: "8px",
            transition: `all ${motionTokens.fast}`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = colors.lime.dim)}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.lime.DEFAULT)}
        >
          Draw the bow
        </a>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        fontSize: "0.85rem",
        color: colors.white.muted,
        transition: `color ${motionTokens.fast}`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = colors.white.DEFAULT)}
      onMouseLeave={(e) => (e.currentTarget.style.color = colors.white.muted)}
    >
      {children}
    </a>
  );
}