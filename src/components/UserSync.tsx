"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function UserSync() {
  const { user, isLoaded } = useUser();
  const upsert = useMutation(api.users.upsertCurrentUser);

  useEffect(() => {
    if (!isLoaded || !user) return;
    void upsert({
      name: user.fullName ?? user.username ?? undefined,
      email: user.primaryEmailAddress?.emailAddress ?? ""
    });
  }, [isLoaded, upsert, user]);

  return null;
}
