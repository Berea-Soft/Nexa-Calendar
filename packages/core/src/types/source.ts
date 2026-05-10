import { ICalendarEvent, EventInput } from './event';
import { DateRange } from './view';

export interface IEventSource {
  readonly id: string;
  fetch(range: DateRange): Promise<ICalendarEvent[]>;
  refetchOnRangeChange?: boolean;
}

export type EventSourceInput =
  | ICalendarEvent[]
  | EventInput[]
  | string
  | ((range: DateRange) => Promise<ICalendarEvent[]>);

export type EventSourceRawInput = EventSourceInput | IEventSource;
