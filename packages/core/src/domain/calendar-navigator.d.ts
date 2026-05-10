import { TimeGuard } from '@bereasoftware/time-guard';
import type { INavigable } from '../types/navigable';
export declare class CalendarNavigator implements INavigable {
    private _currentDate;
    constructor(date?: TimeGuard);
    get currentDate(): TimeGuard;
    goPrev(view?: string): void;
    goNext(view?: string): void;
    goToday(): void;
    goToDate(date: TimeGuard): void;
    increment(amount: number, unit: 'day' | 'week' | 'month' | 'year'): void;
    private _offset;
}
