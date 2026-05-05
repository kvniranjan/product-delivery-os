"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { FileText, PlusCircle, Route, Sparkles } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button, EmptyState, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function DashboardClient() {
  const projects = useQuery(api.projects.list);
  const projectList = (projects ?? []) as Array<{
    _id: string;
    name: string;
    domain?: string;
    description?: string;
    updatedAt: number;
  }>;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Create a project, pick a workflow, generate a prompt, and save the output as an artifact."
        action={
          <Button asChild>
            <Link href="/projects/new">
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              New project
            </Link>
          </Button>
        }
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-border bg-[#111827] p-6 text-white command-shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-white/50">Delivery command board</p>
              <h2 className="mt-3 font-heading text-2xl font-bold">Move from context to reviewed artifact.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Keep beta work sanitized, workflow-led, provider-aware, and traceable from raw input to reviewed artifact.
              </p>
            </div>
            <Sparkles className="h-7 w-7 text-[#7dd3d8]" aria-hidden="true" />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {["Project", "Workflow", "Prompt", "Artifact"].map((step, index) => (
              <div key={step} className="rounded-md border border-white/10 bg-white/[0.06] p-3">
                <p className="text-xs font-bold text-white/40">0{index + 1}</p>
                <p className="mt-1 text-sm font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 soft-shadow">
          <Route className="h-7 w-7 text-[#006d77]" aria-hidden="true" />
          <p className="mt-4 font-heading text-lg font-bold text-slate-950">Beta focus</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Test whether the workflow prompts help real BA/PO work feel clearer, faster, and easier to review.
          </p>
        </div>
      </section>

      {projects === undefined ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      ) : projectList.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No projects yet"
          description="Start with one sanitized beta project. You can add context, run workflows, and save artifacts from there."
          action={
            <Button asChild>
              <Link href="/projects/new">Create project</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectList.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`} className="block">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-[#006d77]">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.domain || "No domain set"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                    {project.description || "Open this project to select a beta workflow."}
                  </p>
                  <p className="mt-4 text-xs font-semibold text-slate-500">Updated {formatDate(project.updatedAt)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
