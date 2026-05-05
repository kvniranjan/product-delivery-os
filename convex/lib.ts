import { ConvexError } from "convex/values";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;

export async function requireCurrentUser(ctx: Ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required.");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (!user) {
    throw new ConvexError("User profile not found. Refresh the page and try again.");
  }

  return user;
}

export async function requireOwnedProject(ctx: Ctx, projectId: Id<"projects">) {
  const user = await requireCurrentUser(ctx);
  const project = await ctx.db.get(projectId);
  if (!project || project.userId !== user._id) {
    throw new ConvexError("Project not found.");
  }
  return { user, project };
}

export async function requireOwnedWorkflowRun(ctx: Ctx, workflowRunId: Id<"workflowRuns">) {
  const user = await requireCurrentUser(ctx);
  const run = await ctx.db.get(workflowRunId);
  if (!run || run.userId !== user._id) {
    throw new ConvexError("Workflow run not found.");
  }
  return { user, run };
}
