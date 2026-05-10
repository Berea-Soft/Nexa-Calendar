import { TimeGuard } from '@bereasoftware/time-guard'

export interface INavigable {
  currentDate: TimeGuard
  goPrev(view?: string): void
  goNext(view?: string): void
  goToday(): void
  goToDate(date: TimeGuard): void
  increment(amount: number, unit: 'day' | 'week' | 'month' | 'year'): void
}
