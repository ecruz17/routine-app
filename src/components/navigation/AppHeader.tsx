import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { APP_NAME } from "./navItems";
import { TopNavLinks } from "./TopNavLinks";

type AppHeaderProps = {
  /** Undefined while the profile loads. */
  userName?: string;
};

export function AppHeader({ userName }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface/85 shadow-[0_1px_8px_rgb(0_0_0/0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-margin md:px-margin-md">
        <div className="flex items-center gap-space-lg">
          <Link
            href="/home"
            className="flex items-center gap-space-sm rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-on-primary">
              <CalendarCheck aria-hidden className="size-5" />
            </span>
            <span className="font-display text-title-sm tracking-tight text-on-surface md:text-headline-md">
              {APP_NAME}
            </span>
          </Link>
          <TopNavLinks />
        </div>
        {userName ? (
          <Link href="/profile" className="flex items-center gap-space-sm">
            <Avatar name={userName} />
            <span className="hidden text-label-md text-on-surface lg:inline hover:underline">{userName}</span>
          </Link>
        ) : (
          <span aria-hidden className="size-9 animate-pulse rounded-full bg-surface-container" />
        )}
      </div>
    </header>
  );
}
