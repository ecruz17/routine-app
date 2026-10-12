# Routine Organizer

A mobile-first web app that turns a messy description of your day into a time-blocked checklist using AI.

Write what you'd like to do ("dar un paseo, lavar el auto, leer un libro…") plus any fixed commitments ("cita con el dentista a las 6:30 p.m."). The AI fits everything around your day hours and work/school schedule, and you review, adjust, and check tasks off as you go.

> The UI is in Spanish. Data stays in your browser (`localStorage`); there are no accounts.

## How it works

1. **Onboarding:** tell the app your name, when your day starts and ends (it can end after midnight), and your weekday work or school hours (optional).
2. **Inicio:** pick a day and describe what you want to do and what's already fixed. Then tap **Organizar rutina**.
3. **Propuesta:** review the AI's schedule on a timeline. Overlaps and tasks outside your day are highlighted. Edit any task's name, start time, or duration, then **Confirmar** or **Cancelar** (your text is kept).
4. **Rutina:** check tasks off as you complete them. Progress is saved instantly, and finishing everything plays a small celebration.
5. **Perfil:** update your name, day hours, or work schedule at any time.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, Cache Components) + React + TypeScript (strict)
- Tailwind CSS v4 with design tokens from [`DESIGN.md`](DESIGN.md)
- [zod](https://zod.dev) to validate profile data, `localStorage` payloads, and AI responses
- [lucide-react](https://lucide.dev) icons

The AI runs in an existing AWS Lambda behind API Gateway. The browser calls a same-origin route (`/api/organize`) that adds the API key on the server, so the key never reaches the client.

## Getting started

Requirements: Node.js 22+ (the tests use Node's built-in TypeScript support).

```bash
npm install
cp .env.example .env    # then fill in the values below
npm run dev             # http://localhost:3000
```

### Environment variables

| Variable          | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `ROUTINE_API_URL` | Organizer endpoint, e.g. `https://…/prod/organizer`  |
| `ROUTINE_API_KEY` | API Gateway key, sent as `x-api-key`                 |

Both are **server-only**. Don't prefix them with `NEXT_PUBLIC_`, because that would expose them in the browser bundle.

## Scripts

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Start the dev server                                |
| `npm run build`     | Production build                                    |
| `npm run start`     | Serve the production build                          |
| `npm run lint`      | ESLint                                              |
| `npm run typecheck` | `tsc --noEmit`                                      |
| `npm test`          | Unit tests for the AI time/duration parsers         |

## Project structure

```
src/
  app/                 # routes: onboarding, (main)/home, home/suggestion, checklist, profile, api/organize
  components/          # one folder per screen + shared ui/, calendar/, routine/, navigation/
  lib/                 # storage, zod schemas, AI client/contract, time & date helpers
  hooks/               # useProfile, useRoutine, useToday
```

See [`CLAUDE.md`](CLAUDE.md) for the full conventions, data model, and AI contract.
