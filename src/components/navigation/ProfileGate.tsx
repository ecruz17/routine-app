"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { ScreenSkeleton } from "@/components/ui/ScreenSkeleton";

type ProfileGateProps = {
  /** Rendered while hydrating or redirecting. */
  fallback?: ReactNode;
  children: ReactNode;
};

/**
 * Renders children only when a completed profile exists; otherwise sends the
 * user to onboarding. Use it inside a page (not a layout, see MainShell) so
 * children can call `useRequiredProfile()`.
 */
export function ProfileGate({ fallback = <ScreenSkeleton />, children }: ProfileGateProps) {
  const router = useRouter();
  const profile = useProfile();
  const needsOnboarding = profile === null || profile?.onboardingCompleted === false;

  useEffect(() => {
    if (needsOnboarding) router.replace("/onboarding");
  }, [needsOnboarding, router]);

  if (!profile || needsOnboarding) return fallback;
  return children;
}
