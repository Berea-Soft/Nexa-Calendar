/**
 * @nexa-calendar/svelte
 *
 * Svelte 4 wrapper for NxCalendar web component.
 *
 * Usage:
 *   import NxCalendar from '@nexa-calendar/svelte/NxCalendar.svelte'
 *   <NxCalendar events={events} view="month" theme="light"
 *     on:eventClick={handler} />
 *
 * All props are passed imperatively to the `nx-calendar` custom element.
 * Events are forwarded from the WC's CustomEvents to Svelte dispatched events.
 */

import '@nexa-calendar/ui';

export type {
  EventInput,
  ViewType,
  ICalendarEvent,
  EventSourceRawInput,
  ICalendarPlugin,
  BusinessHours,
  DropPayload,
  ResourceInput,
} from '@nexa-calendar/core';
export type { NxTheme } from '@nexa-calendar/ui';
