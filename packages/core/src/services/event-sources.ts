import type { ICalendarEvent, EventInput } from '../types/event';
import type { IEventSource } from '../types/source';
import type { DateRange } from '../types/view';

export class LocalEventSource implements IEventSource {
  readonly id: string;
  private _events: ICalendarEvent[];

  constructor(events: ICalendarEvent[], id?: string) {
    this.id = id ?? 'local';
    this._events = events;
  }

  async fetch(_range: DateRange): Promise<ICalendarEvent[]> {
    return this._events;
  }

  setEvents(events: ICalendarEvent[]): void {
    this._events = events;
  }
}

export class JsonEventSource implements IEventSource {
  readonly id: string;
  private _url: string;

  constructor(url: string, id?: string) {
    this.id = id ?? 'json';
    this._url = url;
  }

  async fetch(range: DateRange): Promise<ICalendarEvent[]> {
    const params = new URLSearchParams({
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    });
    const res = await fetch(`${this._url}?${params}`);
    if (!res.ok) throw new Error(`Failed to fetch events from ${this._url}`);
    const data = (await res.json()) as EventInput[];
    return data.map(d => ({
      ...(d as ICalendarEvent),
      id: d.id ?? crypto.randomUUID(),
      title: d.title ?? '(No title)',
      start: d.start as unknown as ICalendarEvent['start'],
    }));
  }
}

export class FunctionalEventSource implements IEventSource {
  readonly id: string;
  private _fetchFn: (range: DateRange) => Promise<ICalendarEvent[]>;

  constructor(fetchFn: (range: DateRange) => Promise<ICalendarEvent[]>, id?: string) {
    this.id = id ?? 'fn';
    this._fetchFn = fetchFn;
  }

  async fetch(range: DateRange): Promise<ICalendarEvent[]> {
    return this._fetchFn(range);
  }
}
