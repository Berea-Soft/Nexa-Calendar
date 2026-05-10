import { ICalendarEvent } from './event';
import { TimeGuard } from '@bereasoftware/time-guard';
export interface DragStartPayload {
    event: ICalendarEvent;
    sourceEl: HTMLElement;
    startX: number;
    startY: number;
}
export interface DragEndPayload {
    event: ICalendarEvent;
    newStart: TimeGuard;
    newEnd?: TimeGuard;
    deltaDays: number;
    deltaMinutes: number;
}
export interface ResizeStartPayload {
    event: ICalendarEvent;
    sourceEl: HTMLElement;
    edge: 'start' | 'end';
}
export interface ResizeEndPayload {
    event: ICalendarEvent;
    newEnd: TimeGuard;
    deltaMinutes: number;
}
export interface DropPayload {
    date: TimeGuard;
    allDay: boolean;
    resourceId?: string;
}
