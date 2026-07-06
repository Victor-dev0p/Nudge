// app/(main)/layout.tsx

import { AuthGuard } from "@/components/shell/AuthGuard";
import { AppShell } from "@/components/shell/AppShell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}