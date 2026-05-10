import { CalendarStore } from '../domain/store';
export interface ICalendarPlugin {
    readonly name: string;
    readonly version: string;
    install(store: CalendarStore): void;
}
