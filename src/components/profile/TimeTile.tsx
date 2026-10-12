import type { ReactNode } from "react";
import { to12h } from "@/lib/time-format";
import { Field } from "@/components/ui/Field";
import { TimeInput } from "@/components/ui/TimeInput";

type TimeTileProps = {
  label: string;
  icon?: ReactNode;
  value: string;
  isEditing: boolean;
  error?: string;
  /** Small note under the value, e.g. "día siguiente". */
  hint?: string;
  onChange: (value: string) => void;
};

/** Shows a time in 12h format, or a time input while editing. */
export function TimeTile({ label, icon, value, isEditing, error, hint, onChange }: TimeTileProps) {
  return (
    <div className="flex flex-col gap-space-xs rounded-lg bg-surface-container-low p-space-md">
      {isEditing ? (
        <Field label={label} error={error} hint={hint}>
          {(controlProps) => <TimeInput {...controlProps} value={value} onChange={onChange} />}
        </Field>
      ) : (
        <>
          <span className="flex items-center justify-between text-label-sm tracking-wider text-on-surface-variant uppercase">
            {label}
            {icon}
          </span>
          <span className="font-display text-headline-md text-on-surface">{value ? to12h(value) : "—"}</span>
          {error ? (
            <span className="text-body-sm text-error">{error}</span>
          ) : (
            hint && <span className="text-body-sm text-on-surface-variant">{hint}</span>
          )}
        </>
      )}
    </div>
  );
}
