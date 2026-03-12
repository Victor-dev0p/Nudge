import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreakArcher - Hit Your Targets Daily",
  description: "Accountability app that keeps you on track. Set goals, build streaks, and stay accountable with partners who won't let you slack.",
  keywords: ["productivity", "accountability", "habits", "goals", "streak tracker", "daily goals"],
  authors: [{ name: "StreakArcher Team" }],
  openGraph: {
    title: "StreakArcher - Hit Your Targets Daily",
    description: "Build unstoppable daily habits with accountability partners",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreakArcher - Hit Your Targets Daily",
    description: "Build unstoppable daily habits with accountability partners",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}