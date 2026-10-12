"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

/** "/" → Home when a completed profile exists, otherwise onboarding. */
export function RootRedirect() {
  const router = useRouter();
  const profile = useProfile();

  useEffect(() => {
    if (profile === undefined) return;
    router.replace(profile?.onboardingCompleted ? "/home" : "/onboarding");
  }, [profile, router]);

  return (
    <main className="flex flex-1 items-center justify-center" aria-busy>
      <Loader2 aria-label="Cargando" className="size-8 animate-spin text-primary" />
    </main>
  );
}
