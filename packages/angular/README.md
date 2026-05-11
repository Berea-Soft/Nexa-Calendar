# @nexa-calendar/angular

Angular module wrapper for Nexa-Calendar.

## Installation

```bash
npm install @nexa-calendar/angular @nexa-calendar/ui @nexa-calendar/core
# or
pnpm add @nexa-calendar/angular @nexa-calendar/ui @nexa-calendar/core
```

## Setup

### 1. Import the Module

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxNxCalendarModule } from '@nexa-calendar/angular';
import '@nexa-calendar/ui/styles.css';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxNxCalendarModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### 2. Standalone Components (Angular 17+)

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { NgxNxCalendarModule } from '@nexa-calendar/angular';
import '@nexa-calendar/ui/styles.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxNxCalendarModule],
  template: `
    <ngx-nx-calendar
      [view]="'month'"
      [locale]="'en'"
      [theme]="'ocean'"
      [events]="events"
      (dateClick)="onDateClick($event)"
      (eventClick)="onEventClick($event)"
    />
  `,
})
export class AppComponent {
  events = [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date().toISOString(),
      duration: 60,
    },
  ];

  onDateClick(info: any) {
    console.log('Date clicked:', info.date);
  }

  onEventClick(info: any) {
    console.log('Event clicked:', info.event);
  }
}
```

## Input Properties

| Property              | Type               | Default   | Description     |
| --------------------- | ------------------ | --------- | --------------- |
| `@Input() view`       | `string`           | `'month'` | Current view    |
| `@Input() date`       | `Date`             | Today     | Current date    |
| `@Input() locale`     | `string`           | `'en'`    | Locale code     |
| `@Input() theme`      | `string`           | `'light'` | Theme name      |
| `@Input() events`     | `ICalendarEvent[]` | `[]`      | Calendar events |
| `@Input() resources`  | `IResource[]`      | `[]`      | Resources       |
| `@Input() editable`   | `boolean`          | `true`    | Enable editing  |
| `@Input() selectable` | `boolean`          | `true`    | Allow selection |
| `@Input() weekends`   | `boolean`          | `true`    | Show weekends   |
| `@Input() minTime`    | `string`           | `'00:00'` | Day start time  |
| `@Input() maxTime`    | `string`           | `'24:00'` | Day end time    |

## Output Events

| Event                   | Event Type         | Description           |
| ----------------------- | ------------------ | --------------------- |
| `@Output() dateClick`   | `DateClickEvent`   | User clicked a date   |
| `@Output() dateSelect`  | `DateSelectEvent`  | User selected a range |
| `@Output() eventClick`  | `EventClickEvent`  | User clicked an event |
| `@Output() eventDrop`   | `EventDropEvent`   | Event was moved       |
| `@Output() eventResize` | `EventResizeEvent` | Event was resized     |
| `@Output() viewChange`  | `ViewChangeEvent`  | View was changed      |

## Example: Event Handling

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  template: `
    <ngx-nx-calendar
      [view]="currentView"
      [events]="calendarEvents"
      [editable]="true"
      [selectable]="true"
      (dateClick)="handleDateClick($event)"
      (eventClick)="handleEventClick($event)"
      (eventDrop)="handleEventDrop($event)"
    />
  `,
})
export class CalendarComponent {
  currentView = 'week';
  calendarEvents = [
    {
      id: '1',
      title: 'Meeting',
      start: new Date().toISOString(),
      duration: 60,
    },
  ];

  handleDateClick(info: any) {
    // Create new event
    const newEvent = {
      id: Date.now().toString(),
      title: 'New Event',
      start: info.date.toISOString(),
      duration: 60,
    };
    this.calendarEvents = [...this.calendarEvents, newEvent];
  }

  handleEventClick(info: any) {
    console.log('Event:', info.event);
  }

  handleEventDrop(info: any) {
    console.log('Event moved:', info.event.id, 'to', info.newStart);
    // Update event in your backend
  }
}
```

## Themes

```html
<ngx-nx-calendar theme="dark"></ngx-nx-calendar>
<ngx-nx-calendar theme="ocean"></ngx-nx-calendar>
<ngx-nx-calendar theme="rose"></ngx-nx-calendar>
```

## Business Hours

```typescript
calendarEvents = [];

// In component
businessHours = {
  daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
  startTime: '09:00',
  endTime: '18:00',
};
```

```html
<ngx-nx-calendar [events]="calendarEvents" [businessHours]="businessHours" />
```

## License

MIT - see [LICENSE](../../LICENSE)
