import { TimeGuard } from '@bereasoftware/time-guard';
import type { DateRange } from '../types/view';
export declare class DateUtils {
    static now(): TimeGuard;
    static from(input: unknown): TimeGuard;
    static today(): TimeGuard;
    static getMonthRange(date: TimeGuard): DateRange;
    static getTimelineRange(date: TimeGuard): DateRange;
    static getWeekRange(date: TimeGuard): DateRange;
    static getDayRange(date: TimeGuard): DateRange;
    static generateMonthGrid(date: TimeGuard): TimeGuard[];
    static generateWeekDays(date: TimeGuard): TimeGuard[];
    private static _toSundayStart;
    private static _toSaturdayEnd;
    static generateTimeSlots(minTime?: number, maxTime?: number, slotDuration?: number): number[];
    static isInBusinessHours(date: TimeGuard, businessHours: {
        daysOfWeek?: number[];
        startTime?: string;
        start?: string;
        endTime?: string;
        end?: string;
    }): boolean;
    static formatTime(date: TimeGuard, format?: string): string;
    static isSameDay(a: TimeGuard, b: TimeGuard): boolean;
    static isToday(date: TimeGuard): boolean;
    static daysInMonth(date: TimeGuard): number;
}
