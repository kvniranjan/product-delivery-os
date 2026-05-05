"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { Check, Clipboard, Copy, PanelRight, Save, Sparkles } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { buildSelfContainedPrompt } from "@/lib/promptBuilder";
import type { AIProvider, AnalyzeDeliveryInputResponse, WorkflowType } from "@/lib/ai";
import type { WorkflowDefinition } from "@/lib/workflows";
import { workflowVisual } from "@/lib/workflowVisuals";
import { cn } from "@/lib/utils";

const aiTools = ["ChatGPT", "Claude", "Gemini", "Copilot", "Codex", "Cursor", "Other"];
const providerOptions = [
  { label: "Default", value: "default" },
  { label: "OpenAI", value: "openai" },
  { label: "Anthropic", value: "anthropic" },
  { label: "Gemini", value: "gemini" }
] as const;

const workflowTypeById: Record<string, WorkflowType> = {
  "requirement-intake": "requirement_intake",
  "impact-analysis": "impact_analysis",
  "story-builder": "story_generation",
  "acceptance-criteria": "acceptance_criteria",
  "test-scenario-builder": "uat_analysis",
  "change-request-analysis": "impact_analysis",
  "stakeholder-brief": "stakeholder_update",
  "release-readiness": "release_update"
};

type ProviderOption = (typeof providerOptions)[number]["value"];

type AnalyzeActionResponse =
  | {
      ok: true;
      provider: AIProvider;
      model: string;
      data: AnalyzeDeliveryInputResponse;
    }
  | {
      ok: false;
      error: { code: string; message: string };
    };

export function WorkflowRunnerClient({
  projectId,
  workflow
}: {
  projectId: string;
  workflow: WorkflowDefinition;
}) {
  const typedProjectId = projectId as Id<"projects">;
  const project = useQuery(api.projects.get, { projectId: typedProjectId });
  const createRun = useMutation(api.workflowRuns.create);
  const saveOutput = useMutation(api.workflowRuns.saveOutput);
  const markReviewed = useMutation(api.workflowRuns.markReviewed);
  const createArtifact = useMutation(api.artifacts.create);
  const submitFeedback = useMutation(api.feedback.submit);
  const track = useMutation(api.events.track);
  const analyzeDeliveryInputForCurrentUser = useAction(api.aiAnalysis.analyzeDeliveryInputForCurrentUser);

  const [inputText, setInputText] = useState("");
  const [optionalContext, setOptionalContext] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [runId, setRunId] = useState<Id<"workflowRuns"> | null>(null);
  const [aiToolUsed, setAiToolUsed] = useState("ChatGPT");
  const [aiOutput, setAiOutput] = useState("");
  const [aiProviderOption, setAiProviderOption] = useState<ProviderOption>("default");
  const [aiDraftText, setAiDraftText] = useState("");
  const [aiDraftMeta, setAiDraftMeta] = useState<{ provider: AIProvider; model: string } | null>(null);
  const [reviewedByUser, setReviewedByUser] = useState(false);
  const [artifactTitle, setArtifactTitle] = useState(`${workflow.title} Output`);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scores, setScores] = useState({ usefulness: 4, ease: 4, quality: 4 });
  const [wouldUseAgain, setWouldUseAgain] = useState(true);
  const [comments, setComments] = useState("");
  const visual = workflowVisual(workflow.id);
  const VisualIcon = visual.icon;

  const promptPreview = useMemo(
    () => buildSelfContainedPrompt({ workflow, inputText: inputText || "[Add user input before generating.]", optionalContext }),
    [inputText, optionalContext, workflow]
  );

  async function generatePrompt() {
    setError("");
    setMessage("");
    if (!inputText.trim()) {
      setError("Add sanitized user input before generating the prompt.");
      return;
    }
    const prompt = buildSelfContainedPrompt({ workflow, inputText, optionalContext });
    setGeneratedPrompt(prompt);
    const id = await createRun({
      projectId: typedProjectId,
      workflowId: workflow.id,
      workflowTitle: workflow.title,
      inputText,
      optionalContext: optionalContext || undefined,
      generatedPrompt: prompt
    });
    setRunId(id);
    await track({ eventType: "prompt_generated", projectId: typedProjectId, workflowId: workflow.id });
    setMessage("Prompt generated and workflow run saved.");
  }

  async function ensureWorkflowRun() {
    if (runId) return runId;
    const prompt = buildSelfContainedPrompt({ workflow, inputText, optionalContext });
    setGeneratedPrompt(prompt);
    const id = await createRun({
      projectId: typedProjectId,
      workflowId: workflow.id,
      workflowTitle: workflow.title,
      inputText,
      optionalContext: optionalContext || undefined,
      generatedPrompt: prompt
    });
    setRunId(id);
    await track({ eventType: "prompt_generated", projectId: typedProjectId, workflowId: workflow.id });
    return id;
  }

  async function analyzeWithAI() {
    setError("");
    setMessage("");
    if (!inputText.trim()) {
      setError("Add sanitized user input before running AI analysis.");
      return;
    }

    setAnalyzing(true);
    try {
      const id = await ensureWorkflowRun();
      const result = (await analyzeDeliveryInputForCurrentUser({
        rawInput: inputText,
        workflowType: workflowTypeById[workflow.id],
        projectContext: [project?.description, optionalContext].filter(Boolean).join("\n\n") || undefined,
        artifactType: workflow.title,
        existingArtifactContext: generatedPrompt || promptPreview,
        provider: aiProviderOption === "default" ? undefined : aiProviderOption
      })) as AnalyzeActionResponse;
      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      const draft = JSON.stringify(result.data, null, 2);
      setAiDraftText(draft);
      setAiOutput(draft);
      setAiDraftMeta({ provider: result.provider, model: result.model });
      setReviewedByUser(false);
      setAiToolUsed(`Product Delivery OS AI (${result.provider})`);
      await saveOutput({
        workflowRunId: id,
        aiToolUsed: `Product Delivery OS AI (${result.provider})`,
        aiOutput: draft,
        aiOutputJson: result.data,
        finalOutputJson: result.data,
        aiProvider: result.provider,
        aiModel: result.model,
        aiGenerated: true,
        reviewedByUser: false
      });
      await track({ eventType: "ai_analysis_generated", projectId: typedProjectId, workflowId: workflow.id });
      setMessage("AI Draft generated and saved. Review it before using it for delivery.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "AI analysis failed. Check provider configuration and try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function copyPrompt() {
    const prompt = generatedPrompt || promptPreview;
    await navigator.clipboard.writeText(prompt);
    await track({ eventType: "prompt_copied", projectId: typedProjectId, workflowId: workflow.id });
    setMessage("Prompt copied. Paste it into your preferred AI tool.");
  }

  async function onSaveOutput(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!runId) {
      setError("Generate a prompt first so this output has a workflow run to attach to.");
      return;
    }
    if (!aiOutput.trim()) {
      setError("Paste the AI output before saving.");
      return;
    }
    setSaving(true);
    try {
      await saveOutput({ workflowRunId: runId, aiToolUsed, aiOutput });
      setMessage("Output saved.");
    } catch {
      setError("Could not save the output. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function saveAsArtifact() {
    setError("");
    const content = aiDraftText.trim() || aiOutput.trim();
    if (!runId || !content) {
      setError("Save a workflow output before creating an artifact.");
      return;
    }
    const parsedDraft = parseDraftJson(aiDraftText);
    await createArtifact({
      workflowRunId: runId,
      artifactType: workflow.title,
      title: artifactTitle || `${workflow.title} Output`,
      content,
      rawInput: inputText,
      aiOutputJson: parsedDraft ?? undefined,
      finalOutputJson: parsedDraft ?? undefined,
      aiProvider: aiDraftMeta?.provider,
      aiModel: aiDraftMeta?.model,
      aiGenerated: Boolean(aiDraftMeta),
      reviewedByUser
    });
    setMessage("Artifact saved to the project library.");
  }

  async function markDraftReviewed() {
    setError("");
    setMessage("");
    if (!runId) {
      setError("Generate an AI Draft before marking it reviewed.");
      return;
    }
    const parsedDraft = parseDraftJson(aiDraftText);
    if (!parsedDraft) {
      setError("AI Draft must be valid JSON before it can be marked reviewed.");
      return;
    }
    await markReviewed({ workflowRunId: runId, finalOutputJson: parsedDraft });
    setAiOutput(aiDraftText);
    setReviewedByUser(true);
    setMessage("AI Draft marked as reviewed.");
  }

  async function copyFirstJiraStory() {
    const parsedDraft = parseDraftJson(aiDraftText);
    const story = parsedDraft?.jiraStories[0];
    if (!story) {
      setError("No Jira story is available in the current AI Draft.");
      return;
    }
    await navigator.clipboard.writeText(
      `${story.title}\n\n${story.userStory}\n\nAcceptance Criteria:\n${story.acceptanceCriteria.map((item) => `- ${item}`).join("\n")}`
    );
    setMessage("First Jira story copied.");
  }

  async function onSubmitFeedback() {
    setError("");
    if (!runId) {
      setError("Generate and save a run before submitting feedback.");
      return;
    }
    await submitFeedback({
      workflowRunId: runId,
      usefulnessScore: scores.usefulness,
      easeOfUseScore: scores.ease,
      outputQualityScore: scores.quality,
      wouldUseAgain,
      comments: comments || undefined
    });
    setMessage("Feedback submitted. Thanks, that is exactly what beta testing needs.");
    setComments("");
  }

  return (
    <div className={cn("grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] 2xl:grid-cols-[17rem_minmax(0,1fr)_25rem]", visual.className)}>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-lg border border-border bg-[#111827] text-white command-shadow">
          <div className="p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--workflow)] text-white">
              <VisualIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="mt-5 font-heading text-2xl font-bold">{workflow.title}</h1>
            <p className="mt-3 text-sm leading-6 text-white/60">{project?.name || "Project workspace"}</p>
          </div>
          <div className="border-t border-white/10 p-3">
            {["Input", "Prompt", "AI Draft", "Artifact", "Feedback"].map((step, index) => {
              const active =
                (index === 0 && !generatedPrompt) ||
                (index === 1 && generatedPrompt && !aiOutput) ||
                (index === 2 && aiOutput && !message.includes("Artifact")) ||
                (index === 3 && message.includes("Artifact")) ||
                (index === 4 && message.includes("Feedback"));
              return (
                <div
                  key={step}
                  className={cn(
                    "mb-2 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm font-bold last:mb-0",
                    active && "border-[var(--workflow)] bg-white/[0.1]"
                  )}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-xs">0{index + 1}</span>
                  {step}
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/10 p-5">
            <Button asChild variant="secondary" className="w-full border-white/15 bg-white/10 text-white hover:bg-white/15">
              <Link href={`/projects/${projectId}`}>Back to workspace</Link>
            </Button>
          </div>
        </div>
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="rounded-lg border border-border bg-card p-5 soft-shadow">
          <p className="text-xs font-bold uppercase text-[#006d77]">Workflow runner</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-slate-950">{workflow.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{workflow.description}</p>
        </div>

        {message ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>1. Add workflow input</CardTitle>
            <CardDescription>Use sanitized notes, requirements, backlog items, or context.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inputText">User input *</Label>
              <Textarea
                id="inputText"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                className="min-h-72"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionalContext">Optional context</Label>
              <Textarea
                id="optionalContext"
                value={optionalContext}
                onChange={(event) => setOptionalContext(event.target.value)}
                className="min-h-72"
              />
            </div>
            <div className="lg:col-span-2">
              <Button type="button" onClick={generatePrompt}>
                Generate prompt
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle>2. Generate AI Draft</CardTitle>
                <CardDescription>Run provider-backed analysis inside Product Delivery OS. User review is required.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900">
                  AI Draft
                </span>
                <span className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-800">
                  Needs Review
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[16rem_1fr] md:items-end">
              <div className="space-y-2">
                <Label htmlFor="aiProvider">AI provider</Label>
                <Select
                  id="aiProvider"
                  value={aiProviderOption}
                  onChange={(event) => setAiProviderOption(event.target.value as ProviderOption)}
                >
                  {providerOptions.map((provider) => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Button type="button" onClick={analyzeWithAI} disabled={analyzing}>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {analyzing ? "Analyzing..." : "Analyze with AI"}
              </Button>
            </div>

            {aiDraftMeta ? (
              <p className="text-sm font-semibold text-slate-700">
                Generated with {aiDraftMeta.provider} · {aiDraftMeta.model}
              </p>
            ) : null}

            {aiDraftText ? (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="space-y-2">
                  <Label htmlFor="aiDraft">Editable AI Draft JSON</Label>
                  <Textarea
                    id="aiDraft"
                    value={aiDraftText}
                    onChange={(event) => {
                      setAiDraftText(event.target.value);
                      setReviewedByUser(false);
                    }}
                    className="min-h-[34rem] font-mono text-xs leading-5"
                  />
                </div>
                <div className="space-y-3">
                  <DraftLabels draftText={aiDraftText} reviewed={reviewedByUser} />
                  <Button type="button" variant="secondary" className="w-full" onClick={markDraftReviewed}>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Mark as Reviewed
                  </Button>
                  <Button type="button" variant="secondary" className="w-full" onClick={copyFirstJiraStory}>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    Copy Jira Story
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <form className="grid gap-5 2xl:grid-cols-2" onSubmit={onSaveOutput}>
          <Card>
            <CardHeader>
              <CardTitle>3. Paste or save output</CardTitle>
              <CardDescription>Manual paste remains available. AI Drafts populate this output automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiTool">AI tool used</Label>
                <Select id="aiTool" value={aiToolUsed} onChange={(event) => setAiToolUsed(event.target.value)}>
                  {aiTools.map((tool) => (
                    <option key={tool}>{tool}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aiOutput">AI output *</Label>
                <Textarea id="aiOutput" value={aiOutput} onChange={(event) => setAiOutput(event.target.value)} className="min-h-80" />
              </div>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4" aria-hidden="true" />
                {saving ? "Saving..." : "Save workflow run"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Save artifact and submit feedback</CardTitle>
              <CardDescription>Keep useful outputs and tell us what worked.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="artifactTitle">Artifact title</Label>
                <Input id="artifactTitle" value={artifactTitle} onChange={(event) => setArtifactTitle(event.target.value)} />
              </div>
              <Button type="button" variant="secondary" onClick={saveAsArtifact}>
                <Check className="h-4 w-4" aria-hidden="true" />
                Save as artifact
              </Button>
              <div className="grid gap-3 md:grid-cols-3">
                <Score label="Usefulness" value={scores.usefulness} onChange={(value) => setScores({ ...scores, usefulness: value })} />
                <Score label="Ease of use" value={scores.ease} onChange={(value) => setScores({ ...scores, ease: value })} />
                <Score label="Output quality" value={scores.quality} onChange={(value) => setScores({ ...scores, quality: value })} />
              </div>
              <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-900">
                <input
                  type="checkbox"
                  checked={wouldUseAgain}
                  onChange={(event) => setWouldUseAgain(event.target.checked)}
                  className="h-5 w-5"
                />
                I would use this workflow again
              </label>
              <div className="space-y-2">
                <Label htmlFor="comments">Feedback comments</Label>
                <Textarea id="comments" value={comments} onChange={(event) => setComments(event.target.value)} />
              </div>
              <Button type="button" onClick={onSubmitFeedback}>
                Submit feedback
              </Button>
            </CardContent>
          </Card>
        </form>
      </section>

      <aside className="lg:col-span-2 2xl:col-span-1 2xl:sticky 2xl:top-28 2xl:self-start">
        <Card className="overflow-hidden bg-[#111827] text-white command-shadow">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">2. Prompt preview</CardTitle>
                <CardDescription className="text-white/55">Copy this into your preferred AI tool.</CardDescription>
              </div>
              <PanelRight className="h-5 w-5 text-[#7dd3d8]" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <pre className="max-h-[calc(100dvh-24rem)] min-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-50">
              {generatedPrompt || promptPreview}
            </pre>
            <Button type="button" variant="accent" className="w-full" onClick={copyPrompt}>
              <Clipboard className="h-4 w-4" aria-hidden="true" />
              Copy prompt
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Score({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={String(value)} onChange={(event) => onChange(Number(event.target.value))}>
        {[1, 2, 3, 4, 5].map((score) => (
          <option key={score} value={score}>
            {score}
          </option>
        ))}
      </Select>
    </div>
  );
}

function parseDraftJson(value: string): AnalyzeDeliveryInputResponse | null {
  if (!value.trim()) return null;
  try {
    return JSON.parse(value) as AnalyzeDeliveryInputResponse;
  } catch {
    return null;
  }
}

function DraftLabels({ draftText, reviewed }: { draftText: string; reviewed: boolean }) {
  const draft = parseDraftJson(draftText);

  if (!draft) {
    return <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">Draft JSON is invalid.</div>;
  }

  const labels = [
    { label: "Confirmed Fact", count: draft.confirmedFacts.length, className: "border-emerald-200 bg-emerald-50 text-emerald-900" },
    { label: "Assumption", count: draft.assumptions.length, className: "border-amber-200 bg-amber-50 text-amber-900" },
    { label: "Open Question", count: draft.openQuestions.length, className: "border-red-200 bg-red-50 text-red-800" },
    { label: "Ready for Jira", count: draft.jiraStories.length, className: "border-sky-200 bg-sky-50 text-sky-900" }
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border bg-slate-50 p-3">
        <p className="text-xs font-bold uppercase text-slate-500">Review status</p>
        <p className="mt-1 text-sm font-bold text-slate-950">{reviewed ? "Reviewed by user" : "Needs Review"}</p>
      </div>
      {labels.map((item) => (
        <div key={item.label} className={cn("rounded-md border p-3", item.className)}>
          <p className="text-xs font-bold uppercase">{item.label}</p>
          <p className="mt-1 text-2xl font-bold">{item.count}</p>
        </div>
      ))}
    </div>
  );
}
