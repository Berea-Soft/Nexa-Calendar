# AGENTS.md — Nexa-Calendar

## Project Overview

Full-featured calendar library with Web Component (Lit 3) + React wrappers. pnpm monorepo.

## Tech Stack

- **Runtime**: TypeScript 5.9 (strict), ESNext
- **Dates**: `@bereasoftware/time-guard` — 40+ locales, NO native `Date`
- **UI**: Lit 3 (Web Components)
- **Styles**: Tailwind CSS 4 (CSS-first config)
- **Build**: Vite 8
- **React**: `@lit-labs/react` wrapper
- **Package Mgr**: pnpm workspaces
- **Tests**: Vitest (22+ tests)

## Package Architecture

```
nexa-calendar/
  packages/
    core/     — Domain logic, types, services (zero UI deps)
    ui/       — Lit web components, Tailwind views
    react/    — React wrapper (@lit-labs/react)
    vue/      — Vue 3 wrapper
    angular/  — Angular wrapper
    svelte/   — Svelte wrapper
  apps/
    example/  — Demo app with StackBlitz SDK
```

## NPM Publishing

All packages published to `@nexa-calendar` scope (e.g., `@nexa-calendar/core`, `@nexa-calendar/ui`, etc.)

CI workflow: `.github/workflows/publish-npm.yml`

- Validates (lint, test, build)
- On push to main: bumps minor version, publishes all packages, creates git tag

## Vercel Deployment

Example app deployed via `.github/workflows/deploy-web.yml`

- Uses `vercel@latest` CLI
- Node 22, pnpm

## Conventions

### TypeScript

- `strict: true`, `useDefineForClassFields: false`, `experimentalDecorators: true`
- Interfaces prefixed with `I` (e.g., `IEventSource`)
- All public API fully typed, barrel exports from `index.ts`
- NO `rootDir` in package tsconfigs (build outputs to dist/)

### TimeGuard (Date Handling)

- NO `new Date()`, `Date.now()`, `getTime()`, etc.
- `.locale(code).format('dddd D MMMM YYYY')` for locale-aware formatting
- See `packages/core/src/domain/date-utils.ts` for helpers

### Naming

- `camelCase` for variables/functions, `PascalCase` for classes/interfaces
- `kebab-case` for files (e.g., `event-store.ts`)
- Lit components: `nx-*` prefix (e.g., `nx-month-view`, `nx-calendar`)
- Classes: `Nx*` prefix (e.g., `NxMonthView`, `NxCalendar`)
- Private fields: `_` prefix in Lit (e.g., `_store`)

### Architecture (SOLID)

- **SRP**: Each class/file has one responsibility
- **OCP**: Plugin system (ICalendarPlugin) + view factory (ViewManager)
- **LSP**: All views implement `IView`, all sources `IEventSource`
- **ISP**: Small focused interfaces (INavigable, ICalendarPlugin, etc.)
- **DIP**: Core depends on abstractions, not implementations

### Views

| View      | Tag                   | Description                                                |
| --------- | --------------------- | ---------------------------------------------------------- |
| Month     | `<nx-month-view>`     | 7×N grid, dayMaxEvents, business hours                     |
| Work Week | `<nx-work-week-view>` | Mon-Fri time slots                                         |
| Week      | `<nx-week-view>`      | 7 days × 24h time slots                                    |
| Day       | `<nx-day-view>`       | 1 day × 24h time slots                                     |
| List      | `<nx-list-view>`      | Chronological grouped list                                 |
| Timeline  | `<nx-timeline-view>`  | Horizontal scrollable timeline, event bars by left/width % |

### Testing

- Vitest, tests in `packages/core/src/__tests__/`
- `pnpm test` — Run all tests
- `pnpm typecheck` — TypeScript check

### Commands

- `pnpm dev` — Run example app
- `pnpm test` — Run vitest
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm build` — Build example app

### .gitignore

- `dist/`, `*.js`, `*.d.ts`, `*.js.map` (generated files)
- `node_modules/`, `*.local`
