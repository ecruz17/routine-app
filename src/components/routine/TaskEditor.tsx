"use client";

import { useState, type FormEvent } from "react";
import { SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { taskEditSchema, type Task, type TaskEdit } from "@/lib/schemas";
import { addMinutesToTime, formatDuration, to12h } from "@/lib/time-format";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Sheet } from "@/components/ui/Sheet";
import { TextInput } from "@/components/ui/TextInput";
import { TimeInput } from "@/components/ui/TimeInput";
import { routineCopy } from "./copy";

type TaskEditorProps = {
  /** Task being edited; the sheet is closed when null. Remount with `key={task?.id}` to reset the form. */
  task: Task | null;
  onSave: (taskId: string, changes: TaskEdit) => void;
  onClose: () => void;
};

type FieldErrors = Partial<Record<keyof TaskEdit, string>>;

export function TaskEditor({ task, onSave, onClose }: TaskEditorProps) {
  const copy = routineCopy.editor;
  const [title, setTitle] = useState(task?.title ?? "");
  const [startTime, setStartTime] = useState(task?.startTime ?? "");
  const [duration, setDuration] = useState(task ? String(task.durationMinutes) : "");
  const [errors, setErrors] = useState<FieldErrors>({});

  const durationMinutes = duration === "" ? Number.NaN : Number(duration);
  const hasValidPreview = startTime !== "" && Number.isInteger(durationMinutes) && durationMinutes > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!task) return;

    const result = taskEditSchema.safeParse({ title, startTime, durationMinutes });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors({
        title: fieldErrors.title?.[0],
        startTime: fieldErrors.startTime?.[0],
        durationMinutes: fieldErrors.durationMinutes?.[0],
      });
      return;
    }
    onSave(task.id, result.data);
  };

  return (
    <Sheet
      open={task !== null}
      title={copy.title}
      closeLabel={copy.close}
      icon={<SlidersHorizontal aria-hidden className="size-5 text-primary" />}
      onClose={onClose}
    >
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-space-md">
        <Field label={copy.titleLabel} error={errors.title}>
          {(controlProps) => (
            <TextInput {...controlProps} value={title} onChange={(event) => setTitle(event.target.value)} />
          )}
        </Field>

        <div className="grid grid-cols-2 gap-space-sm">
          <Field label={copy.startTimeLabel} error={errors.startTime}>
            {(controlProps) => <TimeInput {...controlProps} value={startTime} onChange={setStartTime} />}
          </Field>
          <Field
            label={copy.durationLabel}
            error={errors.durationMinutes}
            hint={hasValidPreview ? formatDuration(durationMinutes) : undefined}
          >
            {(controlProps) => (
              <TextInput
                {...controlProps}
                type="number"
                inputMode="numeric"
                min={5}
                max={720}
                step={5}
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            )}
          </Field>
        </div>

        {hasValidPreview && (
          <p className="text-body-sm text-on-surface-variant" aria-live="polite">
            {copy.endsAt(to12h(addMinutesToTime(startTime, durationMinutes)))}
          </p>
        )}

        <div className="flex flex-col-reverse gap-space-sm pt-space-xs sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            {copy.cancel}
          </Button>
          <Button type="submit">{copy.save}</Button>
        </div>
      </form>
    </Sheet>
  );
}
