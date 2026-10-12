"use client";

import { readStore, writeStore } from "@/lib/storage";
import type { UserProfile } from "@/lib/schemas";
import { useStoredValue } from "./useStoredValue";

export function saveProfile(profile: UserProfile): void {
  writeStore("profile", profile);
}

export function updateProfile(changes: Partial<UserProfile>): void {
  const current = readStore("profile");
  if (!current) throw new Error("Cannot update a profile that doesn't exist.");
  writeStore("profile", { ...current, ...changes });
}

/** `undefined` while hydrating, `null` when there's no valid profile. */
export function useProfile(): UserProfile | null | undefined {
  return useStoredValue("profile");
}

/** For components rendered inside <ProfileGate> (used by each main page), which guarantees a profile. */
export function useRequiredProfile(): UserProfile {
  const profile = useProfile();
  if (!profile) throw new Error("useRequiredProfile must be used inside <ProfileGate>.");
  return profile;
}
