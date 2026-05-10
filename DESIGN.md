# DESIGN.md — Nexa-Calendar SOLID Architecture

## Clean Architecture Layers

```
┌─────────────────────────────────────┐
│   @nexa-calendar/react (Adapter)    │  React wrapper via @lit-labs/react
├─────────────────────────────────────┤
│   @nexa-calendar/ui (Web UI)        │  Lit 3 components, Tailwind CSS, nx-* tags
├─────────────────────────────────────┤
│   @nexa-calendar/core (Domain)      │  Pure TS, zero UI deps, TimeGuard i18n
└─────────────────────────────────────┘
```

## Core Types (`packages/core/src/types/`)

| File            | Key Types                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `event.ts`      | `ICalendarEvent`, `EventInput`, `EventDisplay`, `EventId`                                        |
| `view.ts`       | `IView`, `DateRange`, `DayCell`, `TimeSlot`, `DayColumn`, `ListEvent`, `ViewType`, `ViewOptions` |
| `store.ts`      | `CalendarState`, `Listener`, `Unsubscribe`                                                       |
| `source.ts`     | `IEventSource`, `EventSourceInput`, `EventSourceRawInput`                                        |
| `plugin.ts`     | `ICalendarPlugin`                                                                                |
| `locale.ts`     | `Locale` (buttonText, moreLinkText, noEventsText; date formatting via TimeGuard)                 |
| `navigable.ts`  | `INavigable`                                                                                     |
| `constraint.ts` | `BusinessHours`, `EventConstraint`                                                               |
| `dnd.ts`        | `DragStartPayload`, `DragEndPayload`, `ResizeStartPayload`, `ResizeEndPayload`                   |

## Domain Services (`packages/core/src/domain/`)

| Class               | SRP                                                         | Pattern            |
| ------------------- | ----------------------------------------------------------- | ------------------ |
| `CalendarStore`     | Single source of truth — state, sources, plugins, listeners | Observer + Facade  |
| `EventManager`      | CRUD for events, range filtering                            | Repository         |
| `EventValidator`    | Validates input, constraints, overlap                       | Strategy           |
| `EventRecurrence`   | Expands recurring events (RRULE, daysOfWeek)                | Strategy           |
| `EventSorter`       | Sorts by configurable keys                                  | Strategy           |
| `CalendarNavigator` | Date navigation, implements `INavigable`                    | —                  |
| `ViewManager`       | View factory + cache, registers 5 views                     | Factory + Strategy |
| `SelectionManager`  | Range selection with observer support                       | Observer           |

## Views

| View      | Tag                   | Columns                | Time Axis | Events          | Drag           |
| --------- | --------------------- | ---------------------- | --------- | --------------- | -------------- |
| Month     | `<nx-month-view>`     | 7×N days               | No        | Day cells       | Event          |
| Work Week | `<nx-work-week-view>` | 5 days × 24h (Mon-Fri) | Yes       | Time slots      | Event + resize |
| Week      | `<nx-week-view>`      | 7 days × 24h           | Yes       | Time slots      | Event + resize |
| Day       | `<nx-day-view>`       | 1 day × 24h            | Yes       | Time slots      | Event + resize |
| List      | `<nx-list-view>`      | Vertical               | No        | Chronological   | No             |
| Timeline  | `<nx-timeline-view>`  | Single row × N cols    | Yes       | Horizontal bars | Event          |

All views implement `IView` and are registered via `ViewManager.register()`.

## State Management

```
CalendarStore (Observable)
  ├── EventManager → events[]
  ├── CalendarNavigator → currentDate
  ├── ViewManager → current view
  └── SelectionManager → selection (subscribable)
       │
       ▼
  Set<Listener> → notify on state change → Lit re-render
```

## i18n

- Date formatting: `TimeGuard.locale(code).format('dddd D MMMM YYYY')` — 40+ locales
- UI text: Custom `Locale` type for buttonText, moreLinkText, noEventsText

## Tests

22 unit tests covering EventManager, EventValidator, EventRecurrence, EventSorter,
CalendarNavigator, SelectionManager, DateUtils, CalendarStore, Event Sources, and Locale.
