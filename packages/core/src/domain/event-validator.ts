import { TimeGuard } from '@bereasoftware/time-guard';
import type { ICalendarEvent, EventInput } from '../types/event';
import type { EventConstraint } from '../types/constraint';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class EventValidator {
  validate(input: EventInput): ValidationResult {
    const errors: string[] = [];

    if (!input.start && !input.rrule) {
      errors.push('Event must have a start date or rrule');
    }

    if (input.start && input.end) {
      const start = input.start instanceof TimeGuard ? input.start : TimeGuard.from(input.start);
      const end = input.end instanceof TimeGuard ? input.end : TimeGuard.from(input.end);
      if (end.isBefore(start)) {
        errors.push('Event end must be after start');
      }
    }

    if (input.rrule && !input.start) {
      errors.push('Recurring events must have a start date');
    }

    return { valid: errors.length === 0, errors };
  }

  validateConstraint(event: ICalendarEvent, constraint?: EventConstraint): boolean {
    if (!constraint) return true;

    if (constraint.daysOfWeek && constraint.daysOfWeek.length > 0) {
      const day = event.start.dayOfWeek();
      if (!constraint.daysOfWeek.includes(day)) return false;
    }

    if (constraint.start && event.end) {
      if (event.end.isBefore(constraint.start)) return false;
    }

    if (constraint.end && event.start) {
      if (event.start.isAfter(constraint.end)) return false;
    }

    return true;
  }

  validateOverlap(event: ICalendarEvent, existingEvents: ICalendarEvent[]): boolean {
    if (!event.overlap) return true;

    return existingEvents.every(other => {
      if (other.id === event.id) return true;
      if (!other.overlap) return true;
      if (event.end && other.end) {
        return !(event.start.isBefore(other.end) && event.end.isAfter(other.start));
      }
      return !event.start.isSame(other.start, 'day');
    });
  }
}
