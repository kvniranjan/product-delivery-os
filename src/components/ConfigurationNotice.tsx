import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

export function ConfigurationNotice({ area = "This page" }: { area?: string }) {
  const missing = [
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" : null,
    !process.env.CLERK_SECRET_KEY ? "CLERK_SECRET_KEY" : null,
    !process.env.NEXT_PUBLIC_CONVEX_URL ? "NEXT_PUBLIC_CONVEX_URL" : null
  ].filter(Boolean);
  const missingText = missing.length ? missing.join(", ") : "required beta service variables";

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-xl rounded-lg border border-amber-200 bg-card p-6 soft-shadow">
        <AlertTriangle className="h-8 w-8 text-amber-700" aria-hidden="true" />
        <h1 className="mt-4 font-heading text-2xl font-bold text-slate-950">Beta services are not configured</h1>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          {area} needs real beta service environment variables. Missing: {missingText}. Add the missing values and
          the Convex Clerk issuer settings before testing login or saved data.
        </p>
        <Button asChild className="mt-5">
          <Link href="/">Back to landing page</Link>
        </Button>
      </section>
    </main>
  );
}
