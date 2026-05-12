<!-- markdownlint-disable MD033 MD041 -->
<div align="center">

# Nexa-Calendar

A Full-featured calendar library built with Web Components (Lit 3) and React, Vue, Angular, and Svelte wrappers.

[![npm version](https://img.shields.io/npm/v/@nexa-calendar/core.svg)](https://www.npmjs.com/package/@nexa-calendar/core)
[![License](https://img.shields.io/npm/l/@nexa-calendar/core.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Lit](https://img.shields.io/badge/Lit-3.0+-blue.svg)](https://lit.dev/)

[Demo](https://nexa-calendar.vercel.app) · [Changelog](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md) · [GitHub](https://github.com/Berea-Soft/Nexa-Calendar)

</div>

---

## Packages

| Package                                                | Version                                                     | Description                   |
| ------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------- |
| [@nexa-calendar/core](./packages/core/README.md)       | ![npm](https://img.shields.io/npm/v/@nexa-calendar/core)    | Domain logic, types, services |
| [@nexa-calendar/ui](./packages/ui/README.md)           | ![npm](https://img.shields.io/npm/v/@nexa-calendar/ui)      | Lit Web Components            |
| [@nexa-calendar/react](./packages/react/README.md)     | ![npm](https://img.shields.io/npm/v/@nexa-calendar/react)   | React wrapper                 |
| [@nexa-calendar/vue](./packages/vue/README.md)         | ![npm](https://img.shields.io/npm/v/@nexa-calendar/vue)     | Vue 3 wrapper                 |
| [@nexa-calendar/angular](./packages/angular/README.md) | ![npm](https://img.shields.io/npm/v/@nexa-calendar/angular) | Angular module                |
| [@nexa-calendar/svelte](./packages/svelte/README.md)   | ![npm](https://img.shields.io/npm/v/@nexa-calendar/svelte)  | Svelte component              |

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

Choose your preferred framework:

### Web Components (Vanilla JS)

```bash
npm install @nexa-calendar/ui @nexa-calendar/core
```

[Documentation](./packages/ui/README.md)

### React

```bash
npm install @nexa-calendar/react @nexa-calendar/ui @nexa-calendar/core
```

[Documentation](./packages/react/README.md)

### Vue 3

```bash
npm install @nexa-calendar/vue @nexa-calendar/ui @nexa-calendar/core
```

[Documentation](./packages/vue/README.md)

### Angular

```bash
npm install @nexa-calendar/angular @nexa-calendar/ui @nexa-calendar/core
```

[Documentation](./packages/angular/README.md)

### Svelte

```bash
npm install @nexa-calendar/svelte @nexa-calendar/ui @nexa-calendar/core
```

[Documentation](./packages/svelte/README.md)

### Core (No UI)

For custom implementations:

```bash
npm install @nexa-calendar/core
```

[Documentation](./packages/core/README.md)

---

## API Reference

### Properties

| Property                | Type                | Default   | Description                  |
| ----------------------- | ------------------- | --------- | ---------------------------- |
| `view`                  | `ViewType`          | `'month'` | Current view type            |
| `views`                 | `ViewType[]`        | All views | Available views              |
| `locale`                | `string`            | `'en'`    | Locale code                  |
| `theme`                 | `string`            | `'light'` | Theme name                   |
| `events`                | `ICalendarEvent[]`  | `[]`      | Calendar events              |
| `resources`             | `IResource[]`       | `[]`      | Resources for timeline       |
| `editable`              | `boolean`           | `true`    | Enable event editing         |
| `eventStartEditable`    | `boolean`           | `true`    | Allow moving events          |
| `eventDurationEditable` | `boolean`           | `true`    | Allow resizing events        |
| `businessHours`         | `BusinessHours`     | `false`   | Business hours config        |
| `weekends`              | `boolean`           | `true`    | Show weekends                |
| `dayMaxEvents`          | `number \| boolean` | `false`   | Max events per day           |
| `slotDuration`          | `number`            | `60`      | Time slot duration (minutes) |
| `hourHeight`            | `number`            | `48`      | Hour row height (px)         |
| `minTime`               | `string`            | `'00:00'` | Day start time               |
| `maxTime`               | `string`            | `'24:00'` | Day end time                 |

### Events

| Event         | Detail                          | Description           |
| ------------- | ------------------------------- | --------------------- |
| `dateClick`   | `{ date, allDay }`              | User clicked a date   |
| `eventClick`  | `ICalendarEvent`                | User clicked an event |
| `eventDrop`   | `{ eventId, newStart }`         | Event was moved       |
| `eventResize` | `{ eventId, newStart, newEnd }` | Event was resized     |

### View Types

```typescript
type ViewType =
  | 'month' // 7xN grid
  | 'workWeek' // Mon-Fri time slots
  | 'week' // 7 days x 24h
  | 'day' // 1 day x 24h
  | 'list' // Chronological list
  | 'timeline' // Horizontal timeline
  | 'timelineDay' // Day timeline with resources
  | 'timelineWeek' // Week timeline with resources
  | 'timelineMonth' // Month timeline with resources
  | 'year'; // 12 mini-months
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
eventContent: event => ({
  template: `<strong>${event.title}</strong><br><small>${event.start}</small>`,
  className: 'custom-event-class',
});
```

### Themes

```typescript
// Built-in themes
theme: 'dark'; // Dark mode
theme: 'ocean'; // Blue tones
theme: 'rose'; // Pink/Red tones
theme: 'forest'; // Green tones
theme: 'amber'; // Orange tones
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

---

<div align="center">

**Star us on GitHub if you find this project useful!**

</div>
