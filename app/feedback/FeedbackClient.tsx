"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { MessageSquareText } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button, EmptyState, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeedbackClient() {
  const projects = useQuery(api.projects.list);
  const projectList = (projects ?? []) as Array<{ _id: string; name: string }>;

  return (
    <>
      <PageHeader
        title="Feedback"
        description="Feedback is submitted after a workflow run so it stays tied to a real prompt and output."
      />
      {projects === undefined ? (
        <div className="h-40 animate-pulse rounded-lg bg-slate-200" />
      ) : projectList.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No project runs to review"
          description="Create a project and run a workflow first. Then you can submit feedback from the workflow runner."
          action={
            <Button asChild>
              <Link href="/projects/new">Create project</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projectList.map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm leading-6 text-slate-600">
                  Open the workspace, run a workflow, and submit feedback from the final step.
                </p>
                <Button asChild variant="secondary">
                  <Link href={`/projects/${project._id}`}>Open workspace</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
