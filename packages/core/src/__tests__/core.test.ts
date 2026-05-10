import { describe, it, expect } from 'vitest'
import { TimeGuard, timeGuard } from '@bereasoftware/time-guard'
import { EventManager } from '../domain/event-manager'
import { EventValidator } from '../domain/event-validator'
import { EventRecurrence } from '../domain/event-recurrence'
import { EventSorter } from '../domain/event-sorter'
import { CalendarNavigator } from '../domain/calendar-navigator'
import { SelectionManager } from '../domain/selection-manager'
import { DateUtils } from '../domain/date-utils'
import { CalendarStore } from '../domain/store'
import { LocalEventSource, FunctionalEventSource } from '../services/event-sources'
import { getLocale, registerLocale } from '../services/locale-manager'

describe('EventManager', () => {
  it('creates event from input', () => {
    const em = new EventManager()
    const event = em.addEvent({ title: 'Test', start: '2026-05-07T10:00:00' })
    expect(event.title).toBe('Test')
    expect(event.id).toBeDefined()
    expect(event.allDay).toBe(false)
  })

  it('returns copy of events array', () => {
    const em = new EventManager()
    em.addEvent({ title: 'A', start: '2026-05-07T10:00:00' })
    const events = em.events
    events.push({} as any)
    expect(em.events.length).toBe(1)
  })

  it('filters events by range', () => {
    const em = new EventManager()
    em.addEvent({ title: 'In range', start: '2026-05-07T10:00:00' })
    em.addEvent({ title: 'Out of range', start: '2026-06-01T10:00:00' })
    const start = timeGuard('2026-05-01')
    const end = timeGuard('2026-05-31')
    const filtered = em.getEventsInRange(start, end)
    expect(filtered.length).toBe(1)
    expect(filtered[0].title).toBe('In range')
  })
})

describe('EventValidator', () => {
  it('validates event with start', () => {
    const v = new EventValidator()
    const result = v.validate({ title: 'Test', start: '2026-05-07T10:00:00' })
    expect(result.valid).toBe(true)
  })

  it('rejects event with end before start', () => {
    const v = new EventValidator()
    const result = v.validate({
      title: 'Bad',
      start: '2026-05-07T10:00:00',
      end: '2026-05-07T08:00:00',
    })
    expect(result.valid).toBe(false)
  })

  it('rejects recurring event without start', () => {
    const v = new EventValidator()
    const result = v.validate({ title: 'No start', rrule: 'FREQ=DAILY' })
    expect(result.valid).toBe(false)
  })
})

describe('EventRecurrence', () => {
  it('expands weekly daysOfWeek events', () => {
    const er = new EventRecurrence()
    const event = {
      id: '1', title: 'Repeating', start: timeGuard('2026-05-04T10:00:00'),
      end: timeGuard('2026-05-04T11:00:00'), allDay: false, display: 'auto' as const,
      editable: true, startEditable: true, durationEditable: true, overlap: true,
      daysOfWeek: [1, 3], extendedProps: {},
    }
    const start = timeGuard('2026-05-04')
    const end = timeGuard('2026-05-10')
    const result = er.expandRecurringEvents([event as any], start, end)
    expect(result.length).toBeGreaterThan(1)
  })
})

describe('EventSorter', () => {
  it('sorts by start time', () => {
    const s = new EventSorter()
    const events = [
      { id: '1', start: timeGuard('2026-05-07T14:00:00'), title: 'B' },
      { id: '2', start: timeGuard('2026-05-07T10:00:00'), title: 'A' },
    ] as any[]
    const sorted = s.sort(events)
    expect(sorted[0].title).toBe('A')
  })
})

describe('CalendarNavigator', () => {
  it('navigates to today', () => {
    const nav = new CalendarNavigator()
    nav.goToday()
    expect(nav.currentDate.isToday()).toBe(true)
  })

  it('goes to next month', () => {
    const nav = new CalendarNavigator(timeGuard('2026-05-07'))
    nav.goNext('month')
    expect(nav.currentDate.month()).toBe(6)
  })
})

describe('SelectionManager', () => {
  it('selects and clears', () => {
    const sm = new SelectionManager()
    const start = timeGuard('2026-05-07')
    const end = timeGuard('2026-05-10')
    sm.select(start, end)
    expect(sm.state.isSelected).toBe(true)
    sm.clear()
    expect(sm.state.isSelected).toBe(false)
  })
})

describe('DateUtils', () => {
  it('isSameDay works', () => {
    const a = timeGuard('2026-05-07T10:00:00')
    const b = timeGuard('2026-05-07T14:00:00')
    expect(DateUtils.isSameDay(a, b)).toBe(true)
  })

  it('getMonthRange returns correct range', () => {
    const d = timeGuard('2026-05-07')
    const range = DateUtils.getMonthRange(d)
    expect(range.start.day()).toBe(26)
    expect(range.start.month()).toBe(4)
  })
})

describe('CalendarStore', () => {
  it('initial state is valid', () => {
    const store = new CalendarStore()
    const state = store.state
    expect(state.currentDate).toBeDefined()
    expect(state.view).toBe('month')
    expect(state.events).toEqual([])
    expect(state.isFetching).toBe(false)
  })

  it('addEvent returns created event', () => {
    const store = new CalendarStore()
    const event = store.addEvent({ title: 'New', start: '2026-05-07T10:00:00' })
    expect(event).not.toBeNull()
    expect(event!.title).toBe('New')
  })

  it('setEvents replaces events', () => {
    const store = new CalendarStore()
    store.addEvent({ title: 'A', start: '2026-05-07T10:00:00' })
    store.setEvents([{ title: 'B', start: '2026-05-08T10:00:00' }])
    expect(store.state.events.length).toBe(1)
    expect(store.state.events[0].title).toBe('B')
  })

  it('notifies subscribers on state change', () => {
    const store = new CalendarStore()
    let notified = false
    store.subscribe(() => { notified = true })
    store.setView('week')
    expect(notified).toBe(true)
  })

  it('adds event sources', () => {
    const store = new CalendarStore()
    const id = store.addSource([{ title: 'From source', start: '2026-05-07T10:00:00' }])
    expect(id).toBeDefined()
    expect(store.sources.length).toBe(1)
  })
})

describe('Event Sources', () => {
  it('LocalEventSource returns static events', async () => {
    const source = new LocalEventSource([], 'test')
    const result = await source.fetch({ start: timeGuard('2026-05-01'), end: timeGuard('2026-05-31') })
    expect(result).toEqual([])
  })

  it('FunctionalEventSource delegates to function', async () => {
    const source = new FunctionalEventSource(async () => [], 'fn-test')
    const result = await source.fetch({ start: timeGuard('2026-05-01'), end: timeGuard('2026-05-31') })
    expect(result).toEqual([])
  })
})

describe('Locale', () => {
  it('returns English locale by default', () => {
    const locale = getLocale('en')
    expect(locale.code).toBe('en')
    expect(locale.buttonText.today).toBe('Today')
  })

  it('returns Spanish locale when registered', () => {
    const locale = getLocale('es')
    expect(locale.buttonText.today).toBe('Hoy')
  })
})
