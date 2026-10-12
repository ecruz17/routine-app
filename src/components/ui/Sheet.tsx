"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type SheetProps = {
  open: boolean;
  title: string;
  icon?: ReactNode;
  closeLabel?: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Modal built on the native <dialog>: focus trapping, Esc and focus return
 * come from the browser. Bottom sheet on mobile, centered card from `md`.
 */
export function Sheet({ open, title, icon, closeLabel = "Cerrar", onClose, children }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Clicks on the backdrop target the <dialog> element itself.
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "mx-0 mt-auto mb-0 max-h-[90dvh] w-full max-w-full overflow-y-auto rounded-t-xl bg-surface-container-lowest text-on-surface shadow-level-3",
        "backdrop:bg-on-background/40 backdrop:backdrop-blur-sm",
        "md:m-auto md:max-w-md md:rounded-xl",
      )}
    >
      <div className="flex flex-col gap-space-md p-space-lg pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-space-lg">
        <div className="flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            {icon}
            <h2 id={titleId} className="font-display text-title-sm">
              {title}
            </h2>
          </div>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
