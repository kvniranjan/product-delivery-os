"use client";

import { PageHeader } from "@/components/AppShell";
import { AiProviderSettingsPanel } from "@/components/AiProviderSettingsPanel";

export function AccountClient() {
  return (
    <>
      <PageHeader
        title="Manage Account"
        description="Configure AI provider keys for in-app delivery artifact generation."
      />
      <AiProviderSettingsPanel />
    </>
  );
}
