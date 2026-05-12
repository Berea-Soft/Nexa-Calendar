# Architecture Overview

Nexa-Calendar is a full-featured calendar library with Web Components (Lit 3) as
the core UI layer, with official wrappers for React, Vue, Angular, and Svelte.

## High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Example App                          │
│                  (Vue 3 + Tailwind CSS)                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ▼             ▼             ▼
      ┌──────────┐  ┌──────────┐  ┌──────────┐
      │   React  │  │   Vue    │  │ Angular  │
      │ Wrapper  │  │ Wrapper  │  │ Wrapper  │
      └────┬─────┘  └────┬─────┘  └────┬─────┘
           │             │             │
           └─────────────┼─────────────┘
                         │
                    ┌────▼────┐
                    │   UI    │  ← Lit Web Components
                    │ Package │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │  Core   │  ← Domain Logic (no UI deps)
                    │ Package │
                    └─────────┘
```

## Package Structure

### @nexa-calendar/core

Domain logic with zero UI dependencies. Contains:

- **Domain Layer**
  - `DateUtils` - Date manipulation utilities
  - `CalendarNavigator` - Navigation between dates/views
  - `EventManager` - Event CRUD operations
  - `EventRecurrence` - Recurring event expansion
  - `EventValidator` - Event validation rules
  - `EventSorter` - Event sorting by time/priority
  - `ViewManager` - View state management
  - `SelectionManager` - Date/event selection logic
  - `CalendarStore` - Central state store (Observable pattern)

- **Services Layer**
  - `LocalEventSource` - In-memory events
  - `JsonEventSource` - JSON/Remote events
  - `FunctionalEventSource` - Callback-based events
  - `PluginManager` - Plugin lifecycle management
  - `LocaleManager` - i18n locale handling

- **Types** - All interfaces and type definitions

### @nexa-calendar/ui

Lit 3 Web Components. Contains:

- **Components**
  - `NxCalendar` - Main calendar element
  - `NxToolbar` - Navigation toolbar
  - `NxEventChip` - Event display component

- **Views**
  - `NxMonthView` - 7×N grid month view
  - `NxWeekView` - 7 days × 24h time slots
  - `NxWorkWeekView` - Mon-Fri time slots
  - `NxDayView` - 1 day × 24h time slots
  - `NxListView` - Chronological grouped list
  - `NxTimelineView` - Horizontal timeline
  - `NxResourceTimelineView` - Resource-based timeline
  - `NxYearView` - Year overview

- **Utils**
  - `TimeGrid` - Time grid utilities

### Framework Wrappers

Each wrapper package provides framework-specific components that wrap the
core `<nx-calendar>` web component:

- `@nexa-calendar/react` - React components via @lit-labs/react
- `@nexa-calendar/vue` - Vue 3 components
- `@nexa-calendar/angular` - Angular components
- `@nexa-calendar/svelte` - Svelte components

## Design Principles

### SOLID Compliance

- **SRP**: Each class/file has one responsibility
- **OCP**: Plugin system (ICalendarPlugin) + view factory (ViewManager)
- **LSP**: All views implement `IView`, all sources `IEventSource`
- **ISP**: Small focused interfaces (INavigable, ICalendarPlugin, etc.)
- **DIP**: Core depends on abstractions, not implementations

### Date Handling

All date operations use `@bereasoftware/time-guard`:

```typescript
import { DateUtils } from '@nexa-calendar/core';

// NO native Date manipulation
// Use TimeGuard for locale-aware formatting
DateUtils.locale('es-ES').format('dddd D MMMM YYYY');
```

### View Interface

All views implement the `IView` interface:

```typescript
interface IView {
  name: ViewType;
  render(state: CalendarState): TemplateResult;
  handleNavigation(direction: 'prev' | 'next' | 'today'): void;
  handleSelection(range: DateRange): void;
}
```

### Event Source Interface

All event sources implement `IEventSource`:

```typescript
interface IEventSource {
  id: string;
  type: 'local' | 'json' | 'functional';
  fetch(range: DateRange): Promise<ICalendarEvent[]>;
  subscribe(callback: Listener): Unsubscribe;
}
```

## State Management

Calendar state is managed via `CalendarStore` with an observable pattern:

```typescript
const store = new CalendarStore();

// Subscribe to changes
const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state);
});

// Update state
store.setView('month');
store.setEvents([...]);

// Cleanup
unsubscribe();
```

## Plugin System

Plugins extend functionality via `ICalendarPlugin`:

```typescript
interface ICalendarPlugin {
  name: string;
  install(store: CalendarStore): void;
  uninstall(): void;
}
```

Built-in plugins: Drag-and-drop, Resource management, Time zone support.

## Build & Distribution

- **Build**: Vite for bundling
- **Package Manager**: pnpm workspaces
- **TypeScript**: Strict mode, no `rootDir` in package tsconfigs
- **Output**: ESM modules with `.js` + `.d.ts`

## Vercel Deployment

Example app deployed via GitHub Actions:

```yaml
- name: Deploy to Vercel
  run: npx vercel --prod
```

SPA routing handled via `vercel.json` rewrites.

## NPM Publishing

Packages published to `@nexa-calendar` scope with semantic-release:

- Automated versioning via Conventional Commits
- Changelog generation
- CI/CD via GitHub Actions
