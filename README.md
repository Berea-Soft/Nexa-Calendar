<!-- markdownlint-disable MD033 MD041 -->
<div align="center">

# Nexa-Calendar

A FullCalendar alternative built with modern web standards. Full-featured calendar library with Web Component (Lit 3) + React, Vue, Angular, and Svelte wrappers.

[![npm version](https://img.shields.io/npm/v/@nexa-calendar/core.svg)](https://www.npmjs.com/package/@nexa-calendar/core)
[![License](https://img.shields.io/npm/l/@nexa-calendar/core.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Lit](https://img.shields.io/badge/Lit-3.0+-blue.svg)](https://lit.dev/)

[![CI](https://github.com/nexa-calendar/nexa-calendar/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/nexa-calendar/nexa-calendar/actions)
[![Coverage](https://img.shields.io/codecov/c/github/nexa-calendar/nexa-calendar.svg)](https://codecov.io/gh/nexa-calendar/nexa-calendar)
[![Bundle Size](https://img.shields.io/bundlejs/size/@nexa-calendar/ui)](https://bundlejs.com/?q=@nexa-calendar/ui)

[Demo](https://nexa-calendar.vercel.app) · [Documentation](#) · [Changelog](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md)

</div>

---

## Features

### Core Features
- **8 View Types**: Month, Week, Work Week, Day, List, Timeline, Resource Timeline, Year
- **Drag & Drop**: Move and resize events seamlessly
- **Business Hours**: Configurable work hours with visual indicators
- **Event Rendering**: Custom event content with templates
- **Recurring Events**: Support for recurring events (daily, weekly)

### Internationalization
- **40+ Locales**: Full i18n support with `time-guard`
- **RTL Support**: Right-to-left language compatibility
- **Date Formats**: Locale-aware date and time formatting

### Timezone Support
- **Global Events**: Handle events across multiple timezones
- **Automatic Conversion**: Display times in user's local timezone

### Framework Support
- **Web Components**: Native `<nx-calendar>` element
- **React**: `@nexa-calendar/react` wrapper
- **Vue**: `@nexa-calendar/vue` component
- **Angular**: `@nexa-calendar/angular` module
- **Svelte**: `@nexa-calendar/svelte` component

### Customization
- **7 Built-in Themes**: Light, Dark, Ocean, Rose, Slate, Forest, Amber
- **Custom Theming**: Full CSS variable customization
- **Event Styling**: Background events, custom colors, text colors

---

## Quick Start

### Web Components (Vanilla JS)

```bash
npm install @nexa-calendar/ui @nexa-calendar/core
```

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@nexa-calendar/ui'
  </script>
</head>
<body>
  <nx-calendar
    view="month"
    locale="en"
    theme="light"
  ></nx-calendar>

  <script>
    const cal = document.querySelector('nx-calendar')
    cal.events = [
      { id: 1, title: 'Meeting', start: '2024-01-15T10:00:00', end: '2024-01-15T11:00:00' }
    ]
  </script>
</body>
</html>
```

### React

```bash
npm install @nexa-calendar/react @nexa-calendar/core
```

```tsx
import { NxCalendar } from '@nexa-calendar/react'

function App() {
  return (
    <NxCalendar
      view="month"
      locale="en"
      theme="dark"
      events={[
        { id: 1, title: 'Meeting', start: '2024-01-15T10:00:00', end: '2024-01-15T11:00:00' }
      ]}
    />
  )
}
```

### Vue

```bash
npm install @nexa-calendar/vue @nexa-calendar/core
```

```vue
<template>
  <NxCalendar
    v-model:view="currentView"
    locale="en"
    :events="events"
  />
</template>

<script setup>
import { NxCalendar } from '@nexa-calendar/vue'

const currentView = ref('month')
const events = ref([
  { id: 1, title: 'Meeting', start: '2024-01-15T10:00:00' }
])
</script>
```

### Angular

```bash
npm install @nexa-calendar/angular @nexa-calendar/core
```

```typescript
// app.module.ts
import { NgxNxCalendarModule } from '@nexa-calendar/angular'

@NgModule({
  imports: [NgxNxCalendarModule]
})
export class AppModule {}
```

```html
<!-- app.component.html -->
<ngx-nx-calendar
  [view]="'month'"
  [locale]="'en'"
  [events]="calendarEvents">
</ngx-nx-calendar>
```

### Svelte

```bash
npm install @nexa-calendar/svelte @nexa-calendar/core
```

```svelte
<script>
  import NxCalendar from '@nexa-calendar/svelte'
</script>

<NxCalendar
  view="month"
  locale="en"
  events={[
    { id: 1, title: 'Meeting', start: '2024-01-15T10:00:00' }
  ]}
/>
```

---

## API Reference

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `view` | `ViewType` | `'month'` | Current view type |
| `views` | `ViewType[]` | All views | Available views |
| `locale` | `string` | `'en'` | Locale code |
| `theme` | `string` | `'light'` | Theme name |
| `events` | `ICalendarEvent[]` | `[]` | Calendar events |
| `resources` | `IResource[]` | `[]` | Resources for timeline |
| `editable` | `boolean` | `true` | Enable event editing |
| `eventStartEditable` | `boolean` | `true` | Allow moving events |
| `eventDurationEditable` | `boolean` | `true` | Allow resizing events |
| `businessHours` | `BusinessHours` | `false` | Business hours config |
| `weekends` | `boolean` | `true` | Show weekends |
| `dayMaxEvents` | `number \| boolean` | `false` | Max events per day |
| `slotDuration` | `number` | `60` | Time slot duration (minutes) |
| `hourHeight` | `number` | `48` | Hour row height (px) |
| `minTime` | `string` | `'00:00'` | Day start time |
| `maxTime` | `string` | `'24:00'` | Day end time |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `dateClick` | `{ date, allDay }` | User clicked a date |
| `eventClick` | `ICalendarEvent` | User clicked an event |
| `eventDrop` | `{ eventId, newStart }` | Event was moved |
| `eventResize` | `{ eventId, newStart, newEnd }` | Event was resized |

### View Types

```typescript
type ViewType =
  | 'month'        // 7xN grid
  | 'workWeek'     // Mon-Fri time slots
  | 'week'         // 7 days x 24h
  | 'day'          // 1 day x 24h
  | 'list'         // Chronological list
  | 'timeline'     // Horizontal timeline
  | 'timelineDay'  // Day timeline with resources
  | 'timelineWeek' // Week timeline with resources
  | 'timelineMonth'// Month timeline with resources
  | 'year'         // 12 mini-months
```

---

## Configuration Examples

### Business Hours

```typescript
// Simple business hours
businessHours: {
  daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
  startTime: '09:00',
  endTime: '18:00'
}

// Multiple ranges (split day)
businessHours: [
  { daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '12:00' },
  { daysOfWeek: [1, 2, 3, 4, 5], startTime: '14:00', endTime: '18:00' }
]
```

### Custom Event Content

```typescript
eventContent: (event) => ({
  template: `<strong>${event.title}</strong><br><small>${event.start}</small>`,
  className: 'custom-event-class'
})
```

### Themes

```typescript
// Built-in themes
theme: 'dark'   // Dark mode
theme: 'ocean'  // Blue tones
theme: 'rose'   // Pink/Red tones
theme: 'forest' // Green tones
theme: 'amber'  // Orange tones
```

---

## Project Structure

```
nexa-calendar/
├── packages/
│   ├── core/         # Domain logic, types, services
│   ├── ui/           # Lit web components, Tailwind views
│   ├── react/        # React wrapper (@lit-labs/react)
│   ├── vue/          # Vue component wrapper
│   ├── angular/      # Angular module
│   └── svelte/       # Svelte component
├── apps/
│   └── example/      # Demo application
└── .github/
    └── workflows/    # CI/CD pipelines
```

---

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Format code
pnpm format

# Build all packages
pnpm -r build
```

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance
ci: CI/CD changes
```

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- [TimeGuard](https://github.com/bereasoftware/time-guard) - Date handling with 40+ locales
- [Lit](https://lit.dev/) - Web Component framework
- [FullCalendar](https://fullcalendar.io/) - Inspiration for calendar functionality

---

<div align="center">

**Star us on GitHub if you find this project useful!**

</div>