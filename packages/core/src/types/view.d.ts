import { TimeGuard } from '@bereasoftware/time-guard';
import { ICalendarEvent } from './event';
import { IResource } from './resource';
export type ViewType =
  | 'month'
  | 'workWeek'
  | 'week'
  | 'day'
  | 'list'
  | 'timeline'
  | 'timelineDay'
  | 'timelineWeek'
  | 'timelineMonth'
  | 'year';
export interface DateRange {
  start: TimeGuard;
  end: TimeGuard;
}
export interface DayCell {
  date: TimeGuard;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: ICalendarEvent[];
}
export interface TimeSlot {
  hour: number;
  date: TimeGuard;
  events: ICalendarEvent[];
}
export interface DayColumn {
  date: TimeGuard;
  slots: TimeSlot[];
  allDayEvents: ICalendarEvent[];
}
export interface ListEvent {
  event: ICalendarEvent;
  date: TimeGuard;
}
export interface TimelineColumn {
  date: TimeGuard;
  label: string;
  isToday: boolean;
  isWeekend: boolean;
}
export interface TimelinePositionedEvent {
  event: ICalendarEvent;
  leftPct: number;
  widthPct: number;
}
export interface TimelineEventRow {
  events: TimelinePositionedEvent[];
}
export interface TimelineGrid {
  columns: TimelineColumn[];
  eventRows: TimelineEventRow[];
}
export interface ResourceTimelineRow {
  resource: IResource;
  depth: number;
  collapsed: boolean;
  events: TimelinePositionedEvent[];
}
export interface ResourceTimelineGrid {
  columns: TimelineColumn[];
  rows: ResourceTimelineRow[];
}
export interface YearMonthCell {
  date: TimeGuard;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  eventCount: number;
}
export interface YearMonth {
  monthDate: TimeGuard;
  label: string;
  cells: YearMonthCell[];
}
export interface YearGrid {
  year: number;
  months: YearMonth[];
}
export interface ViewOptions {
  businessHours?: {
    daysOfWeek?: number[];
    startTime?: string;
    endTime?: string;
  };
  minTime?: string;
  maxTime?: string;
  slotDuration?: number;
  slotLabelFormat?: string;
  scrollToTime?: string;
  dayMaxEvents?: number | boolean;
  weekends?: boolean;
  showNonCurrentDates?: boolean;
  fixedWeekCount?: boolean;
}
export interface IView {
  readonly type: ViewType;
  getTitle(range: DateRange, locale?: string): string;
  generateGrid(
    range: DateRange,
    events: ICalendarEvent[],
    resources?: IResource[]
  ): DayCell[] | DayColumn[] | ListEvent[] | TimelineGrid | ResourceTimelineGrid | YearGrid;
  getViewOptions?(): Partial<ViewOptions>;
}
export type ViewTitleMap = Record<ViewType, (date: TimeGuard) => string>;
export type TimelineDuration = 'month' | 'week' | 'day';
