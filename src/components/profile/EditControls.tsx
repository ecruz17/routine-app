import { Check, Pencil, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { profileCopy } from "./copy";

type EditControlsProps = {
  /** Section name used in the accessible labels, e.g. "Tu día". */
  section: string;
  isEditing: boolean;
  /** id of the section's <form>; "Listo" submits it, so Enter in an input saves too. */
  formId: string;
  canSave: boolean;
  onEdit: () => void;
  onCancel: () => void;
};

const buttonClass = cn(
  "flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-space-sm text-label-md transition-colors",
  "focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50",
);

/** Editar → Cancelar / Listo. "Listo" saves the section. */
export function EditControls({ section, isEditing, formId, canSave, onEdit, onCancel }: EditControlsProps) {
  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={onEdit}
        aria-label={profileCopy.editSectionLabel(section)}
        className={cn(buttonClass, "bg-surface-container-low text-on-surface hover:bg-surface-container-high")}
      >
        <Pencil aria-hidden className="size-4" />
        <span aria-hidden>{profileCopy.edit}</span>
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-space-xs">
      <button
        type="button"
        onClick={onCancel}
        aria-label={profileCopy.cancelSectionLabel(section)}
        className={cn(buttonClass, "text-on-surface-variant hover:bg-surface-container-high")}
      >
        <X aria-hidden className="size-4" />
        <span aria-hidden className="hidden sm:inline">
          {profileCopy.cancel}
        </span>
      </button>
      <button
        type="submit"
        form={formId}
        disabled={!canSave}
        aria-label={profileCopy.saveSectionLabel(section)}
        className={cn(buttonClass, "bg-primary text-on-primary hover:bg-primary-hover")}
      >
        <Check aria-hidden className="size-4" />
        <span aria-hidden>{profileCopy.done}</span>
      </button>
    </div>
  );
}
