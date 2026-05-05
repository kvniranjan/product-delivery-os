import { SignIn } from "@clerk/nextjs";
import { ConfigurationNotice } from "@/components/ConfigurationNotice";
import { isAuthConfigured } from "@/lib/env";

export default function Page() {
  if (!isAuthConfigured()) {
    return <ConfigurationNotice area="Sign in" />;
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
