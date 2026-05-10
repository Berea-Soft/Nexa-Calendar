import { TimeGuard } from '@bereasoftware/time-guard';
export class DateUtils {
    static now() {
        return TimeGuard.now();
    }
    static from(input) {
        return TimeGuard.from(input);
    }
    static today() {
        return TimeGuard.now().startOf('day');
    }
    static getMonthRange(date) {
        return {
            start: this._toSundayStart(date.startOf('month')),
            end: this._toSaturdayEnd(date.endOf('month')),
        };
    }
    static getTimelineRange(date) {
        return {
            start: date.startOf('month').startOf('day'),
            end: date.endOf('month').endOf('day'),
        };
    }
    static getWeekRange(date) {
        return {
            start: this._toSundayStart(date),
            end: this._toSaturdayEnd(date),
        };
    }
    static getDayRange(date) {
        return {
            start: date.startOf('day'),
            end: date.endOf('day'),
        };
    }
    static generateMonthGrid(date) {
        const start = this._toSundayStart(date.startOf('month'));
        const end = this._toSaturdayEnd(date.endOf('month'));
        const cells = [];
        let cursor = start;
        while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
            cells.push(cursor);
            cursor = cursor.add({ day: 1 });
        }
        return cells;
    }
    static generateWeekDays(date) {
        const start = this._toSundayStart(date);
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(start.add({ day: i }));
        }
        return days;
    }
    static _toSundayStart(date) {
        return date.subtract({ day: date.dayOfWeek() % 7 });
    }
    static _toSaturdayEnd(date) {
        const sunday = this._toSundayStart(date.add({ day: 7 }));
        return sunday.subtract({ day: 1 });
    }
    static generateTimeSlots(minTime = 0, maxTime = 24, slotDuration = 60) {
        const slots = [];
        for (let h = minTime; h < maxTime; h++) {
            for (let m = 0; m < 60; m += slotDuration) {
                slots.push(h + m / 60);
            }
        }
        return slots;
    }
    static isInBusinessHours(date, businessHours) {
        const dayOfWeek = date.dayOfWeek();
        if (businessHours.daysOfWeek && !businessHours.daysOfWeek.includes(dayOfWeek))
            return false;
        const startHour = parseInt((businessHours.startTime ?? businessHours.start ?? '09:00').split(':')[0], 10);
        const endHour = parseInt((businessHours.endTime ?? businessHours.end ?? '17:00').split(':')[0], 10);
        const hour = date.hour();
        return hour >= startHour && hour < endHour;
    }
    static formatTime(date, format = 'h:mm a') {
        const hour = date.hour();
        const minute = date.minute();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const hh12 = String(h12).padStart(2, '0');
        const hh24 = String(hour).padStart(2, '0');
        const mStr = minute.toString().padStart(2, '0');
        return format.replace(/HH|H|hh|h|mm|A|a/g, (token) => {
            switch (token) {
                case 'HH': return hh24;
                case 'H': return String(hour);
                case 'hh': return hh12;
                case 'h': return String(h12);
                case 'mm': return mStr;
                case 'A': return ampm;
                case 'a': return ampm.toLowerCase();
                default: return token;
            }
        });
    }
    static isSameDay(a, b) {
        return a.isSame(b, 'day');
    }
    static isToday(date) {
        return date.isToday();
    }
    static daysInMonth(date) {
        return date.daysInMonth();
    }
}
//# sourceMappingURL=date-utils.js.map