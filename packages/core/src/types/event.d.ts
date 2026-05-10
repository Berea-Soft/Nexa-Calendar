import { TimeGuard } from '@bereasoftware/time-guard';
import { EventConstraint } from './constraint';
export type EventId = string | number;
export type EventDisplay =
  | 'auto'
  | 'block'
  | 'list-item'
  | 'background'
  | 'inverse-background'
  | 'none';
export interface ICalendarEvent {
  readonly id: EventId;
  title: string;
  start: TimeGuard;
  end?: TimeGuard;
  allDay: boolean;
  groupId?: string;
  url?: string;
  display: EventDisplay;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  classNames?: string[];
  editable: boolean;
  startEditable: boolean;
  durationEditable: boolean;
  overlap: boolean;
  constraint?: EventConstraint;
  rrule?: string;
  daysOfWeek?: number[];
  startRecur?: string;
  endRecur?: string;
  resourceId?: string | string[];
  extendedProps: Record<string, unknown>;
}
export type EventInput = {
  id?: EventId;
  title?: string;
  start?: string | TimeGuard;
  end?: string | TimeGuard;
  allDay?: boolean;
  groupId?: string;
  url?: string;
  display?: EventDisplay;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  classNames?: string[];
  editable?: boolean;
  startEditable?: boolean;
  durationEditable?: boolean;
  overlap?: boolean;
  constraint?: EventConstraint;
  rrule?: string;
  daysOfWeek?: number[];
  startRecur?: string;
  endRecur?: string;
  resourceId?: string | string[];
  extendedProps?: Record<string, unknown>;
};
