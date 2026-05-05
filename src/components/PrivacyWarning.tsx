import { ShieldAlert } from "lucide-react";

export function PrivacyWarning() {
  return (
    <div className="border-b border-[#f4d27a] bg-[#fff7dd] px-4 py-3 text-sm text-amber-950">
      <div className="mx-auto flex max-w-7xl gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="leading-6">
          Do not enter confidential company, client, production, regulated, or customer data during beta testing. Use
          sanitized requirements unless your organization permits use.
        </p>
      </div>
    </div>
  );
}
