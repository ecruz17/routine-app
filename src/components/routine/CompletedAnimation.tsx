"use client";

import type { CSSProperties } from "react";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";

type CompletedAnimationCopy = {
  title: string;
  message: string;
  stats: readonly { label: string; value: string }[];
  close: string;
  action: string;
};

type CompletedAnimationProps = {
  open: boolean;
  copy: CompletedAnimationCopy;
  onClose: () => void;
};

const CONFETTI = [
  { x: "-56px", y: "-40px", color: "bg-success", delay: "0ms" },
  { x: "56px", y: "-44px", color: "bg-primary", delay: "60ms" },
  { x: "-64px", y: "16px", color: "bg-tertiary", delay: "120ms" },
  { x: "64px", y: "20px", color: "bg-warning", delay: "40ms" },
  { x: "-24px", y: "-64px", color: "bg-primary", delay: "100ms" },
  { x: "28px", y: "-66px", color: "bg-success", delay: "160ms" },
  { x: "-36px", y: "52px", color: "bg-warning", delay: "80ms" },
  { x: "36px", y: "54px", color: "bg-tertiary", delay: "140ms" },
];

/** "¡Tareas completadas!" celebration. CSS-only; reduced motion is handled globally. */
export function CompletedAnimation({ open, copy, onClose }: CompletedAnimationProps) {
  return (
    <Sheet open={open} title={copy.title} closeLabel={copy.close} onClose={onClose}>
      <div className="flex flex-col items-center gap-space-md text-center">
        <div className="relative flex size-24 items-center justify-center">
          {open &&
            CONFETTI.map(({ x, y, color, delay }) => (
              <span
                key={`${x}${y}`}
                aria-hidden
                className={`absolute size-2.5 animate-confetti rounded-full ${color}`}
                style={{ "--confetti-x": x, "--confetti-y": y, animationDelay: delay } as CSSProperties}
              />
            ))}
          <span className="flex size-20 animate-celebrate-pop items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-level-2">
            <PartyPopper aria-hidden className="size-10" />
          </span>
        </div>

        <p className="text-body-lg text-on-surface-variant" role="status">
          {copy.message}
        </p>

        <dl className="grid w-full grid-cols-2 gap-space-sm rounded-xl bg-surface-container-low p-space-md">
          {copy.stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col-reverse items-center">
              <dt className="text-body-sm text-on-surface-variant">{label}</dt>
              <dd className="font-display text-headline-md font-bold text-secondary">{value}</dd>
            </div>
          ))}
        </dl>

        <Button variant="success" onClick={onClose} className="w-full">
          {copy.action}
        </Button>
      </div>
    </Sheet>
  );
}
