"use client";

import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { BarChart3, Blocks, FolderKanban, KeyRound, Library, MessageSquare, PlusCircle, UserCog } from "lucide-react";
import { AiProviderSettingsPanel } from "./AiProviderSettingsPanel";
import { PrivacyWarning } from "./PrivacyWarning";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: FolderKanban },
  { href: "/projects/new", label: "Create Project", icon: PlusCircle },
  { href: "/account", label: "Manage Account", icon: UserCog },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/admin", label: "Admin", icon: BarChart3 }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <div className="min-h-dvh bg-[#08111f] text-white">
      <PrivacyWarning />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08111f]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link href="/dashboard" className="flex items-center gap-3 font-heading text-base font-bold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-[#4f8cff] text-white">
              <Blocks className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>Product Delivery OS</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-1" aria-label="Primary">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white",
                    active && "bg-white/10 text-white"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <SignedIn>
            <UserButton afterSignOutUrl="/">
              <UserButton.UserProfilePage
                label="API Keys"
                url="api-keys"
                labelIcon={<KeyRound className="h-4 w-4" aria-hidden="true" />}
              >
                <div className="w-full max-w-4xl">
                  <h2 className="font-heading text-2xl font-bold text-slate-950">API Keys</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Validate and save provider keys for in-app delivery artifact generation.
                  </p>
                  <div className="mt-5">
                    <AiProviderSettingsPanel compact />
                  </div>
                </div>
              </UserButton.UserProfilePage>
            </UserButton>
          </SignedIn>
        </div>
      </header>
      <main
        className={cn(
          "mx-auto mt-6 min-h-[calc(100dvh-5.5rem)] rounded-t-lg border border-border bg-background px-4 py-8 text-slate-950 shadow-[0_32px_90px_rgb(0_0_0_/_0.25)]",
          pathname.includes("/workflows/") ? "max-w-[96rem] 2xl:max-w-[108rem]" : "max-w-7xl"
        )}
      >
        {isLoading ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center soft-shadow">
            <h1 className="font-heading text-xl font-semibold text-slate-950">Finishing secure sign-in</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Connecting your Clerk session to Convex.</p>
          </div>
        ) : isAuthenticated ? (
          children
        ) : (
          <div className="rounded-lg border border-amber-200 bg-card p-8 text-center soft-shadow">
            <h1 className="font-heading text-xl font-semibold text-slate-950">Convex authentication is not connected</h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Clerk signed you in, but Convex did not receive a valid Clerk token. Check the Clerk Convex integration or
              JWT template and the Convex `CLERK_JWT_ISSUER_DOMAIN` value.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Library,
  title,
  description,
  action
}: {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center soft-shadow">
      <Icon className="mx-auto h-9 w-9 text-[#006d77]" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-normal text-slate-950">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export { Button };
