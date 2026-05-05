import { AppShell } from "@/components/AppShell";
import { ConfigurationNotice } from "@/components/ConfigurationNotice";
import { UserSync } from "@/components/UserSync";
import { isAuthConfigured, isConvexConfigured } from "@/lib/env";
import { NewProjectClient } from "./NewProjectClient";

export default function NewProjectPage() {
  if (!isAuthConfigured() || !isConvexConfigured()) {
    return <ConfigurationNotice area="Create project" />;
  }

  return (
    <AppShell>
      <UserSync />
      <NewProjectClient />
    </AppShell>
  );
}
