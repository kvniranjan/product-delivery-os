"use client";

import { useQuery } from "convex/react";
import { BarChart3 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { EmptyState, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function AdminClient() {
  const summary = useQuery(api.feedback.adminSummary);
  const typedSummary = summary as
    | undefined
    | null
    | {
        totalUsers: number;
        totalProjects: number;
        totalWorkflowRuns: number;
        workflowUsage: Record<string, number>;
        averageUsefulnessScore: number;
        averageEaseOfUseScore: number;
        averageOutputQualityScore: number;
        recentFeedback: Array<{
          workflowId: string;
          comments?: string;
          weakestPart?: string;
          missingFeature?: string;
          createdAt: number;
        }>;
      };

  if (typedSummary === undefined) {
    return (
      <>
        <PageHeader title="Admin Feedback Dashboard" />
        <div className="h-48 animate-pulse rounded-lg bg-slate-200" />
      </>
    );
  }

  if (typedSummary === null) {
    return (
      <>
        <PageHeader title="Admin Feedback Dashboard" />
        <EmptyState
          icon={BarChart3}
          title="Admin access required"
          description="Your email is not listed in the ADMIN_EMAILS Convex environment variable."
        />
      </>
    );
  }

  const cards = [
    ["Total users", typedSummary.totalUsers],
    ["Total projects", typedSummary.totalProjects],
    ["Workflow runs", typedSummary.totalWorkflowRuns],
    ["Avg usefulness", typedSummary.averageUsefulnessScore.toFixed(1)],
    ["Avg ease of use", typedSummary.averageEaseOfUseScore.toFixed(1)],
    ["Avg output quality", typedSummary.averageOutputQualityScore.toFixed(1)]
  ];

  return (
    <>
      <PageHeader
        title="Admin Feedback Dashboard"
        description="Aggregate beta usage and feedback. No keystrokes or AI-provider content analytics are collected."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm text-slate-600">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold text-slate-950">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workflow usage by type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(typedSummary.workflowUsage).length === 0 ? (
              <p className="text-sm text-slate-600">No workflow usage yet.</p>
            ) : (
              Object.entries(typedSummary.workflowUsage).map(([workflow, count]) => (
                <div key={workflow}>
                  <div className="mb-1 flex justify-between gap-4 text-sm font-semibold">
                    <span>{workflow}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-sky-800"
                      style={{ width: `${Math.min(100, Number(count) * 12)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent feedback comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {typedSummary.recentFeedback.length === 0 ? (
              <p className="text-sm text-slate-600">No feedback submitted yet.</p>
            ) : (
              typedSummary.recentFeedback.map((item, index) => (
                <div key={`${item.workflowId}-${item.createdAt}-${index}`} className="border-b border-border pb-4 last:border-b-0">
                  <p className="text-sm font-semibold text-slate-950">{item.workflowId}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {item.comments || item.weakestPart || item.missingFeature || "No comment provided."}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
