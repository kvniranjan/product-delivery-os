import { AppShell } from "@/components/AppShell";
import { ConfigurationNotice } from "@/components/ConfigurationNotice";
import { UserSync } from "@/components/UserSync";
import { isAuthConfigured, isConvexConfigured } from "@/lib/env";
import { FeedbackClient } from "./FeedbackClient";

export default function FeedbackPage() {
  if (!isAuthConfigured() || !isConvexConfigured()) {
    return <ConfigurationNotice area="Feedback" />;
  }

  return (
    <AppShell>
      <UserSync />
      <FeedbackClient />
    </AppShell>
  );
}
