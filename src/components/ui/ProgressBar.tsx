import { cn } from "@/lib/cn";

type ProgressBarProps = {
  /** 0–100 */
  value: number;
  label: string;
  className?: string;
};

/** DESIGN.md daily progress bar: 8px track, indigo → emerald fill. */
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-border-input", className)}
    >
      <div
        className="h-full rounded-full bg-linear-to-r from-indigo-500 to-success transition-[width] duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
