import { AppShell } from "@/components/AppShell";
import { ConfigurationNotice } from "@/components/ConfigurationNotice";
import { UserSync } from "@/components/UserSync";
import { isAuthConfigured, isConvexConfigured } from "@/lib/env";
import { AccountClient } from "./AccountClient";

export default function AccountPage() {
  if (!isAuthConfigured() || !isConvexConfigured()) {
    return <ConfigurationNotice area="Manage Account" />;
  }

  return (
    <AppShell>
      <UserSync />
      <AccountClient />
    </AppShell>
  );
}
