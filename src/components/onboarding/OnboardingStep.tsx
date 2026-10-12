import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { onboardingCopy } from "./copy";

type OnboardingStepProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  /** Extra actions above the main button (e.g. "skip"). */
  secondaryAction?: ReactNode;
  submitLabel?: string;
  canSubmit: boolean;
  onSubmit: () => void;
};

/**
 * One wizard screen: heading, content, and a full-width primary button pinned
 * to the bottom on mobile. Enter submits; the heading takes focus on mount so
 * screen readers announce each new step.
 */
export function OnboardingStep({
  eyebrow,
  title,
  description,
  children,
  secondaryAction,
  submitLabel = onboardingCopy.next,
  canSubmit,
  onSubmit,
}: OnboardingStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) onSubmit();
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col gap-space-lg">
      <div className="flex flex-col gap-space-xs">
        <span className="text-label-sm tracking-wider text-primary uppercase">{eyebrow}</span>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-headline-lg-mobile text-on-surface outline-none md:text-headline-lg"
        >
          {title}
        </h1>
        <p className="text-body-lg text-on-surface-variant">{description}</p>
      </div>

      {children}

      <div className="mt-auto flex flex-col gap-space-sm pt-space-md">
        {secondaryAction}
        <Button type="submit" size="lg" disabled={!canSubmit} className="w-full">
          {submitLabel}
          <ArrowRight aria-hidden className="size-5" />
        </Button>
      </div>
    </form>
  );
}
