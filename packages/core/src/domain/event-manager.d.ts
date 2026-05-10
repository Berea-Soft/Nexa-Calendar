import { TimeGuard } from '@bereasoftware/time-guard';
import type { ICalendarEvent, EventInput, EventId } from '../types/event';
export declare class EventManager {
  private _events;
  get events(): ICalendarEvent[];
  setEvents(inputs: EventInput[]): void;
  addEvent(input: EventInput): ICalendarEvent;
  getEventById(id: EventId): ICalendarEvent | undefined;
  updateEvent(id: EventId, props: Partial<EventInput>): ICalendarEvent | undefined;
  removeEvent(id: EventId): boolean;
  removeAll(): void;
  getEventsInRange(start: TimeGuard, end: TimeGuard): ICalendarEvent[];
  private _createEvent;
  private _sanitize;
  private _mergeEvent;
}
