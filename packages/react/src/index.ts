import React from 'react';
import { createComponent } from '@lit-labs/react';
import { NxCalendar as NxCalendarElement } from '@nexa-calendar/ui';
import type { NxTheme } from '@nexa-calendar/ui';
import type {
  EventInput,
  ViewType,
  ICalendarEvent,
  EventSourceRawInput,
  ICalendarPlugin,
  DropPayload,
  BusinessHours,
  ResourceInput,
} from '@nexa-calendar/core';

export interface NxCalendarProps {
  events?: EventInput[];
  resources?: ResourceInput[];
  eventSources?: EventSourceRawInput[];
  view?: ViewType;
  locale?: string;
  theme?: NxTheme;
  views?: ViewType[];
  businessHours?: BusinessHours | BusinessHours[] | boolean;
  minTime?: string;
  maxTime?: string;
  slotDuration?: number;
  slotLabelFormat?: string;
  scrollToTime?: string;
  dayMaxEvents?: number | boolean;
  fixedWeekCount?: boolean;
  weekends?: boolean;
  showNonCurrentDates?: boolean;
  firstDay?: number;
  editable?: boolean;
  eventStartEditable?: boolean;
  eventDurationEditable?: boolean;
  plugins?: ICalendarPlugin[];
  headerToolbar?: boolean | Record<string, string>;
  height?: 'auto' | number | string;
  aspectRatio?: number;
  onDateClick?: (e: CustomEvent<{ date: string; allDay: boolean }>) => void;
  onEventClick?: (e: CustomEvent<{ id: string | number; event: ICalendarEvent }>) => void;
  onEventDrop?: (
    e: CustomEvent<{ event: ICalendarEvent; oldStart: string; newStart: string }>
  ) => void;
  onEventResize?: (
    e: CustomEvent<{ event: ICalendarEvent; oldEnd?: string; newEnd: string }>
  ) => void;
  onDrop?: (e: CustomEvent<DropPayload>) => void;
}

export const NxCalendar = createComponent({
  tagName: 'nx-calendar',
  elementClass: NxCalendarElement,
  react: React,
  events: {
    onDateClick: 'dateClick',
    onEventClick: 'eventClick',
    onEventDrop: 'eventDrop',
    onEventResize: 'eventResize',
    onDrop: 'drop',
  },
});
