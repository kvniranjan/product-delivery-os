"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NewProjectClient() {
  const router = useRouter();
  const createProject = useMutation(api.projects.create);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    setSaving(true);
    try {
      const id = await createProject({
        name,
        domain: domain || undefined,
        description: description || undefined
      });
      router.push(`/projects/${id}`);
    } catch {
      setError("Could not create the project. Check your connection and try again.");
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Create Project" description="Use fictional or sanitized beta context only." />
      <Card className="max-w-3xl">
        <CardContent className="pt-5">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Project name *</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="Example: SaaS permissions, claims, core banking"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Brief sanitized context for beta testing."
              />
            </div>
            {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
