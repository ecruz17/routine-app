import type { FormEvent } from "react";
import { CircleAlert, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { homeCopy } from "./copy";
import { PromptField } from "./PromptField";

type RoutineInputFormProps = {
  dayLabel: string;
  userTasks: string;
  events: string;
  isSubmitting: boolean;
  /** Error from the last attempt; the typed text is kept. */
  error?: string | null;
  onUserTasksChange: (value: string) => void;
  onEventsChange: (value: string) => void;
  onSubmit: () => void;
};

export function RoutineInputForm({
  dayLabel,
  userTasks,
  events,
  isSubmitting,
  error,
  onUserTasksChange,
  onEventsChange,
  onSubmit,
}: RoutineInputFormProps) {
  const copy = homeCopy.form;
  const canSubmit = userTasks.trim().length > 0 && !isSubmitting;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) onSubmit();
  };

  return (
    <Card as="section">
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
        <PromptField
          step={1}
          label={
            <>
              {copy.userTasksLabelPrefix} <strong className="text-primary">{dayLabel}</strong>{" "}
              {copy.userTasksLabelSuffix}
            </>
          }
          hint={copy.userTasksHint}
          placeholder={copy.userTasksPlaceholder}
          rows={4}
          required
          value={userTasks}
          disabled={isSubmitting}
          onChange={(event) => onUserTasksChange(event.target.value)}
        />

        <div aria-hidden className="h-px w-full bg-surface-container" />

        <PromptField
          step={2}
          accent="secondary"
          label={copy.eventsLabel}
          hint={copy.eventsHint}
          badge={
            <Chip>
              <span aria-hidden className="size-1.5 rounded-full bg-secondary" />
              {copy.eventsBadge}
            </Chip>
          }
          placeholder={copy.eventsPlaceholder}
          rows={3}
          value={events}
          disabled={isSubmitting}
          onChange={(event) => onEventsChange(event.target.value)}
        />

        {error && (
          <p role="alert" className="flex items-start gap-space-sm rounded-lg bg-error-container p-space-md text-body-md text-on-error-container">
            <CircleAlert aria-hidden className="mt-0.5 size-4.5 shrink-0" />
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse items-stretch justify-between gap-space-md pt-space-sm sm:flex-row sm:items-center">
          <p className="flex items-center gap-space-sm text-body-sm text-on-surface-variant">
            <ShieldCheck aria-hidden className="size-4.5 text-secondary" />
            {copy.footerNote}
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            isLoading={isSubmitting}
            leftIcon={<Sparkles aria-hidden className="size-5" />}
          >
            {isSubmitting ? copy.submitting : copy.submit}
          </Button>
        </div>
      </form>
    </Card>
  );
}
