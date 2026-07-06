import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Log In — Nudge",
  description: "Back to your targets. Log in to Nudge.",
  openGraph: {
    title: "Log In — Nudge",
    description: "Back to your targets. Log in to Nudge.",
    type: "website",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}