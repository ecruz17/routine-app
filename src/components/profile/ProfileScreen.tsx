"use client";

import { useCallback, useState } from "react";
import type { UserProfile } from "@/lib/schemas";
import { updateProfile, useRequiredProfile } from "@/hooks/useProfile";
import { Toast } from "@/components/ui/Toast";
import { profileCopy } from "./copy";
import { DaySection } from "./DaySection";
import { ProfileHero } from "./ProfileHero";
import { WorkSection } from "./WorkSection";

/** Each section saves itself with its "Listo" button. */
export function ProfileScreen() {
  const profile = useRequiredProfile();
  const [showSavedToast, setShowSavedToast] = useState(false);
  const hideToast = useCallback(() => setShowSavedToast(false), []);

  const save = (changes: Partial<UserProfile>) => {
    updateProfile(changes);
    setShowSavedToast(true);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <ProfileHero name={profile.name} onSaveName={(name) => save({ name })} />

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-2">
        <DaySection
          dayStart={profile.dayStart}
          dayEnd={profile.dayEnd}
          workSchedule={profile.workSchedule}
          onSave={save}
        />
        <WorkSection
          dayStart={profile.dayStart}
          dayEnd={profile.dayEnd}
          workSchedule={profile.workSchedule}
          onSave={(workSchedule) => save({ workSchedule })}
        />
      </div>

      <Toast message={profileCopy.savedToast} visible={showSavedToast} onHide={hideToast} />
    </div>
  );
}
