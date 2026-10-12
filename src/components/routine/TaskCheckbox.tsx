import { Check } from "lucide-react";
import { routineCopy } from "./copy";

type TaskCheckboxProps = {
  taskTitle: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Native checkbox (keyboard + screen readers) with the DESIGN.md look and a 44px hit area. */
export function TaskCheckbox({ taskTitle, checked, onChange }: TaskCheckboxProps) {
  return (
    <label className="relative -m-2.5 flex size-11 cursor-pointer items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={routineCopy.checkTaskLabel(taskTitle)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="flex size-6 items-center justify-center rounded-lg border-[1.5px] border-slate-300 bg-surface-container-lowest text-white transition-colors peer-checked:animate-check-spring peer-checked:border-success peer-checked:bg-success peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-hover:border-success"
      >
        <Check className={checked ? "size-4" : "size-4 opacity-0"} strokeWidth={3} />
      </span>
    </label>
  );
}
