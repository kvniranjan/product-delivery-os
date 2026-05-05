import { AppShell } from "@/components/AppShell";
import { ConfigurationNotice } from "@/components/ConfigurationNotice";
import { UserSync } from "@/components/UserSync";
import { isAuthConfigured, isConvexConfigured } from "@/lib/env";
import { AdminClient } from "./AdminClient";

export default function AdminPage() {
  if (!isAuthConfigured() || !isConvexConfigured()) {
    return <ConfigurationNotice area="Admin dashboard" />;
  }

  return (
    <AppShell>
      <UserSync />
      <AdminClient />
    </AppShell>
  );
}
