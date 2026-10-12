import { Suspense } from "react";
import { ChecklistScreen } from "@/components/checklist/ChecklistScreen";
import { ProfileGate } from "@/components/navigation/ProfileGate";
import { ScreenSkeleton } from "@/components/ui/ScreenSkeleton";

export default function ChecklistPage() {
  // Suspense: ChecklistScreen reads `?date=` with useSearchParams.
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <ProfileGate>
        <ChecklistScreen />
      </ProfileGate>
    </Suspense>
  );
}
