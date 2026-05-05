import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react";
import { PrivacyWarning } from "@/components/PrivacyWarning";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    eyebrow: "W.01 - WORKFLOW INTAKE",
    title: "Turn raw delivery input into structured artifacts.",
    description:
      "Run requirement intake, impact analysis, story generation, acceptance criteria, release readiness, and stakeholder update workflows from one workspace.",
    icon: ClipboardCheck
  },
  {
    eyebrow: "W.02 - AI DRAFTS",
    title: "Generate inside the app without copy-paste.",
    description:
      "Use OpenAI, Anthropic, or Gemini provider adapters while keeping API keys server-side and outputs review-first.",
    icon: Sparkles
  },
  {
    eyebrow: "W.03 - ARTIFACT TRAIL",
    title: "Keep reviewed outputs tied to the run.",
    description:
      "Save raw input, AI draft JSON, final reviewed JSON, provider, model, and artifact content in the existing workflow.",
    icon: FileText
  },
  {
    eyebrow: "W.04 - GOVERNANCE",
    title: "Separate facts, assumptions, risks, and questions.",
    description:
      "Keep BA and PO delivery outputs testable, reviewable, and practical for real delivery teams.",
    icon: ShieldCheck
  }
];

const workflowRows = [
  ["01", "Requirement Intake", "Context captured", "READY"],
  ["02", "Impact Analysis", "Data, GL, reporting, EOD, UAT", "SELECTED"],
  ["03", "Story Builder", "Jira-ready draft", "READY"],
  ["04", "Acceptance Criteria", "Given/When/Then review", "READY"]
];

const signals = [
  ["Confirmed facts", "Separated from assumptions", "88%", "bg-emerald-400"],
  ["Open questions", "Missing details are visible", "76%", "bg-blue-400"],
  ["Review guardrail", "AI Draft is not final", "94%", "bg-cyan-300"],
  ["API key posture", "Server-side encrypted storage", "100%", "bg-amber-300"]
];

const steps = [
  {
    step: "STEP 01",
    title: "Create a sanitized project workspace.",
    body: "Capture project context, domain notes, and delivery input without entering private production data."
  },
  {
    step: "STEP 02",
    title: "Run a structured workflow.",
    body: "Generate delivery artifacts with configured AI providers or use the manual prompt workflow."
  },
  {
    step: "STEP 03",
    title: "Review, edit, and save.",
    body: "Mark AI drafts as reviewed and save reusable artifacts with provider and model metadata."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[#08111f] text-white">
      <PrivacyWarning />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08111f]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex min-w-0 items-center gap-3 font-heading text-base font-bold text-white max-[430px]:text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-blue-500 shadow-[0_0_35px_rgb(59_130_246_/_0.45)]">
              <Blocks className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 max-[430px]:max-w-[140px]">Product Delivery OS</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-300 md:flex">
            <a href="#workflows" className="hover:text-white">
              Workflows
            </a>
            <a href="#inside" className="hover:text-white">
              Workspace
            </a>
            <a href="#how" className="hover:text-white">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-slate-200 hover:bg-white/10 hover:text-white max-[430px]:hidden">
              <Link href="/sign-in">Log in</Link>
            </Button>
            <Button asChild className="bg-white text-slate-950 hover:bg-blue-50">
              <Link href="/sign-up">Start beta</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(148_163_184_/_0.08)_1px,transparent_1px),linear-gradient(180deg,rgb(148_163_184_/_0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
          <div className="relative mx-auto grid min-h-[calc(100dvh-7rem)] max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-bold uppercase text-blue-200">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Product delivery copilot
              </div>
              <h1 className="max-w-4xl font-heading text-5xl font-bold leading-[0.98] tracking-normal text-white md:text-7xl">
                The control room for BA and PO delivery work.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Convert messy delivery inputs into structured, testable, reviewable artifacts without leaving Product Delivery OS.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full bg-blue-500 text-white hover:bg-blue-400 sm:w-auto">
                  <Link href="/sign-up">
                    Start beta testing
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10 sm:w-auto"
                >
                  <Link href="/sign-in">Open workspace</Link>
                </Button>
              </div>
              <div className="mt-9 grid max-w-2xl gap-3 text-sm sm:grid-cols-3">
                {["Provider-agnostic", "Review-first", "Artifact-backed"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/12 bg-[#0f1a2b] shadow-[0_32px_90px_rgb(0_0_0_/_0.4)]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="font-mono text-xs font-semibold uppercase text-slate-400">Requirement Intake</div>
              </div>
              <div className="grid lg:grid-cols-[0.72fr_1fr]">
                <div className="border-b border-white/10 bg-white/[0.03] p-5 lg:border-b-0 lg:border-r">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-xs font-bold uppercase text-slate-400">Workflow rail</p>
                    <Workflow className="h-4 w-4 text-blue-300" aria-hidden="true" />
                  </div>
                  <ol className="space-y-3">
                    {workflowRows.map(([step, label, detail, status]) => (
                      <li key={label} className="rounded-md border border-white/10 bg-[#111d31] p-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-md bg-white/10 font-mono text-xs font-bold text-white">
                            {step}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-heading text-sm font-semibold text-white">{label}</div>
                            <div className="truncate text-xs font-semibold text-slate-500">{detail}</div>
                          </div>
                        </div>
                        <div className="mt-3 font-mono text-[10px] font-bold text-blue-200">{status}</div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-bold uppercase text-blue-200">AI Draft</p>
                      <h2 className="mt-2 font-heading text-2xl font-bold">Delivery artifacts</h2>
                    </div>
                    <div className="rounded-md border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-200">
                      Needs review
                    </div>
                  </div>
                  <div className="mt-5 rounded-md border border-white/10 bg-[#07101e] p-4 font-mono text-xs leading-6 text-slate-300">
                    <p className="text-white">summary: &quot;Stakeholder input converted&quot;</p>
                    <p>confirmedFacts: [&quot;Raw request provided&quot;]</p>
                    <p>openQuestions: [&quot;Approval owner missing&quot;]</p>
                    <p className="text-cyan-300">acceptanceCriteria: [&quot;Given / When / Then&quot;]</p>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      ["8", "draft sections"],
                      ["3", "providers"],
                      ["1", "review gate"]
                    ].map(([value, label]) => (
                      <div key={label} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                        <div className="font-heading text-2xl font-bold text-white">{value}</div>
                        <div className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflows" className="border-y border-white/10 bg-[#f8fafc] py-16 text-slate-950">
          <div className="mx-auto max-w-7xl px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Core workflows
              </div>
              <h2 className="mt-3 font-heading text-4xl font-bold leading-tight md:text-5xl">
                A sharper interface for delivery work.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {capabilities.map((capability) => {
                const Icon = capability.icon;
                return (
                  <article key={capability.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgb(15_23_42_/_0.06)]">
                    <div className="mb-8 flex items-center justify-between">
                      <div className="font-mono text-xs font-bold uppercase text-slate-500">{capability.eyebrow}</div>
                      <span className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-blue-700">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold leading-tight text-slate-950">{capability.title}</h3>
                    <p className="mt-4 leading-7 text-slate-600">{capability.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="inside" className="relative overflow-hidden bg-[#08111f] py-16">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(148_163_184_/_0.07)_1px,transparent_1px),linear-gradient(180deg,rgb(148_163_184_/_0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-blue-200">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Inside the beta
              </div>
              <h2 className="mt-3 font-heading text-4xl font-bold leading-tight md:text-5xl">
                One workspace for drafts, outputs, and delivery evidence.
              </h2>
            </div>
            <div className="mt-10 rounded-lg border border-white/10 bg-[#101b2d] p-5 shadow-[0_32px_90px_rgb(0_0_0_/_0.35)]">
              <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-md border border-white/10 bg-[#0a1322] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-bold">Run quality</h3>
                      <p className="mt-1 text-sm text-slate-400">Fictional beta workspace sample</p>
                    </div>
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-[conic-gradient(#22d3ee_0_82%,rgb(51_65_85)_82%_100%)] p-2">
                      <div className="grid h-full w-full place-items-center rounded-full bg-[#0a1322] font-heading text-xl font-bold">82</div>
                    </div>
                  </div>
                  <div className="mt-7 space-y-5">
                    {signals.map(([name, detail, value, color]) => (
                      <div key={name}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <div>
                            <div className="font-semibold text-white">{name}</div>
                            <div className="text-xs text-slate-500">{detail}</div>
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-300">{value}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    [Gauge, "Release readiness", "Critical defects, missing signoff, and unresolved production risks block a Go recommendation."],
                    [Layers3, "Impact analysis", "Prompts force upstream, downstream, interface, data, regression, GL, batch, reporting, security, ops, and UAT coverage."],
                    [LockKeyhole, "Privacy boundary", "The beta keeps users oriented around sanitized examples and approved data handling."],
                    [GitBranch, "Source of truth", "Core packs, role packs, workflows, templates, and prompt packs remain reusable source material."]
                  ].map(([Icon, title, body]) => {
                    const TypedIcon = Icon as typeof Gauge;
                    return (
                      <article key={title as string} className="rounded-md border border-white/10 bg-white/[0.04] p-5">
                        <TypedIcon className="h-6 w-6 text-blue-300" aria-hidden="true" />
                        <h3 className="mt-5 font-heading text-lg font-bold text-white">{title as string}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{body as string}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="bg-white py-16 text-slate-950">
          <div className="mx-auto max-w-7xl px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                How it works
              </div>
              <h2 className="mt-3 font-heading text-4xl font-bold leading-tight md:text-5xl">
                Context in. Draft generated. Human reviewed.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {steps.map((item) => (
                <article key={item.step} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                  <div className="font-mono text-xs font-bold uppercase text-blue-700">{item.step}</div>
                  <h3 className="mt-5 font-heading text-2xl font-bold leading-tight">{item.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/10 bg-[#08111f] py-16">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(148_163_184_/_0.07)_1px,transparent_1px),linear-gradient(180deg,rgb(148_163_184_/_0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-blue-200">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Beta workspace
            </div>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Stop treating delivery AI like loose notes in a browser tab.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Give BA and PO work a structured operating layer: context in, disciplined drafts out, reviewed artifacts saved.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-blue-500 text-white hover:bg-blue-400">
                <Link href="/sign-up">
                  Start beta testing
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
              >
                <Link href="/sign-in">Log in</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
