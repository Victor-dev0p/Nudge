// app/(public)/offline/page.tsx
"use client"

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0A0A0F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <span
        style={{
          fontWeight: 900,
          fontSize: "1rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#CCFF00",
          marginBottom: "2rem",
          display: "block",
        }}
      >
        NUDGE
      </span>

      <h1
        style={{
          fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
          fontWeight: 900,
          color: "#F5F5F7",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: "1rem",
        }}
      >
        No connection.
        <br />
        <span style={{ color: "#CCFF00" }}>The arrow still flies.</span>
      </h1>

      <p
        style={{
          fontSize: "0.95rem",
          color: "#8A8A9A",
          maxWidth: "360px",
          lineHeight: 1.65,
          marginBottom: "2rem",
        }}
      >
        You&apos;re offline. Check your connection and try again — your streak
        and progress are waiting exactly where you left them.
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "0.875rem 2rem",
          borderRadius: "10px",
          border: "none",
          background: "#CCFF00",
          color: "#0A0A0F",
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "-0.01em",
        }}
      >
        Try Again
      </button>
    </div>
  );
}