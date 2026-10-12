"use client";

import type { ReactNode } from "react";
import { useProfile } from "@/hooks/useProfile";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

/**
 * App chrome for the main tabs. Always renders `children`: with Cache
 * Components a layout must not hold its page segment behind client-only data
 * (localStorage), or the segment is dropped from prerendering. Each page wraps
 * its screen in <ProfileGate> instead.
 */
export function MainShell({ children }: { children: ReactNode }) {
  const profile = useProfile();

  return (
    <>
      <AppHeader userName={profile?.name} />
      <main className="mx-auto w-full max-w-300 flex-1 px-margin pt-space-lg pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-margin-md md:pb-space-xl">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
