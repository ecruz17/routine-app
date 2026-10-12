"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/lib/schemas";
import { addDays, formatLongDayLabel, startOfWeek } from "@/lib/dates";
import { getHomeInput, setHomeInput } from "@/lib/home-input-store";
import { OrganizeError, organizeRoutine, type OrganizeErrorKind } from "@/lib/ai-client";
import { DaySelector } from "@/components/calendar/DaySelector";
import { useRequiredProfile } from "@/hooks/useProfile";
import { saveDraftRoutine } from "@/hooks/useRoutine";
import { useToday } from "@/hooks/useToday";
import { AiTipsPanel } from "./AiTipsPanel";
import { homeCopy } from "./copy";
import { Greeting } from "./Greeting";
import { ScreenSkeleton } from "@/components/ui/ScreenSkeleton";
import { RoutineInputForm } from "./RoutineInputForm";
import { WorkHoursBadge } from "./WorkHoursBadge";

function errorMessage(kind: OrganizeErrorKind | null): string {
  const errors = homeCopy.form.errors;
  switch (kind) {
    case "rateLimited":
      return errors.rateLimited;
    case "timeout":
      return errors.timeout;
    case "network":
      return errors.network;
    case "noTasks":
      return errors.noTasks;
    default:
      return errors.generic; // server error, invalid JSON/shape, unexpected
  }
}

export function HomeScreen() {
  const profile = useRequiredProfile();
  const today = useToday();

  if (!today) return <ScreenSkeleton />;

  return <HomeScreenContent profile={profile} today={today} />;
}

function HomeScreenContent({ profile, today }: { profile: UserProfile; today: string }) {
  const router = useRouter();
  // Restore what the user typed before (other tab, cancelled proposal…).
  const [initialInput] = useState(getHomeInput);
  const initialDate = initialInput.date && initialInput.date >= today ? initialInput.date : today;

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(initialDate));
  const [userTasks, setUserTasks] = useState(initialInput.userTasks);
  const [events, setEvents] = useState(initialInput.events);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setHomeInput({ date: selectedDate, userTasks, events });
  }, [selectedDate, userTasks, events]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const tasks = await organizeRoutine({ date: selectedDate, userTasks, events, profile });
      saveDraftRoutine({
        id: crypto.randomUUID(),
        date: selectedDate,
        status: "draft",
        tasks,
        rawInput: { userTasks: userTasks.trim(), events: events.trim() },
        createdAt: new Date().toISOString(),
      });
      router.push("/home/suggestion");
    } catch (caught) {
      // The form re-enables and keeps the typed text.
      setError(errorMessage(caught instanceof OrganizeError ? caught.kind : null));
    } finally {
      if (isMounted.current) setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-col items-start justify-between gap-space-md lg:flex-row lg:items-center">
        <Greeting name={profile.name} />
        <WorkHoursBadge date={selectedDate} />
      </div>

      <DaySelector
        title={homeCopy.daySelectorTitle}
        weekStart={weekStart}
        selectedDate={selectedDate}
        today={today}
        onSelect={setSelectedDate}
        onPreviousWeek={() => setWeekStart((current) => addDays(current, -7))}
        onNextWeek={() => setWeekStart((current) => addDays(current, 7))}
      />

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RoutineInputForm
            dayLabel={formatLongDayLabel(selectedDate)}
            userTasks={userTasks}
            events={events}
            isSubmitting={isSubmitting}
            error={error}
            onUserTasksChange={setUserTasks}
            onEventsChange={setEvents}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="lg:col-span-4">
          <AiTipsPanel tips={homeCopy.tips.items} />
        </div>
      </div>
    </div>
  );
}
