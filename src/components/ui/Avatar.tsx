import { cn } from "@/lib/cn";

type AvatarSize = "md" | "xl";

type AvatarProps = {
  name: string;
  size?: AvatarSize;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  md: "size-9 text-label-md",
  xl: "size-24 text-headline-lg md:size-28",
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("es"))
    .join("");
}

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary-fixed font-display text-on-primary-fixed-variant",
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
