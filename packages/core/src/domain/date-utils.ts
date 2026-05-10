import { TimeGuard, timeGuard } from '@bereasoftware/time-guard'
import type { DateRange } from '../types/view'

export class DateUtils {
  static now(): TimeGuard {
    return TimeGuard.now()
  }

  static from(input: unknown): TimeGuard {
    return TimeGuard.from(input)
  }

  static today(): TimeGuard {
    return TimeGuard.now().startOf('day')
  }

  static getMonthRange(date: TimeGuard): DateRange {
    return {
      start: this._toSundayStart(date.startOf('month')),
      end: this._toSaturdayEnd(date.endOf('month')),
    }
  }

  static getTimelineRange(date: TimeGuard): DateRange {
    return {
      start: date.startOf('month').startOf('day'),
      end: date.endOf('month').endOf('day'),
    }
  }

  static getWeekRange(date: TimeGuard): DateRange {
    return {
      start: this._toSundayStart(date),
      end: this._toSaturdayEnd(date),
    }
  }

  static getDayRange(date: TimeGuard): DateRange {
    return {
      start: date.startOf('day'),
      end: date.endOf('day'),
    }
  }

  static generateMonthGrid(date: TimeGuard): TimeGuard[] {
    const start = this._toSundayStart(date.startOf('month'))
    const end = this._toSaturdayEnd(date.endOf('month'))
    const cells: TimeGuard[] = []
    let cursor = start
    while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
      cells.push(cursor)
      cursor = cursor.add({ day: 1 })
    }
    return cells
  }

  static generateWeekDays(date: TimeGuard): TimeGuard[] {
    const start = this._toSundayStart(date)
    const days: TimeGuard[] = []
    for (let i = 0; i < 7; i++) {
      days.push(start.add({ day: i }))
    }
    return days
  }

  private static _toSundayStart(date: TimeGuard): TimeGuard {
    return date.subtract({ day: date.dayOfWeek() % 7 })
  }

  private static _toSaturdayEnd(date: TimeGuard): TimeGuard {
    const sunday = this._toSundayStart(date.add({ day: 7 }))
    return sunday.subtract({ day: 1 })
  }

  static generateTimeSlots(minTime = 0, maxTime = 24, slotDuration = 60): number[] {
    const slots: number[] = []
    for (let h = minTime; h < maxTime; h++) {
      for (let m = 0; m < 60; m += slotDuration) {
        slots.push(h + m / 60)
      }
    }
    return slots
  }

  static isInBusinessHours(date: TimeGuard, businessHours: { daysOfWeek?: number[]; startTime?: string; start?: string; endTime?: string; end?: string }): boolean {
    const dayOfWeek = date.dayOfWeek()
    if (businessHours.daysOfWeek && !businessHours.daysOfWeek.includes(dayOfWeek)) return false
    const startHour = parseInt((businessHours.startTime ?? businessHours.start ?? '09:00').split(':')[0], 10)
    const endHour = parseInt((businessHours.endTime ?? businessHours.end ?? '17:00').split(':')[0], 10)
    const hour = date.hour()
    return hour >= startHour && hour < endHour
  }

  static formatTime(date: TimeGuard, format = 'h:mm a'): string {
    const hour = date.hour()
    const minute = date.minute()
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const hh12 = String(h12).padStart(2, '0')
    const hh24 = String(hour).padStart(2, '0')
    const mStr = minute.toString().padStart(2, '0')
    return format.replace(/HH|H|hh|h|mm|A|a/g, (token) => {
      switch (token) {
        case 'HH': return hh24
        case 'H': return String(hour)
        case 'hh': return hh12
        case 'h': return String(h12)
        case 'mm': return mStr
        case 'A': return ampm
        case 'a': return ampm.toLowerCase()
        default: return token
      }
    })
  }

  static isSameDay(a: TimeGuard, b: TimeGuard): boolean {
    return a.isSame(b, 'day')
  }

  static isToday(date: TimeGuard): boolean {
    return date.isToday()
  }

  static daysInMonth(date: TimeGuard): number {
    return date.daysInMonth()
  }
}
