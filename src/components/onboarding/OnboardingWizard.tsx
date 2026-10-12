"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import type { WorkSchedule } from "@/lib/schemas";
import { saveProfile, useProfile } from "@/hooks/useProfile";
import { onboardingCopy } from "./copy";
import { DayHoursStep } from "./DayHoursStep";
import { DoneStep } from "./DoneStep";
import { NameStep } from "./NameStep";
import { StepProgress } from "./StepProgress";
import { WorkScheduleStep } from "./WorkScheduleStep";

type OnboardingDraft = {
  name: string;
  dayStart: string;
  dayEnd: string;
  /** Kept when the step is skipped so going back restores the times. */
  work: WorkSchedule;
  hasWork: boolean;
};

const INITIAL_DRAFT: OnboardingDraft = {
  name: "",
  dayStart: "08:00",
  dayEnd: "23:00",
  work: { start: "09:00", end: "17:00" },
  hasWork: true,
};

const QUESTION_STEPS = 3; // name, day hours, work schedule; then "¡Todo listo!"

export function OnboardingWizard() {
  const router = useRouter();
  const profile = useProfile();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(INITIAL_DRAFT);
  const alreadyOnboarded = Boolean(profile?.onboardingCompleted);

  useEffect(() => {
    if (alreadyOnboarded) router.replace("/home");
  }, [alreadyOnboarded, router]);

  if (profile === undefined || alreadyOnboarded) {
    return (
      <div className="flex flex-1 items-center justify-center" aria-busy>
        <Loader2 aria-label="Cargando" className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const next = (changes: Partial<OnboardingDraft>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setStep((current) => current + 1);
  };

  const workSchedule = draft.hasWork ? draft.work : null;

  const finish = () => {
    saveProfile({
      name: draft.name,
      dayStart: draft.dayStart,
      dayEnd: draft.dayEnd,
      workSchedule,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    });
    router.replace("/home");
  };

  return (
    <div className="flex flex-1 flex-col gap-space-lg">
      <div className="flex min-h-11 items-center gap-space-sm">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current - 1)}
            aria-label={onboardingCopy.back}
            className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ChevronLeft aria-hidden className="size-6" />
          </button>
        ) : (
          <span aria-hidden className="-ml-2 size-11 shrink-0" />
        )}
        <StepProgress current={step + 1} total={QUESTION_STEPS} />
        <span aria-hidden className="w-10 shrink-0 text-right text-label-sm text-on-surface-variant">
          {Math.min(step + 1, QUESTION_STEPS)}/{QUESTION_STEPS}
        </span>
      </div>

      {/* `key` remounts each step so its form state and focus handling start fresh. */}
      {step === 0 && <NameStep key="name" initialName={draft.name} onNext={(name) => next({ name })} />}
      {step === 1 && (
        <DayHoursStep
          key="day"
          initialValues={{ dayStart: draft.dayStart, dayEnd: draft.dayEnd }}
          onNext={(values) => next(values)}
        />
      )}
      {step === 2 && (
        <WorkScheduleStep
          key="work"
          dayStart={draft.dayStart}
          dayEnd={draft.dayEnd}
          initialValues={draft.work}
          onNext={(work) => next(work ? { work, hasWork: true } : { hasWork: false })}
        />
      )}
      {step === 3 && (
        <DoneStep
          key="done"
          name={draft.name}
          dayStart={draft.dayStart}
          dayEnd={draft.dayEnd}
          workSchedule={workSchedule}
          onFinish={finish}
        />
      )}
    </div>
  );
}
