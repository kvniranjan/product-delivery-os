import {
  ClipboardList,
  GitBranch,
  ListChecks,
  Megaphone,
  PackageCheck,
  RefreshCcw,
  Rows3,
  SearchCheck,
  TestTube2
} from "lucide-react";

export function workflowVisual(id: string) {
  if (id === "requirement-intake") {
    return { className: "workflow-intake", icon: ClipboardList, label: "Capture" };
  }
  if (id === "impact-analysis") {
    return { className: "workflow-impact", icon: GitBranch, label: "Impact" };
  }
  if (id === "story-builder") {
    return { className: "workflow-story", icon: ListChecks, label: "Stories" };
  }
  if (id === "acceptance-criteria") {
    return { className: "workflow-criteria", icon: TestTube2, label: "Criteria" };
  }
  if (id === "backlog-refinement") {
    return { className: "workflow-intake", icon: Rows3, label: "Refine" };
  }
  if (id === "change-request-analysis") {
    return { className: "workflow-impact", icon: RefreshCcw, label: "Change" };
  }
  if (id === "release-readiness") {
    return { className: "workflow-criteria", icon: PackageCheck, label: "Release" };
  }
  if (id === "stakeholder-brief") {
    return { className: "workflow-story", icon: Megaphone, label: "Brief" };
  }
  if (id === "traceability-check") {
    return { className: "workflow-impact", icon: SearchCheck, label: "Trace" };
  }
  return { className: "workflow-criteria", icon: TestTube2, label: "Test" };
}
