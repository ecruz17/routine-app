import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article" | "aside";
};

export function Card({ as: Component = "div", className, ...props }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-xl border border-border-subtle bg-surface-container-lowest p-space-md shadow-level-1 sm:p-space-lg",
        className,
      )}
      {...props}
    />
  );
}
