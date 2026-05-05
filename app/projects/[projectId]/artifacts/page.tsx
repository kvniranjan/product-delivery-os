import { AppShell } from "@/components/AppShell";
import { ConfigurationNotice } from "@/components/ConfigurationNotice";
import { UserSync } from "@/components/UserSync";
import { isAuthConfigured, isConvexConfigured } from "@/lib/env";
import { ArtifactLibraryClient } from "./ArtifactLibraryClient";

export default async function ArtifactsPage({ params }: { params: Promise<{ projectId: string }> }) {
  if (!isAuthConfigured() || !isConvexConfigured()) {
    return <ConfigurationNotice area="Artifact library" />;
  }

  const { projectId } = await params;
  return (
    <AppShell>
      <UserSync />
      <ArtifactLibraryClient projectId={projectId} />
    </AppShell>
  );
}
