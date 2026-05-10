import type { BusinessHours, DayColumn, ICalendarEvent } from '@nexa-calendar/core';
export interface VisualTimeSlot {
  totalMinutes: number;
  hour: number;
  minute: number;
  label: string;
  isHourBoundary: boolean;
}
export declare function parseTimeToMinutes(time: string): number;
export declare function buildVisualTimeSlots(
  minTime: string,
  maxTime: string,
  slotDuration: number,
  slotLabelFormat?: string
): VisualTimeSlot[];
export declare function getSlotHeight(hourHeight: number, slotDuration: number): number;
export declare function getColumnTimedEvents(column: DayColumn): ICalendarEvent[];
export declare function getTimedEventsForSlot(
  events: ICalendarEvent[],
  slotStartMinutes: number,
  slotDuration: number
): ICalendarEvent[];
export declare function getBackgroundEventsForSlot(
  events: ICalendarEvent[],
  slotStartMinutes: number,
  slotDuration: number
): ICalendarEvent[];
export declare function isBusinessTimeSlot(
  date: import('@bereasoftware/time-guard').TimeGuard,
  totalMinutes: number,
  businessHours: BusinessHours | BusinessHours[] | boolean
): boolean;
export declare function getSlotDateTime(
  date: import('@bereasoftware/time-guard').TimeGuard,
  totalMinutes: number
): import('@bereasoftware/time-guard').TimeGuard;
