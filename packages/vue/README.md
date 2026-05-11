# @nexa-calendar/vue

Vue 3 component wrapper for Nexa-Calendar.

## Installation

```bash
npm install @nexa-calendar/vue @nexa-calendar/ui @nexa-calendar/core
# or
pnpm add @nexa-calendar/vue @nexa-calendar/ui @nexa-calendar/core
```

## Usage

### Basic Usage

```vue
<template>
  <NxCalendar
    v-model:view="currentView"
    :events="events"
    locale="en"
    theme="ocean"
    @date-click="handleDateClick"
    @event-click="handleEventClick"
  />
</template>

<script setup>
import { ref } from 'vue';
import { NxCalendar } from '@nexa-calendar/vue';
import '@nexa-calendar/ui/styles.css';

const currentView = ref('month');
const events = ref([
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date().toISOString(),
    duration: 60,
  },
]);

const handleDateClick = info => {
  console.log('Date clicked:', info.date);
};

const handleEventClick = info => {
  console.log('Event clicked:', info.event);
};
</script>
```

### With v-model

```vue
<template>
  <NxCalendar v-model:view="view" v-model:date="currentDate" :events="events" />
</template>

<script setup>
import { ref } from 'vue';

const view = ref('week');
const currentDate = ref(new Date());
</script>
```

## Props

| Prop            | Type               | Default   | Description         |
| --------------- | ------------------ | --------- | ------------------- |
| `view`          | `string`           | `'month'` | Current view        |
| `date`          | `Date`             | Today     | Current date        |
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

```vue
<template>
  <NxCalendar
    :events="events"
    @date-click="onDateClick"
    @date-select="onDateSelect"
    @event-click="onEventClick"
    @event-drop="onEventDrop"
    @event-resize="onEventResize"
    @view-change="onViewChange"
  />
</template>

<script setup>
const onDateClick = info => {
  console.log('Date clicked:', info.date);
};

const onDateSelect = info => {
  console.log('Selected:', info.start, 'to', info.end);
};

const onEventClick = info => {
  console.log('Event:', info.event);
};

const onEventDrop = info => {
  console.log('Event moved:', info.event.id, 'to', info.newStart);
};
</script>
```

## Slots

### Event Slot

```vue
<template>
  <NxCalendar :events="events">
    <template #event="{ event }">
      <div class="custom-event">
        <strong>{{ event.title }}</strong>
        <small>{{ event.time }}</small>
      </div>
    </template>
  </NxCalendar>
</template>
```

## Computed Properties

```vue
<template>
  <div>
    <p>Current view: {{ currentView }}</p>
    <p>Events count: {{ events.length }}</p>
    <NxCalendar v-model:view="currentView" :events="events" />
  </div>
</template>

<script setup>
const currentView = ref('month');
const events = ref([...]);
</script>
```

## Theming

```vue
<!-- Use built-in themes -->
<NxCalendar theme="dark" />
<NxCalendar theme="ocean" />

<!-- With CSS variables -->
<div class="calendar-container">
  <NxCalendar :events="events" />
</div>

<style>
.calendar-container {
  --nx-accent: #3b82f6;
  --nx-text: #111827;
  --nx-radius: 0.75rem;
}
</style>
```

## License

MIT - see [LICENSE](../../LICENSE)
