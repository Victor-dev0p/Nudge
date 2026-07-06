// (auth) route group layout — intentionally bare.
// Signup and Login own their own full-screen, immersive design.
// No Nav or Footer here by design — see app/(main)/layout.tsx for those.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}