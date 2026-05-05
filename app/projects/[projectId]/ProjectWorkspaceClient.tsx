"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { ArrowRight, FileText, Library } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button, EmptyState, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowDefinition } from "@/lib/workflows";
import { cn, formatDate } from "@/lib/utils";
import { workflowVisual } from "@/lib/workflowVisuals";

export function ProjectWorkspaceClient({
  projectId,
  workflows
}: {
  projectId: string;
  workflows: WorkflowDefinition[];
}) {
  const typedProjectId = projectId as Id<"projects">;
  const project = useQuery(api.projects.get, { projectId: typedProjectId });
  const runs = useQuery(api.workflowRuns.listByProject, { projectId: typedProjectId });
  const track = useMutation(api.events.track);
  const runList = (runs ?? []) as Array<{
    _id: string;
    workflowId: string;
    workflowTitle: string;
    status: string;
    updatedAt: number;
  }>;

  if (project === undefined) {
    return <div className="h-48 animate-pulse rounded-lg bg-slate-200" />;
  }

  if (project === null) {
    return <EmptyState title="Project not found" description="This project does not exist or you do not have access." />;
  }

  return (
    <>
      <PageHeader
        title={project.name}
        description={project.description || "Select a beta workflow and generate a self-contained prompt."}
        action={
          <Button asChild variant="secondary">
            <Link href={`/projects/${projectId}/artifacts`}>
              <Library className="h-4 w-4" aria-hidden="true" />
              Artifact library
            </Link>
          </Button>
        }
      />

      <section className="mb-8">
        <h2 className="mb-3 font-heading text-xl font-semibold text-slate-950">Beta workflows</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {workflows.map((workflow) => {
            const visual = workflowVisual(workflow.id);
            const Icon = visual.icon;
            return (
              <Card
                key={workflow.id}
                className={cn("overflow-hidden transition-all hover:-translate-y-0.5 hover:border-[var(--workflow)]", visual.className)}
              >
                <div className="h-1.5 bg-[var(--workflow)]" />
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-[var(--workflow-soft)] text-[var(--workflow)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle>{workflow.title}</CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    onClick={() => void track({ eventType: "workflow_selected", projectId: typedProjectId, workflowId: workflow.id })}
                  >
                    <Link href={`/projects/${projectId}/workflows/${workflow.id}`}>
                      Run workflow
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-xl font-semibold text-slate-950">Recent workflow runs</h2>
        {runs === undefined ? (
          <div className="h-32 animate-pulse rounded-lg bg-slate-200" />
        ) : runList.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No runs saved yet"
            description="Run a workflow to generate a prompt, paste AI output, and save the result."
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card soft-shadow">
            {runList.slice(0, 6).map((run) => (
              <div key={run._id} className="border-b border-border p-4 last:border-b-0">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{run.workflowTitle}</p>
                    <p className="text-sm text-slate-600">{run.status.replace("_", " ")} · {formatDate(run.updatedAt)}</p>
                  </div>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/projects/${projectId}/workflows/${run.workflowId}`}>Run again</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
