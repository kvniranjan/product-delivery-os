"use client";

import { useMemo, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { Check, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import type { AIProvider } from "@/lib/ai";

const providers: Array<{ provider: AIProvider; label: string; defaultModel: string }> = [
  { provider: "openai", label: "OpenAI", defaultModel: "gpt-4o-mini" },
  { provider: "anthropic", label: "Anthropic Claude", defaultModel: "claude-3-5-sonnet-latest" },
  { provider: "gemini", label: "Google Gemini", defaultModel: "gemini-1.5-pro" }
];

type SavedProvider = {
  provider: string;
  keyPreview: string;
  model?: string;
  validatedAt: number;
  updatedAt: number;
};

export function AiProviderSettingsPanel({ compact = false }: { compact?: boolean }) {
  const settings = useQuery(api.aiProviderSettings.list);
  const validateProviderKey = useAction(api.aiProviderKeyActions.validateProviderKey);
  const saveProviderKey = useAction(api.aiProviderKeyActions.saveProviderKey);
  const removeProvider = useMutation(api.aiProviderSettings.remove);
  const setDefaultProvider = useMutation(api.users.setAiDefaultProvider);

  const [provider, setProvider] = useState<AIProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(providers[0].defaultModel);
  const [validatedSignature, setValidatedSignature] = useState("");
  const [validatedPreview, setValidatedPreview] = useState("");
  const [busy, setBusy] = useState<"validate" | "save" | "remove" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedProvider = providers.find((item) => item.provider === provider) ?? providers[0];
  const signature = useMemo(() => `${provider}:${apiKey.trim()}:${model.trim()}`, [apiKey, model, provider]);
  const canSave = Boolean(apiKey.trim()) && validatedSignature === signature;
  const savedProviders = (settings?.providers ?? []) as SavedProvider[];

  async function onValidate() {
    setError("");
    setMessage("");
    if (!apiKey.trim()) {
      setError("Enter an API key before validating.");
      return;
    }

    setBusy("validate");
    try {
      const result = await validateProviderKey({
        provider,
        apiKey,
        model: model.trim() || undefined
      });
      if ("error" in result) {
        setValidatedSignature("");
        setValidatedPreview("");
        setError(result.error.message);
        return;
      }
      setValidatedSignature(signature);
      setValidatedPreview(result.keyPreview);
      setMessage(`${selectedProvider.label} key validated.`);
    } catch (caught) {
      setValidatedSignature("");
      setValidatedPreview("");
      setError(providerActionErrorMessage(caught, "API key validation failed. Check the provider, key, selected model, permissions, and quota."));
    } finally {
      setBusy(null);
    }
  }

  async function onSave() {
    setError("");
    setMessage("");
    if (!canSave) {
      setError("Validate this exact provider, key, and model before saving.");
      return;
    }

    setBusy("save");
    try {
      const result = await saveProviderKey({
        provider,
        apiKey,
        model: model.trim() || undefined
      });
      if ("error" in result) {
        setError(result.error.message);
        return;
      }
      setApiKey("");
      setValidatedSignature("");
      setMessage(`${selectedProvider.label} key saved as ${validatedPreview}.`);
    } catch (caught) {
      setError(providerActionErrorMessage(caught, "Could not save API key."));
    } finally {
      setBusy(null);
    }
  }

  async function onRemove(providerToRemove: AIProvider) {
    setError("");
    setMessage("");
    setBusy("remove");
    try {
      await removeProvider({ provider: providerToRemove });
      setMessage("Provider key removed.");
    } catch {
      setError("Could not remove provider key.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      {message ? <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">{message}</div> : null}
      {error ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</div> : null}

      <div className={cn("grid gap-5", compact ? "xl:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_24rem]")}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Validate the provider key first. Saved keys are encrypted server-side and never displayed again.</CardDescription>
              </div>
              <KeyRound className="h-5 w-5 text-[#006d77]" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select
                  id="provider"
                  value={provider}
                  onChange={(event) => {
                    setProvider(event.target.value as AIProvider);
                    const nextProvider = providers.find((item) => item.provider === event.target.value);
                    setModel(nextProvider?.defaultModel ?? "");
                    setValidatedSignature("");
                    setValidatedPreview("");
                  }}
                >
                  {providers.map((item) => (
                    <option key={item.provider} value={item.provider}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={model}
                  placeholder={selectedProvider.defaultModel}
                  onChange={(event) => {
                    setModel(event.target.value);
                    setValidatedSignature("");
                    setValidatedPreview("");
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                autoComplete="off"
                onChange={(event) => {
                  setApiKey(event.target.value);
                  setValidatedSignature("");
                  setValidatedPreview("");
                }}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={onValidate} disabled={busy !== null || !apiKey.trim()}>
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {busy === "validate" ? "Validating..." : "Validate"}
              </Button>
              <Button type="button" onClick={onSave} disabled={busy !== null || !canSave}>
                <Check className="h-4 w-4" aria-hidden="true" />
                {busy === "save" ? "Saving..." : "Save API Key"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Providers</CardTitle>
            <CardDescription>Choose the default provider used when workflows are set to Default.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings === undefined ? (
              <div className="h-24 animate-pulse rounded-md bg-slate-200" />
            ) : savedProviders.length === 0 ? (
              <p className="text-sm leading-6 text-slate-600">No provider keys saved yet.</p>
            ) : (
              savedProviders.map((saved) => {
                const typedProvider = saved.provider as AIProvider;
                const isDefault = settings?.defaultProvider === saved.provider;
                return (
                  <div key={saved.provider} className="rounded-md border border-border bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{providers.find((item) => item.provider === saved.provider)?.label}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {saved.keyPreview} · Validated {formatDate(saved.validatedAt)}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{saved.model || "Default model"}</p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        aria-label={`Remove ${saved.provider} key`}
                        onClick={() => void onRemove(typedProvider)}
                        disabled={busy !== null}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={isDefault ? "accent" : "secondary"}
                      className={cn("mt-3 w-full", isDefault && "pointer-events-none")}
                      onClick={() => void setDefaultProvider({ provider: typedProvider })}
                    >
                      {isDefault ? "Default provider" : "Make default"}
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function providerActionErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;
  const message = error.message;
  if (message.includes("CONVEX") || message.includes("ConvexError") || message.includes("/convex/")) {
    return fallback;
  }
  return message || fallback;
}
