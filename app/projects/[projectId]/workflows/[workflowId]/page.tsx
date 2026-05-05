import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ConfigurationNotice } from "@/components/ConfigurationNotice";
import { UserSync } from "@/components/UserSync";
import { isAuthConfigured, isConvexConfigured } from "@/lib/env";
import { getWorkflow } from "@/lib/workflows";
import { WorkflowRunnerClient } from "./WorkflowRunnerClient";

export default async function WorkflowRunnerPage({
  params
}: {
  params: Promise<{ projectId: string; workflowId: string }>;
}) {
  if (!isAuthConfigured() || !isConvexConfigured()) {
    return <ConfigurationNotice area="Workflow runner" />;
  }

  const { projectId, workflowId } = await params;
  const workflow = getWorkflow(workflowId);
  if (!workflow) notFound();

  return (
    <AppShell>
      <UserSync />
      <WorkflowRunnerClient projectId={projectId} workflow={workflow} />
    </AppShell>
  );
}
