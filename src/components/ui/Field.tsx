import { useId, type ReactElement, type ReactNode } from "react";

type FieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

type FieldProps = {
  label: string;
  hint?: ReactNode;
  error?: string;
  /** Receives the accessibility props to spread on the input. */
  children: (controlProps: FieldControlProps) => ReactElement;
};

/** Label + control + hint/error, wired together for screen readers. */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-space-xs">
      <label htmlFor={id} className="text-label-md text-on-surface">
        {label}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error ? (
        <p id={errorId} className="text-body-sm text-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-body-sm text-on-surface-variant">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
