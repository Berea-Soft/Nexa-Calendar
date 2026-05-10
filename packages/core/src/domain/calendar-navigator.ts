import { TimeGuard } from '@bereasoftware/time-guard';
import type { INavigable } from '../types/navigable';

export class CalendarNavigator implements INavigable {
  private _currentDate: TimeGuard;

  constructor(date?: TimeGuard) {
    this._currentDate = date ?? TimeGuard.now().startOf('day');
  }

  get currentDate(): TimeGuard {
    return this._currentDate;
  }

  goPrev(view?: string): void {
    this._currentDate = this._currentDate.subtract(this._offset(view ?? 'month'));
  }

  goNext(view?: string): void {
    this._currentDate = this._currentDate.add(this._offset(view ?? 'month'));
  }

  goToday(): void {
    this._currentDate = TimeGuard.now().startOf('day');
  }

  goToDate(date: TimeGuard): void {
    this._currentDate = date;
  }

  increment(amount: number, unit: 'day' | 'week' | 'month' | 'year'): void {
    this._currentDate = this._currentDate.add({ [unit]: amount });
  }

  private _offset(view: string): Partial<Record<string, number>> {
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
