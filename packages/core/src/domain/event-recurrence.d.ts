import { TimeGuard } from '@bereasoftware/time-guard';
import type { ICalendarEvent } from '../types/event';
export declare class EventRecurrence {
    expandRecurringEvents(events: ICalendarEvent[], rangeStart: TimeGuard, rangeEnd: TimeGuard): ICalendarEvent[];
    private _expandSingle;
    private _expandWeekly;
    private _expandRRule;
}
