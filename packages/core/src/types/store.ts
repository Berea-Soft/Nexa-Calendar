import { TimeGuard } from '@bereasoftware/time-guard';
import { ViewType } from './view';
import { ICalendarEvent } from './event';

export interface CalendarState {
  currentDate: TimeGuard;
  view: ViewType;
  events: ICalendarEvent[];
  isFetching: boolean;
  error?: string;
}

export type Listener = (state: CalendarState) => void;
export type Unsubscribe = () => void;

export type CalendarEvent =
  | 'stateChanged'
  | 'selectionChanged'
  | 'eventDrop'
  | 'eventResize'
  | 'dateClick';

export interface CalendarEventPayloads {
  stateChanged: CalendarState;
  selectionChanged: { start: TimeGuard | null; end: TimeGuard | null };
  eventDrop: { event: ICalendarEvent; oldStart: TimeGuard; newStart: TimeGuard };
  eventResize: { event: ICalendarEvent; oldEnd: TimeGuard; newEnd: TimeGuard };
  dateClick: { date: TimeGuard; allDay: boolean };
}
