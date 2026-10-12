"use client";

import { useSyncExternalStore } from "react";
import { toDateKey } from "@/lib/dates";

const subscribeToNothing = () => () => {};

/**
 * Today's local date key, or null during SSR/prerender. Render a loading
 * state while it's null to avoid hydration mismatches.
 */
export function useToday(): string | null {
  return useSyncExternalStore(
    subscribeToNothing,
    () => toDateKey(new Date()),
    () => null,
  );
}
