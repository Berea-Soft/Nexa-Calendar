# @nexa-calendar/svelte

Svelte component wrapper for Nexa-Calendar.

## Installation

```bash
npm install @nexa-calendar/svelte @nexa-calendar/ui @nexa-calendar/core
# or
pnpm add @nexa-calendar/svelte @nexa-calendar/ui @nexa-calendar/core
```

## Usage

### Basic Usage

```svelte
<script>
  import NxCalendar from '@nexa-calendar/svelte';
  import '@nexa-calendar/ui/styles.css';

  let events = [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date().toISOString(),
      duration: 60,
    },
  ];

  function handleDateClick(e) {
    console.log('Date clicked:', e.detail.date);
  }

  function handleEventClick(e) {
    console.log('Event clicked:', e.detail.event);
  }
</script>

<NxCalendar
  view="month"
  locale="en"
  theme="ocean"
  {events}
  on:dateClick={handleDateClick}
  on:eventClick={handleEventClick}
/>
```

## Props

| Prop            | Type               | Default   | Description         |
| --------------- | ------------------ | --------- | ------------------- |
| `view`          | `string`           | `'month'` | Current view        |
| `locale`        | `string`           | `'en'`    | Locale code         |
| `theme`         | `string`           | `'light'` | Theme name          |
| `events`        | `ICalendarEvent[]` | `[]`      | Calendar events     |
| `resources`     | `IResource[]`      | `[]`      | Resources           |
| `editable`      | `boolean`          | `true`    | Enable editing      |
| `selectable`    | `boolean`          | `true`    | Allow selection     |
| `weekends`      | `boolean`          | `true`    | Show weekends       |
| `businessHours` | `BusinessHours`    | `false`   | Business hours      |
| `minTime`       | `string`           | `'00:00'` | Day start time      |
| `maxTime`       | `string`           | `'24:00'` | Day end time        |
| `slotDuration`  | `number`           | `60`      | Slot duration (min) |
| `hourHeight`    | `number`           | `48`      | Hour height (px)    |

## Events

```svelte
<script>
  function onDateClick(e) {
    const { date } = e.detail;
    console.log('Date clicked:', date);
  }

  function onDateSelect(e) {
    const { start, end } = e.detail;
    console.log('Selected:', start, 'to', end);
  }

  function onEventClick(e) {
    const { event } = e.detail;
    console.log('Event clicked:', event);
  }

  function onEventDrop(e) {
    const { event, oldStart, newStart } = e.detail;
    console.log('Event moved:', event.id);
  }

  function onEventResize(e) {
    const { event, oldDuration, newDuration } = e.detail;
    console.log('Event resized:', event.id);
  }

  function onViewChange(e) {
    const { view } = e.detail;
    console.log('View changed to:', view);
  }
</script>

<NxCalendar
  {events}
  on:dateClick={onDateClick}
  on:dateSelect={onDateSelect}
  on:eventClick={onEventClick}
  on:eventDrop={onEventDrop}
  on:eventResize={onEventResize}
  on:viewChange={onViewChange}
/>
```

## Reactive Events

```svelte
<script>
  import NxCalendar from '@nexa-calendar/svelte';

  let events = [
    { id: '1', title: 'Event 1', start: new Date().toISOString(), duration: 60 },
  ];

  function addEvent() {
    events = [
      ...events,
      {
        id: Date.now().toString(),
        title: 'New Event',
        start: new Date().toISOString(),
        duration: 60,
      },
    ];
  }

  function removeEvent(id) {
    events = events.filter(e => e.id !== id);
  }
</script>

<button on:click={addEvent}>Add Event</button>

<NxCalendar view="month" {events} />
```

## Svelte Stores

```svelte
<script>
  import NxCalendar from '@nexa-calendar/svelte';
  import { writable } from 'svelte/store';

  const events = writable([
    { id: '1', title: 'Event', start: new Date().toISOString(), duration: 60 },
  ]);

  // Update store directly
  $events = [
    ...$events,
    { id: '2', title: 'New Event', start: new Date().toISOString(), duration: 60 },
  ];
</script>

<NxCalendar view="month" events={$events} />
```

## Custom Event Rendering

```svelte
<NxCalendar view="month" {events}>
  <svelte:fragment slot="event" let:event>
    <div class="custom-event">
      <strong>{event.title}</strong>
      <span>{event.startTime}</span>
    </div>
  </svelte:fragment>
</NxCalendar>

<style>
  .custom-event {
    padding: 4px;
    font-size: 12px;
  }
</style>
```

## Theming

```svelte
<!-- Built-in themes -->
<NxCalendar theme="dark" />
<NxCalendar theme="ocean" />
<NxCalendar theme="rose" />

<!-- Custom CSS variables -->
<div class="calendar-wrapper">
  <NxCalendar {events} />
</div>

<style>
  .calendar-wrapper {
    --nx-accent: #3b82f6;
    --nx-text: #111827;
    --nx-radius: 0.75rem;
  }
</style>
```

## Business Hours

```svelte
<script>
  let businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
    startTime: '09:00',
    endTime: '18:00',
  };

  // Multiple ranges
  let businessHoursMultiple = [
    { daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '12:00' },
    { daysOfWeek: [1, 2, 3, 4, 5], startTime: '14:00', endTime: '18:00' },
  ];
</script>

<NxCalendar view="week" {events} {businessHours} />
```

## Lifecycle

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';

  let calendarRef;

  onMount(() => {
    console.log('Calendar mounted');
  });

  onDestroy(() => {
    console.log('Calendar destroyed');
  });

  function handleReady() {
    console.log('Calendar ready');
  }
</script>

<NxCalendar
  bind:this={calendarRef}
  view="month"
  {events}
  on:ready={handleReady}
/>
```

## License

MIT - see [LICENSE](../../LICENSE)
