/**
 * @nexa-calendar/angular
 *
 * Angular 17+ wrapper for NxCalendar web component.
 *
 * Usage:
 *   // app.module.ts — add CUSTOM_ELEMENTS_SCHEMA
 *   import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
 *   @NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })
 *
 *   // In your component:
 *   import { NxCalendarComponent } from '@nexa-calendar/angular'
 *
 *   @Component({
 *     imports: [NxCalendarComponent],
 *     template: `<nx-calendar-wrapper [events]="events" view="month"
 *                  (eventClick)="onEventClick($event)"></nx-calendar-wrapper>`
 *   })
 */

import '@nexa-calendar/ui'

export { NxCalendarComponent } from './nx-calendar.component'
export type {
  EventInput,
  ViewType,
  ICalendarEvent,
  EventSourceRawInput,
  ICalendarPlugin,
  BusinessHours,
  DropPayload,
  ResourceInput,
} from '@nexa-calendar/core'
export type { NxTheme } from '@nexa-calendar/ui'
