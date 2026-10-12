import { cn } from "@/lib/cn";
import { onboardingCopy } from "./copy";

type StepProgressProps = {
  /** 1-based current step. */
  current: number;
  total: number;
};

/** Segmented progress bar: done/current segments filled. */
export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div
      role="progressbar"
      aria-label={onboardingCopy.progress(Math.min(current, total), total)}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={Math.min(current, total)}
      className="flex flex-1 gap-1.5"
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors duration-300",
            index < current - 1 ? "bg-success" : index === current - 1 ? "bg-primary" : "bg-surface-container-high",
          )}
        />
      ))}
    </div>
  );
}
