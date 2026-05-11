# @nexa-calendar/ui

Web Component (Lit 3) implementation of Nexa-Calendar. Drop-in calendar element for any framework.

## Installation

```bash
npm install @nexa-calendar/ui @nexa-calendar/core
# or
pnpm add @nexa-calendar/ui @nexa-calendar/core
```

## Usage

### HTML (Vanilla JS)

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module">
      import '@nexa-calendar/ui';
    </script>
    <link rel="stylesheet" href="@nexa-calendar/ui/styles.css" />
  </head>
  <body>
    <nx-calendar id="calendar" view="month" locale="en" theme="ocean"></nx-calendar>

    <script type="module">
      const cal = document.getElementById('calendar');
      cal.events = [
        {
          id: '1',
          title: 'Team Meeting',
          start: new Date().toISOString(),
          duration: 60,
        },
        {
          id: '2',
          title: 'Project Deadline',
          start: new Date(Date.now() + 86400000).toISOString(),
          duration: 480,
        },
      ];

      cal.addEventListener('date-click', e => {
        console.log('Date clicked:', e.detail.date);
      });

      cal.addEventListener('event-click', e => {
        console.log('Event clicked:', e.detail.event);
      });
    </script>
  </body>
</html>
```

### JavaScript Module

```javascript
import '@nexa-calendar/ui';
import '@nexa-calendar/ui/styles.css';

const calendar = document.createElement('nx-calendar');
calendar.setAttribute('view', 'week');
calendar.setAttribute('theme', 'dark');
calendar.events = eventsArray;
document.body.appendChild(calendar);
```

## Element: `<nx-calendar>`

### Attributes

| Attribute    | Type                 | Default   | Description                    |
| ------------ | -------------------- | --------- | ------------------------------ |
| `view`       | `string`             | `'month'` | Current view type              |
| `views`      | `string` (comma-sep) | All views | Available views as CSV         |
| `locale`     | `string`             | `'en'`    | Locale code (e.g., 'es', 'fr') |
| `theme`      | `string`             | `'light'` | Theme name                     |
| `editable`   | `boolean`            | `true`    | Enable event editing           |
| `selectable` | `boolean`            | `true`    | Allow date selection           |
| `weekends`   | `boolean`            | `true`    | Show weekend days              |

### Properties

```typescript
// Events array
calendar.events: ICalendarEvent[]

// Resources for timeline views
calendar.resources: IResource[]

// Business hours configuration
calendar.businessHours: BusinessHours | BusinessHours[] | boolean

// Time settings
calendar.minTime: string  // '00:00'
calendar.maxTime: string   // '24:00'
calendar.slotDuration: number  // minutes
calendar.hourHeight: number   // pixels
```

### Events

| Event          | Detail Type                           | Description              |
| -------------- | ------------------------------------- | ------------------------ |
| `date-click`   | `{ date: TimeGuard }`                 | User clicked a date cell |
| `date-select`  | `{ start, end }`                      | User selected a range    |
| `event-click`  | `{ event: ICalendarEvent }`           | User clicked an event    |
| `event-drop`   | `{ event, oldStart, newStart }`       | Event moved              |
| `event-resize` | `{ event, oldDuration, newDuration }` | Event resized            |
| `view-change`  | `{ view: ViewType }`                  | View was changed         |

### Example: Event Handling

```javascript
const cal = document.querySelector('nx-calendar');

// Listen to events
cal.addEventListener('date-click', e => {
  const { date } = e.detail;
  console.log('Clicked date:', date.format('YYYY-MM-DD'));

  // Create new event
  const newEvent = {
    id: Date.now().toString(),
    title: 'New Event',
    start: date.toISOString(),
    duration: 60,
  };
  cal.events = [...cal.events, newEvent];
});

cal.addEventListener('event-click', e => {
  const { event } = e.detail;
  console.log('Event:', event.title);
  // Open edit modal, etc.
});
```

### Themes

Available themes: `light`, `dark`, `ocean`, `rose`, `forest`, `slate`, `amber`

```html
<nx-calendar theme="dark"></nx-calendar> <nx-calendar theme="ocean"></nx-calendar>
```

### CSS Variables

Customize appearance with CSS variables:

```css
nx-calendar {
  --nx-accent: #3b82f6;
  --nx-accent-hover: #2563eb;
  --nx-border: #e5e7eb;
  --nx-text: #111827;
  --nx-text-muted: #6b7280;
  --nx-radius: 0.75rem;
  --nx-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Views

```html
<nx-calendar view="month"></nx-calendar>
<nx-calendar view="week"></nx-calendar>
<nx-calendar view="workWeek"></nx-calendar>
<nx-calendar view="day"></nx-calendar>
<nx-calendar view="list"></nx-calendar>
<nx-calendar view="timeline"></nx-calendar>
<nx-calendar view="timelineDay"></nx-calendar>
<nx-calendar view="timelineWeek"></nx-calendar>
<nx-calendar view="timelineMonth"></nx-calendar>
<nx-calendar view="year"></nx-calendar>
```

### Business Hours

```javascript
// Simple
cal.businessHours = {
  daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
  startTime: '09:00',
  endTime: '18:00',
};

// Multiple ranges
cal.businessHours = [
  { daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '12:00' },
  { daysOfWeek: [1, 2, 3, 4, 5], startTime: '14:00', endTime: '18:00' },
];
```

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

Requires support for:

- Custom Elements v1
- Shadow DOM
- CSS Custom Properties

## License

MIT - see [LICENSE](../../LICENSE)
