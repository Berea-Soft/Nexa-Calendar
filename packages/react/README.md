# @nexa-calendar/react

React wrapper for Nexa-Calendar using `@lit-labs/react`.

## Installation

```bash
npm install @nexa-calendar/react @nexa-calendar/ui @nexa-calendar/core
# or
pnpm add @nexa-calendar/react @nexa-calendar/ui @nexa-calendar/core
```

## Usage

```tsx
import { NxCalendar } from '@nexa-calendar/react';
import '@nexa-calendar/ui/styles.css';

function App() {
  const events = [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date().toISOString(),
      duration: 60,
    },
  ];

  return (
    <NxCalendar
      view="month"
      locale="en"
      theme="dark"
      events={events}
      onDateClick={handleDateClick}
      onEventClick={handleEventClick}
    />
  );
}
```

## Props

| Prop            | Type                | Default   | Description           |
| --------------- | ------------------- | --------- | --------------------- |
| `view`          | `ViewType`          | `'month'` | Current view          |
| `views`         | `ViewType[]`        | All views | Available views       |
| `locale`        | `string`            | `'en'`    | Locale code           |
| `theme`         | `string`            | `'light'` | Theme name            |
| `events`        | `ICalendarEvent[]`  | `[]`      | Calendar events       |
| `resources`     | `IResource[]`       | `[]`      | Resources             |
| `editable`      | `boolean`           | `true`    | Enable editing        |
| `selectable`    | `boolean`           | `true`    | Allow selection       |
| `weekends`      | `boolean`           | `true`    | Show weekends         |
| `businessHours` | `BusinessHours`     | `false`   | Business hours config |
| `minTime`       | `string`            | `'00:00'` | Day start time        |
| `maxTime`       | `string`            | `'24:00'` | Day end time          |
| `slotDuration`  | `number`            | `60`      | Slot duration (min)   |
| `hourHeight`    | `number`            | `48`      | Hour height (px)      |
| `dayMaxEvents`  | `number \| boolean` | `false`   | Max events per day    |
| `eventContent`  | `function`          | -         | Custom event renderer |

## Events

```tsx
import { useCallback } from 'react';

function CalendarExample() {
  const handleDateClick = useCallback((info: { date: Date }) => {
    console.log('Date clicked:', info.date);
  }, []);

  const handleEventClick = useCallback((info: { event: ICalendarEvent }) => {
    console.log('Event clicked:', info.event);
  }, []);

  const handleEventDrop = useCallback(
    (info: { event: ICalendarEvent; oldStart: Date; newStart: Date }) => {
      console.log('Event moved:', info.event.id, 'to', info.newStart);
    },
    []
  );

  return (
    <NxCalendar
      view="week"
      events={events}
      onDateClick={handleDateClick}
      onEventClick={handleEventClick}
      onEventDrop={handleEventDrop}
    />
  );
}
```

## Event Types

| Event           | Handler Signature                                     |
| --------------- | ----------------------------------------------------- |
| `onDateClick`   | `(info: { date: Date }) => void`                      |
| `onDateSelect`  | `(info: { start: Date; end: Date }) => void`          |
| `onEventClick`  | `(info: { event: ICalendarEvent }) => void`           |
| `onEventDrop`   | `(info: { event, oldStart, newStart }) => void`       |
| `onEventResize` | `(info: { event, oldDuration, newDuration }) => void` |
| `onViewChange`  | `(info: { view: ViewType }) => void`                  |

## Controlled vs Uncontrolled

### Uncontrolled (default)

```tsx
<NxCalendar view="month" events={events} />
```

### Controlled

```tsx
import { useState } from 'react';

function ControlledCalendar() {
  const [view, setView] = useState('month');
  const [events, setEvents] = useState(initialEvents);

  return (
    <NxCalendar
      view={view}
      onViewChange={info => setView(info.view)}
      events={events}
      onEventDrop={info => {
        setEvents(prev =>
          prev.map(e => (e.id === info.event.id ? { ...e, start: info.newStart.toISOString() } : e))
        );
      }}
    />
  );
}
```

## Custom Event Content

```tsx
<NxCalendar
  events={events}
  eventContent={event => (
    <div className="custom-event">
      <strong>{event.title}</strong>
      <span>{event.time}</span>
    </div>
  )}
/>
```

## Theming

```tsx
// Use built-in themes
<NxCalendar theme="dark" />
<NxCalendar theme="ocean" />
<NxCalendar theme="rose" />

// Custom CSS variables
<div style={{
  '--nx-accent': '#3b82f6',
  '--nx-text': '#111827',
}}>
  <NxCalendar />
</div>
```

## License

MIT - see [LICENSE](../../LICENSE)
