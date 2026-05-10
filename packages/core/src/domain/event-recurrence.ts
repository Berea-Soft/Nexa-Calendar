import { TimeGuard } from '@bereasoftware/time-guard'
import type { ICalendarEvent } from '../types/event'

export class EventRecurrence {
  expandRecurringEvents(events: ICalendarEvent[], rangeStart: TimeGuard, rangeEnd: TimeGuard): ICalendarEvent[] {
    const result: ICalendarEvent[] = []

    for (const event of events) {
      if (!event.rrule && !event.daysOfWeek) {
        result.push(event)
        continue
      }

      const expanded = this._expandSingle(event, rangeStart, rangeEnd)
      result.push(...expanded)
    }

    return result
  }

  private _expandSingle(event: ICalendarEvent, rangeStart: TimeGuard, rangeEnd: TimeGuard): ICalendarEvent[] {
    if (event.daysOfWeek && event.daysOfWeek.length > 0) {
      return this._expandWeekly(event, rangeStart, rangeEnd)
    }

    if (event.rrule) {
      return this._expandRRule(event, rangeStart, rangeEnd)
    }

    return [event]
  }

  private _expandWeekly(event: ICalendarEvent, rangeStart: TimeGuard, rangeEnd: TimeGuard): ICalendarEvent[] {
    const result: ICalendarEvent[] = []
    if (!event.daysOfWeek) return result

    let cursor = rangeStart
    while (cursor.isBefore(rangeEnd) || cursor.isSame(rangeEnd, 'day')) {
      const dayOfWeek = cursor.dayOfWeek()
      if (event.daysOfWeek.includes(dayOfWeek)) {
        const hour = event.start.hour()
        const minute = event.start.minute()
      let eventStart = cursor.add({ hour, minute })
        if (event.end) {
          const duration = event.end.valueOf() - event.start.valueOf()
          const eventEnd = TimeGuard.from(eventStart.valueOf() + duration)
          result.push({
            ...event,
            start: eventStart,
            end: eventEnd,
          })
        } else {
          result.push({ ...event, start: eventStart })
        }
      }
      cursor = cursor.add({ day: 1 })
    }

    return result
  }

  private _expandRRule(event: ICalendarEvent, _rangeStart: TimeGuard, _rangeEnd: TimeGuard): ICalendarEvent[] {
    if (!event.rrule) return [event]
    const match = event.rrule.match(/FREQ=(\w+)(?:;INTERVAL=(\d+))?(?:;COUNT=(\d+))?(?:;UNTIL=(.+))?/)
    if (!match) return [event]

    const freq = match[1] as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    const interval = match[2] ? parseInt(match[2], 10) : 1
    const count = match[3] ? parseInt(match[3], 10) : 0
    const untilStr = match[4]
    const until = untilStr ? TimeGuard.from(untilStr) : null
    const maxIterations = count || 365

    const results: ICalendarEvent[] = [event]
    let cursor = event.start
    const duration = event.end ? event.end.valueOf() - event.start.valueOf() : 0
    let iterations = 0

    while (iterations < maxIterations - 1) {
      iterations++

      switch (freq) {
        case 'DAILY':
          cursor = cursor.add({ day: interval })
          break
        case 'WEEKLY':
          cursor = cursor.add({ week: interval })
          break
        case 'MONTHLY':
          cursor = cursor.add({ month: interval })
          break
        case 'YEARLY':
          cursor = cursor.add({ year: interval })
          break
      }

      if (until && cursor.isAfter(until)) break

      const newEnd = duration > 0
        ? TimeGuard.from(cursor.valueOf() + duration)
        : undefined

      results.push({ ...event, start: cursor, end: newEnd })
    }

    return results
  }
}
