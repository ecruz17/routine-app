"use client";

import { useEffect } from "react";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
  durationMs?: number;
};

/** Success toast above the bottom nav; announced politely to screen readers. */
export function Toast({ message, visible, onHide, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onHide, durationMs);
    return () => clearTimeout(timer);
  }, [visible, onHide, durationMs]);

  return (
    <div
      role="status"
      className={cn(
        "fixed inset-x-margin bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-sm items-center gap-space-sm rounded-xl bg-inverse-surface px-space-md py-3 text-body-md text-inverse-on-surface shadow-level-3 transition-all duration-300 md:bottom-space-lg",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {visible && (
        <>
          <CircleCheck aria-hidden className="size-5 shrink-0 text-secondary-fixed-dim" />
          {message}
        </>
      )}
    </div>
  );
}
