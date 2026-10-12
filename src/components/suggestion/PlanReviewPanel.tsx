import { Check, ShieldCheck, TriangleAlert } from "lucide-react";
import type { TaskIssue } from "@/lib/routine";
import type { UserProfile } from "@/lib/schemas";
import { to12h } from "@/lib/time-format";
import { Card } from "@/components/ui/Card";
import { suggestionCopy } from "./copy";

type PlanReviewPanelProps = {
  issueCounts: Record<TaskIssue, number>;
  profile: UserProfile;
  hasWorkSchedule: boolean;
};

type ReviewCheck = { id: TaskIssue; ok: boolean; text: string };

export function PlanReviewPanel({ issueCounts, profile, hasWorkSchedule }: PlanReviewPanelProps) {
  const copy = suggestionCopy.review;

  const checks: ReviewCheck[] = [
    {
      id: "overlap",
      ok: issueCounts.overlap === 0,
      text: issueCounts.overlap === 0 ? copy.noOverlap : copy.overlap(issueCounts.overlap),
    },
    ...(hasWorkSchedule
      ? [
          {
            id: "workSchedule" as const,
            ok: issueCounts.workSchedule === 0,
            text:
              issueCounts.workSchedule === 0 ? copy.workRespected : copy.workConflict(issueCounts.workSchedule),
          },
        ]
      : []),
    {
      id: "outsideDay",
      ok: issueCounts.outsideDay === 0,
      text:
        issueCounts.outsideDay === 0
          ? copy.withinDay(to12h(profile.dayStart), to12h(profile.dayEnd))
          : copy.outsideDay(issueCounts.outsideDay),
    },
  ];

  return (
    <Card as="aside" aria-labelledby="plan-review-title" className="flex flex-col gap-space-sm">
      <h2 id="plan-review-title" className="flex items-center gap-1.5 text-label-md text-on-surface">
        <ShieldCheck aria-hidden className="size-4.5 text-secondary" />
        {copy.title}
      </h2>
      <ul aria-live="polite" className="flex flex-col gap-2 text-body-sm text-on-surface-variant">
        {checks.map(({ id, ok, text }) => (
          <li key={id} className="flex items-start gap-2">
            {ok ? (
              <Check aria-hidden className="mt-px size-4 shrink-0 text-secondary" />
            ) : (
              <TriangleAlert aria-hidden className="mt-px size-4 shrink-0 text-warning" />
            )}
            <span className={ok ? undefined : "text-on-warning-container"}>{text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
