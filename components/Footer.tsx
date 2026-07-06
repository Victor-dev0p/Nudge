// components/Footer.tsx

"use client";

import React from "react";
import Image from "next/image";
import { colors, motion as motionTokens } from "@/lib/theme";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "2rem clamp(1rem, 5vw, 3rem)",
        borderTop: `1px solid ${colors.obsidian.border}`,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <a href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="/colored-logo.png"
          alt="Nudge"
          width={80}
          height={28}
          style={{ objectFit: "contain" }}
        />
      </a>

      <p style={{ fontSize: "0.8rem", color: colors.white.ghost, margin: 0 }}>
        © {new Date().getFullYear()} Nudge. All rights reserved.
      </p>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        {["Privacy", "Terms", "Contact"].map((link) => (
          <a
            key={link}
            href="#"
            style={{
              fontSize: "0.8rem",
              color: colors.white.ghost,
              transition: `color ${motionTokens.fast}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.white.muted)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.white.ghost)}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}