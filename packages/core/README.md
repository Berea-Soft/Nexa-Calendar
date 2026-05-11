# @nexa-calendar/core

Core domain logic, types, and services for Nexa-Calendar. Zero UI dependencies.

## Installation

```bash
npm install @nexa-calendar/core
# or
pnpm add @nexa-calendar/core
# or
yarn add @nexa-calendar/core
```

## Features

- **Pure Domain Logic**: No UI dependencies, works in any environment
- **40+ Locales**: Built-in i18n with `@bereasoftware/time-guard`
- **Event Management**: Add, update, delete, and query calendar events
- **View Management**: Generate grid data for 10+ view types
- **Recurring Events**: Support for recurring event patterns
- **Timezone Support**: Global event handling across timezones

## Usage

```typescript
import { CalendarStore, DateUtils } from '@nexa-calendar/core';

// Create calendar store
const store = new CalendarStore();

// Navigate dates
store.navigator.today();
store.navigator.next();
store.navigator.previous();

// Change view
store.views.setView('month');

// Add events
const event = store.events.addEvent({
  id: '1',
  title: 'Team Meeting',
  start: DateUtils.today().set({ hour: 10 }),
  duration: 60,
  allDay: false,
});

// Get current view grid
const currentView = store.views.getView();
const range = currentView.getRange(DateUtils.today());
const grid = currentView.generateGrid(range, store.events.getEvents());
```

## API Reference

### CalendarStore

Central state management for the calendar.

```typescript
const store = new CalendarStore(options?: ICalendarOptions);
```

**Properties:**

- `events` - EventManager instance
- `views` - ViewManager instance
- `navigator` - CalendarNavigator instance
- `resources` - Resource manager
- `plugins` - Plugin manager

### EventManager

Manage calendar events.

```typescript
store.events.addEvent(event: ICalendarEvent): string
store.events.updateEvent(id: string, updates: Partial<ICalendarEvent>): void
store.events.deleteEvent(id: string): void
store.events.getEvent(id: string): ICalendarEvent | undefined
store.events.getEvents(range?: IDateRange): ICalendarEvent[]
```

### ICalendarEvent

```typescript
interface ICalendarEvent {
  id: string;
  title: string;
  start: TimeGuard;
  end?: TimeGuard;
  duration?: number; // minutes
  allDay?: boolean;
  resourceId?: string | string[];
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  classNames?: string[];
  editable?: boolean;
}
```

### ViewManager

Generate view-specific grid data.

```typescript
const view = store.views.getView(); // Current view instance
const range = view.getRange(DateUtils.today());
const grid = view.generateGrid(range, events);
```

**Supported Views:**

- `month` - 7xN grid layout
- `week` - 7 days with time slots
- `workWeek` - Mon-Fri time slots
- `day` - Single day view
- `list` - Chronological event list
- `timeline` - Horizontal timeline
- `timelineDay` - Day timeline with resources
- `timelineWeek` - Week timeline with resources
- `timelineMonth` - Month timeline with resources
- `timelineWorkWeek` - Mon-Fri timeline
- `timelineResourceDay` - Resource day view
- `timelineResourceWeek` - Resource week view
- `timelineResourceMonth` - Resource month view
- `timelineResourceWorkWeek` - Resource work week
- `year` - 12 mini-months

### DateUtils

Utility functions for date operations.

```typescript
DateUtils.today(): TimeGuard
DateUtils.getMonthRange(date: TimeGuard): IDateRange
DateUtils.getWeekRange(date: TimeGuard): IDateRange
DateUtils.getDayRange(date: TimeGuard): IDateRange
DateUtils.getTimelineRange(date: TimeGuard): IDateRange
DateUtils.isInBusinessHours(date: TimeGuard, config: BusinessHours): boolean
```

## License

MIT - see [LICENSE](../../LICENSE)
