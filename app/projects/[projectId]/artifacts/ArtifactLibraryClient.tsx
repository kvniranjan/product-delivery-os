"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Download, Library } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button, EmptyState, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function ArtifactLibraryClient({ projectId }: { projectId: string }) {
  const typedProjectId = projectId as Id<"projects">;
  const project = useQuery(api.projects.get, { projectId: typedProjectId });
  const artifacts = useQuery(api.artifacts.listByProject, { projectId: typedProjectId });
  const track = useMutation(api.events.track);
  const artifactList = (artifacts ?? []) as Array<{
    _id: string;
    artifactType: string;
    title: string;
    content: string;
    updatedAt: number;
  }>;

  function exportMarkdown(title: string, content: string) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    void track({ eventType: "artifact_exported", projectId: typedProjectId });
  }

  return (
    <>
      <PageHeader
        title="Artifact Library"
        description={project ? `Saved outputs for ${project.name}.` : "Saved workflow outputs by project."}
        action={
          <Button asChild variant="secondary">
            <Link href={`/projects/${projectId}`}>Back to workspace</Link>
          </Button>
        }
      />
      {artifacts === undefined ? (
        <div className="h-48 animate-pulse rounded-lg bg-slate-200" />
      ) : artifactList.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No artifacts yet"
          description="After saving a workflow output, save it as an artifact to keep it here."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {artifactList.map((artifact) => (
            <Card key={artifact._id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{artifact.title}</CardTitle>
                    <p className="mt-1 text-sm text-slate-600">
                      {artifact.artifactType} · {formatDate(artifact.updatedAt)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    aria-label={`Export ${artifact.title}`}
                    onClick={() => exportMarkdown(artifact.title, artifact.content)}
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-800">
                  {artifact.content}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
