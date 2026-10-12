"use client";

import { useSyncExternalStore } from "react";
import { readStore, subscribeToStore, type StoreKey } from "@/lib/storage";

/**
 * Subscribes to a localStorage-backed store.
 * Returns `undefined` until hydrated (SSR / first client render), then the
 * stored value or `null` when nothing valid is stored.
 */
export function useStoredValue<K extends StoreKey>(key: K) {
  return useSyncExternalStore(
    subscribeToStore,
    () => readStore(key),
    () => undefined,
  );
}
