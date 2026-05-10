import { TimeGuard } from '@bereasoftware/time-guard';
import type { ICalendarEvent, EventInput, EventId } from '../types/event';

export class EventManager {
  private _events: ICalendarEvent[] = [];

  get events(): ICalendarEvent[] {
    return [...this._events];
  }

  setEvents(inputs: EventInput[]): void {
    this._events = inputs.map(i => this._createEvent(i));
  }

  addEvent(input: EventInput): ICalendarEvent {
    const event = this._createEvent(input);
    this._events = [...this._events, event];
    return event;
  }

  getEventById(id: EventId): ICalendarEvent | undefined {
    return this._events.find(e => e.id === id);
  }

  updateEvent(id: EventId, props: Partial<EventInput>): ICalendarEvent | undefined {
    const idx = this._events.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    const existing = this._events[idx];
    const updated = this._mergeEvent(existing, props);
    this._events = [...this._events.slice(0, idx), updated, ...this._events.slice(idx + 1)];
    return updated;
  }

  removeEvent(id: EventId): boolean {
    const len = this._events.length;
    this._events = this._events.filter(e => e.id !== id);
    return this._events.length < len;
  }

  removeAll(): void {
    this._events = [];
  }

  getEventsInRange(start: TimeGuard, end: TimeGuard): ICalendarEvent[] {
    return this._events.filter(e => {
      if (e.end) {
        return e.start.isBefore(end) && e.end.isAfter(start);
      }
      return e.start.isBetween(start, end, 'day', '[)');
    });
  }

  private _createEvent(input: EventInput): ICalendarEvent {
    const start =
      input.start instanceof TimeGuard
        ? input.start
        : TimeGuard.from(this._sanitize(input.start ?? TimeGuard.now().toISOString()));

    const end = input.end
      ? input.end instanceof TimeGuard
        ? input.end
        : TimeGuard.from(this._sanitize(input.end))
      : undefined;

    return {
      id: input.id ?? crypto.randomUUID(),
      title: input.title ?? '(No title)',
      start,
      end,
      allDay: input.allDay ?? false,
      groupId: input.groupId,
      url: input.url,
      display: input.display ?? 'auto',
      backgroundColor: input.backgroundColor,
      borderColor: input.borderColor,
      textColor: input.textColor,
      classNames: input.classNames,
      editable: input.editable ?? true,
      startEditable: input.startEditable ?? true,
      durationEditable: input.durationEditable ?? true,
      overlap: input.overlap ?? true,
      extendedProps: input.extendedProps ?? {},
    };
  }

  private _sanitize(input: string): string {
    return typeof input === 'string' ? input.replace(/Z$/i, '') : input;
  }

  private _mergeEvent(existing: ICalendarEvent, props: Partial<EventInput>): ICalendarEvent {
    return {
      ...existing,
      title: props.title ?? existing.title,
      start: props.start
        ? props.start instanceof TimeGuard
          ? props.start
          : TimeGuard.from(this._sanitize(props.start))
        : existing.start,
      end:
        props.end !== undefined
          ? props.end instanceof TimeGuard
            ? props.end
            : TimeGuard.from(this._sanitize(props.end))
          : existing.end,
      allDay: props.allDay ?? existing.allDay,
      groupId: props.groupId ?? existing.groupId,
      url: props.url ?? existing.url,
      display: props.display ?? existing.display,
      backgroundColor: props.backgroundColor ?? existing.backgroundColor,
      borderColor: props.borderColor ?? existing.borderColor,
      textColor: props.textColor ?? existing.textColor,
      classNames: props.classNames ?? existing.classNames,
      editable: props.editable ?? existing.editable,
      startEditable: props.startEditable ?? existing.startEditable,
      durationEditable: props.durationEditable ?? existing.durationEditable,
      overlap: props.overlap ?? existing.overlap,
      extendedProps: { ...existing.extendedProps, ...props.extendedProps },
    };
  }
}
