import { PartyPopper } from "lucide-react";
import type { WorkSchedule } from "@/lib/schemas";
import { to12h } from "@/lib/time-format";
import { onboardingCopy } from "./copy";
import { OnboardingStep } from "./OnboardingStep";

type DoneStepProps = {
  name: string;
  dayStart: string;
  dayEnd: string;
  workSchedule: WorkSchedule | null;
  onFinish: () => void;
};

export function DoneStep({ name, dayStart, dayEnd, workSchedule, onFinish }: DoneStepProps) {
  const copy = onboardingCopy.done;

  return (
    <OnboardingStep
      eyebrow={copy.eyebrow}
      title={copy.title(name)}
      description={copy.description}
      submitLabel={copy.finish}
      canSubmit
      onSubmit={onFinish}
    >
      <div className="flex justify-center py-space-sm">
        <span className="flex size-20 animate-celebrate-pop items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-level-2">
          <PartyPopper aria-hidden className="size-10" />
        </span>
      </div>
      <dl className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md">
        <div className="flex items-center justify-between gap-space-sm">
          <dt className="text-body-md text-on-surface-variant">{copy.summaryDay}</dt>
          <dd className="text-label-md text-on-surface">
            {to12h(dayStart)} – {to12h(dayEnd)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-space-sm">
          <dt className="text-body-md text-on-surface-variant">{copy.summaryWork}</dt>
          <dd className="text-label-md text-on-surface">
            {workSchedule ? `${to12h(workSchedule.start)} – ${to12h(workSchedule.end)}` : copy.noWork}
          </dd>
        </div>
      </dl>
    </OnboardingStep>
  );
}
