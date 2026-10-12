type ProgressRingProps = {
  /** 0–100 */
  value: number;
};

const RADIUS = 15.9155; // circumference ≈ 100, so the dash length equals the percentage

/** Decorative circular progress; pair it with an accessible ProgressBar or text. */
export function ProgressRing({ value }: ProgressRingProps) {
  return (
    <div aria-hidden className="relative flex size-16 shrink-0 items-center justify-center">
      <svg viewBox="0 0 36 36" className="size-16 -rotate-90">
        <circle cx="18" cy="18" r={RADIUS} fill="none" strokeWidth="3.5" className="stroke-surface-variant" />
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${value} 100`}
          className="stroke-success transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <span className="absolute font-display text-label-md font-bold text-on-surface">{value}%</span>
    </div>
  );
}
