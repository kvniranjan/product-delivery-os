"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud";
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const convex = clerkPublishableKey && process.env.NEXT_PUBLIC_CONVEX_URL ? new ConvexReactClient(convexUrl) : null;

export function Providers({ children }: { children: ReactNode }) {
  if (!clerkPublishableKey || !convex) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={{
        variables: {
          colorPrimary: "#006d77",
          colorBackground: "#fffdf7",
          colorText: "#111827",
          colorTextSecondary: "#5b6472",
          colorInputBackground: "#fffdf7",
          colorInputText: "#111827",
          borderRadius: "0.5rem",
          fontFamily: "var(--font-open-sans), sans-serif",
          fontFamilyButtons: "var(--font-open-sans), sans-serif"
        },
        elements: {
          card: "soft-shadow border border-[#d8d1c3]",
          headerTitle: "font-heading",
          formButtonPrimary: "bg-[#111827] hover:bg-[#1f2937] shadow-[0_10px_24px_rgb(17_24_39_/_0.16)]",
          footerActionLink: "text-[#006d77] hover:text-[#00525a]"
        }
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
