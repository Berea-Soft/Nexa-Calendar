import type { BusinessHours, DayColumn, ICalendarEvent } from '@nexa-calendar/core'
import { DateUtils } from '@nexa-calendar/core'

export interface VisualTimeSlot {
  totalMinutes: number
  hour: number
  minute: number
  label: string
  isHourBoundary: boolean
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map((part) => parseInt(part, 10))
  return (hours * 60) + minutes
}

export function buildVisualTimeSlots(minTime: string, maxTime: string, slotDuration: number, slotLabelFormat = 'h:mm a'): VisualTimeSlot[] {
  const minMinutes = parseTimeToMinutes(minTime)
  const maxMinutes = parseTimeToMinutes(maxTime)
  const safeDuration = Math.max(5, slotDuration)
  const slots: VisualTimeSlot[] = []

  for (let totalMinutes = minMinutes; totalMinutes < maxMinutes; totalMinutes += safeDuration) {
    const hour = Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60

    slots.push({
      totalMinutes,
      hour,
      minute,
      label: formatSlotLabel(totalMinutes, slotLabelFormat),
      isHourBoundary: minute === 0,
    })
  }

  return slots
}

export function getSlotHeight(hourHeight: number, slotDuration: number): number {
  return Math.max(12, Math.round(hourHeight * (slotDuration / 60)))
}

export function getColumnTimedEvents(column: DayColumn): ICalendarEvent[] {
  const uniqueEvents = new Map<string, ICalendarEvent>()

  for (const slot of column.slots ?? []) {
    for (const event of slot.events ?? []) {
      if (event.allDay) continue
      uniqueEvents.set(String(event.id), event)
    }
  }

  return Array.from(uniqueEvents.values())
}

export function getTimedEventsForSlot(events: ICalendarEvent[], slotStartMinutes: number, slotDuration: number): ICalendarEvent[] {
  const slotEndMinutes = slotStartMinutes + slotDuration

  return events.filter((event) => {
    const eventStartMinutes = (event.start.hour() * 60) + event.start.minute()
    return event.display !== 'background' && eventStartMinutes >= slotStartMinutes && eventStartMinutes < slotEndMinutes
  })
}

export function getBackgroundEventsForSlot(events: ICalendarEvent[], slotStartMinutes: number, slotDuration: number): ICalendarEvent[] {
  const slotEndMinutes = slotStartMinutes + slotDuration

  return events.filter((event) => {
    if (event.display !== 'background') return false

    const eventStartMinutes = (event.start.hour() * 60) + event.start.minute()
    const eventEndMinutes = event.end ? ((event.end.hour() * 60) + event.end.minute()) : (eventStartMinutes + slotDuration)

    return eventStartMinutes < slotEndMinutes && eventEndMinutes > slotStartMinutes
  })
}

export function isBusinessTimeSlot(
  date: import('@bereasoftware/time-guard').TimeGuard,
  totalMinutes: number,
  businessHours: BusinessHours | BusinessHours[] | boolean,
): boolean {
  console.log('isBusinessTimeSlot called:', { businessHours, totalMinutes, date: date.toISO() })
  if (!businessHours) return true
  if (typeof businessHours === 'boolean') return businessHours

  const slotDate = date.startOf('day').add({
    hour: Math.floor(totalMinutes / 60),
    minute: totalMinutes % 60,
  })
  const hours = Array.isArray(businessHours) ? businessHours : [businessHours]

  return hours.some((hoursRange) => DateUtils.isInBusinessHours(slotDate, hoursRange))
}

export function getSlotDateTime(date: import('@bereasoftware/time-guard').TimeGuard, totalMinutes: number) {
  return date.startOf('day').add({
    hour: Math.floor(totalMinutes / 60),
    minute: totalMinutes % 60,
  })
}

function formatSlotLabel(totalMinutes: number, slotLabelFormat: string): string {
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  const slotDate = DateUtils.today().add({ hour, minute })

  return DateUtils.formatTime(slotDate, slotLabelFormat)
}
