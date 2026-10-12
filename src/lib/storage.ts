/**
 * Typed localStorage access. This is the ONLY module that touches
 * localStorage. Values are validated with zod on every read; corrupt values
 * are discarded instead of crashing. Subscribers are notified on writes in this
 * tab and on `storage` events from other tabs.
 */
import { z } from "zod";
import { routineSchema, userProfileSchema, type Routine, type UserProfile } from "@/lib/schemas";

type StoreValues = {
  profile: UserProfile;
  routines: Record<string, Routine>;
  draftRoutine: Routine;
};

export type StoreKey = keyof StoreValues;

type StoreDefinition<T> = {
  storageKey: string;
  /** Returns the validated value, or null if it should be discarded. */
  parse: (raw: unknown) => T | null;
};

const parseWith =
  <T>(schema: z.ZodType<T>) =>
  (raw: unknown): T | null => {
    const result = schema.safeParse(raw);
    return result.success ? result.data : null;
  };

/** Keeps every valid routine, so one corrupt day doesn't wipe the rest. */
function parseRoutines(raw: unknown): Record<string, Routine> | null {
  const record = z.record(z.string(), z.unknown()).safeParse(raw);
  if (!record.success) return null;
  const routines: Record<string, Routine> = {};
  for (const [date, value] of Object.entries(record.data)) {
    const routine = routineSchema.safeParse(value);
    if (routine.success && routine.data.date === date) routines[date] = routine.data;
  }
  return routines;
}

const STORES: { [K in StoreKey]: StoreDefinition<StoreValues[K]> } = {
  profile: { storageKey: "ro:v1:profile", parse: parseWith(userProfileSchema) },
  routines: { storageKey: "ro:v1:routines", parse: parseRoutines },
  draftRoutine: { storageKey: "ro:v1:draftRoutine", parse: parseWith(routineSchema) },
};

// Parsed values cached by raw string, so reads return stable references
// (required by useSyncExternalStore) and JSON is only parsed when it changes.
const cache = new Map<StoreKey, { raw: string | null; value: unknown }>();
const listeners = new Set<() => void>();

function getRaw(storageKey: string): string | null {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null; // Storage disabled (e.g. some private modes).
  }
}

export function readStore<K extends StoreKey>(key: K): StoreValues[K] | null {
  const { storageKey, parse } = STORES[key];
  const raw = getRaw(storageKey);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as StoreValues[K] | null;

  let value: StoreValues[K] | null = null;
  if (raw !== null) {
    try {
      value = parse(JSON.parse(raw));
    } catch {
      value = null;
    }
    if (value === null) {
      console.warn(`Discarding corrupt localStorage value for "${storageKey}".`);
      // Reads happen during render; defer the removal (and its notification).
      queueMicrotask(() => removeStore(key));
    }
  }
  cache.set(key, { raw, value });
  return value;
}

export function writeStore<K extends StoreKey>(key: K, value: StoreValues[K]): void {
  const { storageKey, parse } = STORES[key];
  if (parse(value) === null) throw new Error(`Refusing to store an invalid value for "${storageKey}".`);
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save "${storageKey}".`, error);
  }
  notify();
}

export function removeStore(key: StoreKey): void {
  try {
    window.localStorage.removeItem(STORES[key].storageKey);
  } catch {
    // Nothing to remove if storage is unavailable.
  }
  notify();
}

function notify() {
  for (const listener of listeners) listener();
}

const handleStorageEvent = (event: StorageEvent) => {
  if (event.key === null || event.key.startsWith("ro:")) notify();
};

export function subscribeToStore(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", handleStorageEvent);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorageEvent);
  };
}
