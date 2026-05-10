# SKILLS.md — Development Guide

## TypeScript Proficiency

- Strict mode, `noUncheckedIndexedAccess`, exhaustive type guards
- Generic constraints, conditional types for event source plugins
- `as const` for literal types, branded types for IDs
- Discriminated unions for event actions

## TimeGuard API

Essential API surface used across the project:

```typescript
import { TimeGuard, timeGuard, TimeRange } from '@bereasoftware/time-guard';

// Creation
TimeGuard.now(); // current moment
TimeGuard.from('2024-03-15'); // parse ISO string
timeGuard(new Date()); // from native Date (only bridge point)
TimeGuard.from({ year: 2024, month: 3, day: 15 });

// Queries
tg.isBefore(other);
tg.isAfter(other);
tg.isSame(other, 'day');
tg.isBetween(start, end);
tg.isToday();
tg.daysInMonth();

// Navigation
tg.add({ months: 1 });
tg.subtract({ days: 7 });
tg.startOf('month');
tg.endOf('month');

// Diff
tg.diff(other).as('days'); // raw number
tg.diff(other, { mode: 'calendar' }).format('es'); // "2 meses y 5 días"
tg.since(other).humanize(); // "2 months ago"
tg.until(other).humanize({ fullBreakdown: true });

// Range
TimeGuard.range(start, end).humanize();
TimeGuard.range(start, end).in('days');
TimeGuard.between(a, b).total('hours');

// Formatting
tg.format('iso'); // 2024-03-15T00:00:00Z
tg.format('date'); // 2024-03-15
tg.format('datetime'); // March 15, 2024 at 12:00 AM
```

## Lit 3 Web Components

```typescript
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('nx-month-view')
export class NxMonthView extends LitElement {
  @property({ type: Object }) store?: CalendarStore;
  @state() private _grid: DayInfo[] = [];
}
```

## Tailwind CSS

- Utility-first, no custom CSS
- Use `@apply` only in component styles as last resort
- Responsive: `sm:`, `md:`, `lg:`
- Dark mode: `dark:` variant
- Colors: `gray-50` through `gray-900`, `blue-*`, `red-*`, `green-*`

## Git Workflow

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Branch from `main`, PR to `main`
- One feature per commit
- Run `turbo build` before pushing
