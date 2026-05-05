import { AppShell } from "@/components/AppShell";
import { ConfigurationNotice } from "@/components/ConfigurationNotice";
import { UserSync } from "@/components/UserSync";
import { isAuthConfigured, isConvexConfigured } from "@/lib/env";
import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  if (!isAuthConfigured() || !isConvexConfigured()) {
    return <ConfigurationNotice area="Dashboard" />;
  }

  return (
    <AppShell>
      <UserSync />
      <DashboardClient />
    </AppShell>
  );
}
