import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type StickyActionBarProps = {
  status: string;
  /** "active" pulses green (pending action), "idle" shows a muted dot. */
  statusTone?: "active" | "idle";
  children: ReactNode;
};

/** Floating action bar pinned to the bottom of the screen, above the bottom nav on mobile. */
export function StickyActionBar({ status, statusTone = "active", children }: StickyActionBarProps) {
  return (
    <section className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 flex flex-col items-stretch gap-space-sm rounded-xl border border-border-input/80 bg-surface-container-lowest/95 p-space-md shadow-level-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between md:bottom-4">
      <p className="flex items-center gap-space-sm text-body-sm text-on-surface" aria-live="polite">
        <span
          aria-hidden
          className={cn(
            "size-2.5 rounded-full",
            statusTone === "active" ? "animate-pulse bg-success" : "bg-outline-variant",
          )}
        />
        {status}
      </p>
      <div className="grid auto-cols-fr grid-flow-col gap-space-sm sm:flex">{children}</div>
    </section>
  );
}
