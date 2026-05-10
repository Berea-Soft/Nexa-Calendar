import type { ICalendarEvent, EventInput } from '../types/event';
import type { EventConstraint } from '../types/constraint';
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
export declare class EventValidator {
  validate(input: EventInput): ValidationResult;
  validateConstraint(event: ICalendarEvent, constraint?: EventConstraint): boolean;
  validateOverlap(event: ICalendarEvent, existingEvents: ICalendarEvent[]): boolean;
}
