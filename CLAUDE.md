# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

**Routine Organizer** is a mobile-first Next.js web app that uses AI to turn a vague, unordered description of what the user wants to do on a given day into a time-blocked checklist.

The user configures their unavailable hours (e.g. work/school schedule) and day start/end times in their profile. The AI respects those constraints when scheduling tasks.

- **UI language:** Spanish. All user-facing copy is in Spanish; code, comments, identifiers and commit messages are in English.
- **v1 persistence:** browser `localStorage` only. No database, no auth.
- **AI:** called through an existing AWS Lambda endpoint (with throttling) that owns the model credentials. The backend is already built; this repo only consumes it, through a same-origin proxy (`src/app/api/organize/route.ts`) that adds the API Gateway key server-side. The browser never sees an API key.
- **v1 has no notifications or reminders.** See "Out of scope for v1".

## Tech stack

- Next.js (App Router) + TypeScript (strict mode)
- Tailwind CSS, mobile-first
- `zod` for validating profile data, localStorage payloads, and AI responses
- `lucide-react` for icons (e.g. the spinning `Loader2` on "Organizando")

If a library isn't installed yet, prefer adding the ones above over introducing alternatives. Ask before adding a new state-management or UI-component library.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit (add this script if missing)
npm test           # unit tests (if configured)
```

Run `npm run lint` and `npm run typecheck` before considering a change complete.

## Directory structure (target)

```
src/
  app/
    layout.tsx                 # root layout, <html lang="es">, viewport meta
    page.tsx                   # redirects: onboarding if no profile, otherwise /home
    onboarding/page.tsx        # multi-step onboarding wizard
    (main)/                    # route group that renders the bottom navigation bar
      layout.tsx
      home/page.tsx            # Home: describe the day, "Organizar rutina"
      home/suggestion/page.tsx # AI routine proposal: edit, confirm or cancel
      checklist/page.tsx       # Current routine checklist
      profile/page.tsx         # Profile editing
  components/
    ui/                        # generic primitives (Button, TextArea, TimeInput, Card, Sheet, Progress…)
    navigation/BottomNav.tsx, AppHeader.tsx
    onboarding/                # OnboardingWizard + one component per step
    calendar/                  # DaySelector (Home, Checklist), WeekdayIndicator (Profile, Onboarding)
    home/                      # Home screen sections + copy.ts
    suggestion/                # Routine suggestion screen sections + copy.ts
    checklist/                 # Checklist screen sections + copy.ts
    routine/TaskItem.tsx, TaskEditor.tsx, RoutineTimeline.tsx, CompletedAnimation.tsx…
  lib/
    storage.ts                 # typed localStorage helpers (the ONLY place that touches localStorage)
    schemas.ts                 # zod schemas + inferred types
    ai-client.ts               # calls the Lambda endpoint, maps request/response (see "AI integration")
    time-format.ts             # 12h string <-> "HH:mm", Spanish duration parsing
    dates.ts                   # calendar date helpers, Spanish formatting
    routine.ts                 # sorting, overlap checks, progress
    schedule-validation.ts     # field errors for day/work hours (Profile, Onboarding)
    home-input-store.ts        # in-memory Home text (survives navigation/cancel, not persisted)
    mocks.ts                   # mock AI organizer until ai-client exists
  hooks/
    useStoredValue.ts          # useSyncExternalStore over storage.ts (undefined = hydrating)
    useProfile.ts              # useProfile/useRequiredProfile + saveProfile/updateProfile
    useRoutine.ts              # useRoutines/useDraftRoutine + save/confirm/discard actions
    useToday.ts
```

Keep this structure unless there's a clear reason to change it; update this file if you do.

## Data model

Define these in `src/lib/schemas.ts` with zod and export inferred types. Internally, times are always `"HH:mm"` 24h strings and durations are integer minutes; dates are `"YYYY-MM-DD"` in the user's local timezone. The backend's human-readable formats are converted only at the API boundary (`ai-client.ts`).

```ts
type UserProfile = {
  name: string;                 // how the user wants to be called
  dayStart: string;             // "08:00" — weekday start of day
  dayEnd: string;               // "23:30" — weekday end of day
  workSchedule: {               // weekday school/work block (Mon–Fri)
    start: string;              // "09:00"
    end: string;                // "17:00"
  } | null;
  onboardingCompleted: boolean;
  createdAt: string;            // ISO timestamp
};

type Task = {
  id: string;                   // crypto.randomUUID(), assigned by the client
  title: string;
  startTime: string;            // "HH:mm"
  durationMinutes: number;
  completed: boolean;
  completedAt?: string;
};

type Routine = {
  id: string;
  date: string;                 // "YYYY-MM-DD"
  status: "draft" | "confirmed";
  tasks: Task[];                // always sorted by startTime
  rawInput: { userTasks: string; events: string };
  createdAt: string;
};
```

### localStorage keys

All access goes through `src/lib/storage.ts`. Never call `localStorage` directly from components.

| Key                        | Value                       |
| -------------------------- | --------------------------- |
| `ro:v1:profile`            | `UserProfile`               |
| `ro:v1:routines`           | `Record<date, Routine>`     |
| `ro:v1:draftRoutine`       | `Routine` (status `draft`)  |

Rules:
- Prefix keys with a version (`v1`) so future migrations are possible.
- Validate with zod on every read; on parse failure, discard the corrupt value instead of crashing.
- `localStorage` is unavailable during SSR. Read it only in client components / effects (`"use client"`), and render a loading state until hydrated to avoid hydration mismatches.

## AI integration

The backend is already built. **Do not change the request or response contract** below; adapt the frontend to it.

### Flow

1. On Home, the user selects a day and fills two text areas: tasks ("quisiera…") and fixed events ("considerando que tengo…").
2. `ai-client.ts` builds the request from the input and the profile, and POSTs it to the endpoint.
3. The client validates the response with zod, maps it to internal `Task`s, stores it as a `draft` routine, and navigates to the suggestion screen.

### Request (POST, `Content-Type: application/json`)

```json
{
  "userTasks": "Dar un paseo ligero, lavar el auto, leer un libro",
  "startDayTime": "8 a.m.",
  "endDayTime": "11:30 p.m.",
  "workingHours": "9 a.m. to 5 p.m.",
  "events": "Cita con el dentista a las 6:30 p.m."
}
```

All fields are strings. How to build each one:

| Field          | Source                                   | Format                                                         |
| -------------- | ---------------------------------------- | -------------------------------------------------------------- |
| `userTasks`    | Home text area 1, trimmed                | Free text, sent as typed                                       |
| `startDayTime` | `profile.dayStart`                       | 12h: `"8 a.m."`, `"7:30 a.m."` (omit `:00` minutes)            |
| `endDayTime`   | `profile.dayEnd`                         | 12h: `"11:30 p.m."`                                            |
| `workingHours` | `profile.workSchedule`                   | `"{start} to {end}"`, e.g. `"9 a.m. to 5 p.m."`                |
| `events`       | Home text area 2, trimmed                | Free text; `""` if empty                                       |

- 12h formatting: `12:00` → `"12 p.m."`, `00:00` → `"12 a.m."`, lowercase with periods (`a.m.` / `p.m.`).
- `workingHours` only applies Monday–Friday. Send `""` when the selected day is a weekend or `workSchedule` is `null`. (Confirm with the backend that `""` is handled; adjust here if it expects a different value.)
- Don't send the user's name or other unnecessary personal data.

### Response

```json
{
  "organizedTasks": [
    { "taskName": "Lavar el auto", "suggestedStartTime": "5:15 p.m.", "estimatedDuration": "1 hora" },
    { "taskName": "Leer un libro", "suggestedStartTime": "7:45 p.m.", "estimatedDuration": "2 horas" },
    { "taskName": "Organizar archivos de PC", "suggestedStartTime": "10 p.m.", "estimatedDuration": "1 hora 30 minutos" }
  ]
}
```

Mapping to `Task` (in `ai-client.ts`, using helpers from `time-format.ts`):

| Response field        | `Task` field      | Conversion                                                              |
| --------------------- | ----------------- | ----------------------------------------------------------------------- |
| `taskName`            | `title`           | Trim                                                                    |
| `suggestedStartTime`  | `startTime`       | Parse 12h string → `"HH:mm"`                                            |
| `estimatedDuration`   | `durationMinutes` | Parse Spanish duration → minutes                                        |
| —                     | `id`              | `crypto.randomUUID()`                                                   |
| —                     | `completed`       | `false`                                                                 |

Parsers must be tolerant, because the values come from a model:
- **Time:** accept `"8 a.m."`, `"5:15 p.m."`, `"8am"`, `"8 AM"`, `"8:00 a. m."`, `"20:00"`. Handle `12 a.m.` = `00:00` and `12 p.m.` = `12:00`.
- **Duration:** accept `"30 minutos"`, `"1 minuto"`, `"1 hora"`, `"2 horas"`, `"1 hora 30 minutos"`, `"1 hora y 30 minutos"`, `"1.5 horas"`, `"90 min"`, `"1 h 30 min"`.
- Write unit tests for both parsers covering the cases above. They are the most error-prone part of the app.

To display durations in the UI, use the same Spanish style (`"1 h 30 min"` or `"1 hora 30 minutos"`, but be consistent).

### Validation and error handling

- Treat AI output as untrusted. Validate the raw shape with zod (`organizedTasks` is an array of objects with three string fields). Drop individual tasks whose time or duration can't be parsed, rather than failing the whole response. If no tasks remain, show an error.
- Don't assume the returned tasks match the input one-to-one. The model may rename, split, merge, or add tasks.
- After mapping, sort by `startTime`. Overlaps or tasks outside the day are allowed through: the user fixes them in the editor. Optionally highlight them.
- Handle these errors explicitly, always re-enabling the form and keeping the typed text:
  - network failure / timeout (~20 s, via `AbortController`)
  - HTTP 429 from throttling → "Has hecho muchas solicitudes, intenta de nuevo en un momento"
  - other non-2xx responses or invalid JSON → "No pudimos organizar tu rutina. Intenta de nuevo."
- **Never** put model API keys or AWS credentials in the frontend. The API Gateway key (`x-api-key`) is only read by the `/api/organize` route handler; `ai-client.ts` calls that route, never the Lambda directly.

## Screens and behavior

The bottom navigation bar has three tabs: **Inicio** (Home), **Rutina** (Checklist), **Perfil** (Profile). It is hidden during onboarding.

### 1. Onboarding (first launch only)

Shown when no valid profile exists. One step per screen, with progress indicator and back button:

1. "¿Cómo te gustaría que te llamemos?" — name (required, trimmed, non-empty).
2. Weekday day start and end times.
3. School/work schedule ("desde X hasta Y"); allow skipping (sets `workSchedule: null`).
4. "¡Todo listo!" — saves the profile with `onboardingCompleted: true` and goes to Home.

The permissions step (notifications, calendar) from the original spec is deferred to a later version.

Validation: end times must be after start times; the work block must fit inside the day.

### 2. Home

- Heading: `Hola, {name}`
- Subtitle: `Es hora de organizar tu día`
- Day-of-week selector, **defaulting to tomorrow**.
- Text area 1 (`userTasks`) — label `El {Weekday} {day} de {Month} quisiera…` (e.g. "El Lunes 12 de Octubre quisiera…"), updating with the selected day. Placeholder: `Dar un paseo ligero, Terminar mi rompecabezas, Limpiar mi cuarto…`
- Text area 2 (`events`) — label `Considerando que tengo…`. Placeholder: `Cita con el dentista a las 5 pm, Cena familiar a las 8 pm`
- Button `Organizar rutina`. While the request runs: both text areas and the button are disabled, the label changes to `Organizando` with a spinning loader icon.
- Disable the button when text area 1 is empty.

### 3. Routine suggestion

- List of proposed tasks with start time and approximate duration (e.g. "5:15 p.m. · 1 h").
- Each task has an edit button to change title, start time and duration inline or in a sheet.
- Bottom buttons:
  - **Confirmar** → saves the routine as `confirmed` and navigates to Checklist.
  - **Cancelar** → discards the draft and returns to Home (keep the text the user typed).

### 4. Checklist (current routine)

- Indicator of the routine's day.
- Tasks in time order with details and a check button.
- Checking persists immediately to localStorage.
- When all tasks are checked, play a `¡Tareas completadas!` celebration animation (CSS-based; respect `prefers-reduced-motion`).
- Empty state when there's no confirmed routine, with a button back to Home.

### 5. Profile

- Generic avatar (initials) with the user's name; the name is editable.
- Day start/end times with edit button.
- Weekday work/school schedule with edit button (can be turned off → `workSchedule: null`).
- Each section saves itself: `Editar` → `Cancelar` / `Listo`. `Listo` (or Enter) saves that section and is **disabled while the section is invalid**; unchanged values aren't re-saved. There is no global save button.

## Dates and locale

- Use the user's local timezone. Never derive the routine date from `toISOString()` (it converts to UTC and can shift the day); use helpers in `lib/dates.ts`.
- Format dates with `Intl.DateTimeFormat("es", …)` and capitalize the weekday/month in labels ("Lunes 12 de Octubre").
- Display times in the UI in 12h format (`"5:15 p.m."`) to match the backend; store them as `"HH:mm"`.
- Week starts on Monday in the day selector.

## UI and coding conventions

- **Mobile-first:** design for ~375 px wide first, then scale up with `sm:`/`md:`. Constrain content to a centered max width on desktop.
- Respect safe areas (`env(safe-area-inset-bottom)`) for the bottom nav; touch targets ≥ 44 px.
- Accessibility: every input has a visible `<label>`; icon-only buttons have `aria-label` in Spanish; checkboxes are real, keyboard-operable controls; visible focus states.
- Server Components by default; add `"use client"` only where state, effects, or browser APIs are needed (most screens in v1 will be client components because of localStorage).
- Functional components, named exports for components, PascalCase file names for components, camelCase for utilities.
- No `any`. Derive types from zod schemas instead of duplicating them.
- Keep user-facing strings together per screen (or in a `copy.ts` file) to make a future i18n pass easy.
- Small, focused components; business logic (time conversion, validation, storage) lives in `lib/`, not in components.

## Environment variables

```
ROUTINE_API_URL=   # Lambda/API Gateway endpoint, e.g. https://…/prod/organizer (server-only)
ROUTINE_API_KEY=   # API Gateway key sent as x-api-key (server-only secret)
```

Document any new variable here and in `.env.example`. Never commit `.env` or `.env.local` (both gitignored); never prefix secrets with `NEXT_PUBLIC_`.

## Out of scope for v1

Don't build these without being asked:

- **Notifications and reminders** (Notifications API, service worker, push). Don't request notification permission or add a service worker.
- Permissions step in onboarding (notifications, calendar).
- Calendar integration.
- Accounts/auth, cloud sync, a database.
- Weekend-specific day hours, recurring routines.
- Changes to the backend or its API contract.

Keep `storage.ts` and `ai-client.ts` behind clean interfaces so they can be replaced later.
