import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ConfigurationNotice } from "@/components/ConfigurationNotice";
import { UserSync } from "@/components/UserSync";
import { isAuthConfigured, isConvexConfigured } from "@/lib/env";
import { getWorkflows } from "@/lib/workflows";
import { ProjectWorkspaceClient } from "./ProjectWorkspaceClient";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  if (!isAuthConfigured() || !isConvexConfigured()) {
    return <ConfigurationNotice area="Project workspace" />;
  }

  const { projectId } = await params;
  if (!projectId) notFound();

  return (
    <AppShell>
      <UserSync />
      <ProjectWorkspaceClient projectId={projectId} workflows={getWorkflows()} />
    </AppShell>
  );
}
