import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-margin pt-space-md pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:my-space-xl md:min-h-0 md:rounded-xl md:bg-surface-container-lowest md:px-space-lg md:pb-space-lg md:shadow-level-2">
      <OnboardingWizard />
    </main>
  );
}
