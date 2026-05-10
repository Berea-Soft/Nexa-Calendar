import type { ICalendarEvent } from '../types/event';
import type { IEventSource } from '../types/source';
import type { DateRange } from '../types/view';
export declare class LocalEventSource implements IEventSource {
    readonly id: string;
    private _events;
    constructor(events: ICalendarEvent[], id?: string);
    fetch(_range: DateRange): Promise<ICalendarEvent[]>;
    setEvents(events: ICalendarEvent[]): void;
}
export declare class JsonEventSource implements IEventSource {
    readonly id: string;
    private _url;
    constructor(url: string, id?: string);
    fetch(range: DateRange): Promise<ICalendarEvent[]>;
}
export declare class FunctionalEventSource implements IEventSource {
    readonly id: string;
    private _fetchFn;
    constructor(fetchFn: (range: DateRange) => Promise<ICalendarEvent[]>, id?: string);
    fetch(range: DateRange): Promise<ICalendarEvent[]>;
}
