import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { TextArea } from "@/components/ui/TextArea";

type PromptFieldAccent = "primary" | "secondary";

type PromptFieldProps = Omit<ComponentPropsWithRef<"textarea">, "id"> & {
  step: number;
  label: ReactNode;
  hint: string;
  accent?: PromptFieldAccent;
  badge?: ReactNode;
};

const stepClasses: Record<PromptFieldAccent, string> = {
  primary: "bg-primary-fixed text-primary",
  secondary: "bg-secondary-fixed text-secondary",
};

export function PromptField({
  step,
  label,
  hint,
  accent = "primary",
  badge,
  ...textareaProps
}: PromptFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-space-xs">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <label htmlFor={id} className="flex items-center gap-space-sm font-display text-title-sm text-on-surface">
          <span
            aria-hidden
            className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold", stepClasses[accent])}
          >
            {step}
          </span>
          <span>{label}</span>
        </label>
        {badge}
      </div>
      <p id={hintId} className="text-body-sm text-on-surface-variant">
        {hint}
      </p>
      <TextArea id={id} aria-describedby={hintId} accent={accent} className="mt-1" {...textareaProps} />
    </div>
  );
}
