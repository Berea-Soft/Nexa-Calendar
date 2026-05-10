import { TimeGuard } from '@bereasoftware/time-guard';
export class CalendarNavigator {
    constructor(date) {
        this._currentDate = date ?? TimeGuard.now().startOf('day');
    }
    get currentDate() {
        return this._currentDate;
    }
    goPrev(view) {
        this._currentDate = this._currentDate.subtract(this._offset(view ?? 'month'));
    }
    goNext(view) {
        this._currentDate = this._currentDate.add(this._offset(view ?? 'month'));
    }
    goToday() {
        this._currentDate = TimeGuard.now().startOf('day');
    }
    goToDate(date) {
        this._currentDate = date;
    }
    increment(amount, unit) {
        this._currentDate = this._currentDate.add({ [unit]: amount });
    }
    _offset(view) {
        switch (view) {
            case 'month':
                return { month: 1 };
            case 'week':
                return { week: 1 };
            case 'day':
                return { day: 1 };
            case 'list':
                return { month: 1 };
            default:
                return { month: 1 };
        }
    }
}
//# sourceMappingURL=calendar-navigator.js.map