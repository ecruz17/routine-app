import { useId } from "react";

type SwitchProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Native checkbox exposed as a switch, with a visible label and ≥44px hit area. */
export function Switch({ label, description, checked, onChange }: SwitchProps) {
  const id = useId();
  const descriptionId = `${id}-description`;

  return (
    <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center justify-between gap-space-md">
      <span className="flex flex-col">
        <span className="text-label-md text-on-surface">{label}</span>
        {description && (
          <span id={descriptionId} className="text-body-sm text-on-surface-variant">
            {description}
          </span>
        )}
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        aria-describedby={description ? descriptionId : undefined}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="relative h-7 w-12 shrink-0 rounded-full bg-surface-container-highest transition-colors peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow-level-1 after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  );
}
