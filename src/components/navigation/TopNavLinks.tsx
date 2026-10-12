"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { MAIN_NAV_LABEL, NAV_ITEMS, isNavItemActive } from "./navItems";

export function TopNavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label={MAIN_NAV_LABEL} className="hidden md:block">
      <ul className="flex items-center gap-space-xs">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = isNavItemActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-lg px-space-md text-label-md transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isActive
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
