import type { ICalendarEvent } from '../types/event';
export type SortKey = 'start' | 'end' | 'title' | 'allDay';
export type SortDirection = 'asc' | 'desc';
export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}
export declare class EventSorter {
  sort(events: ICalendarEvent[], config?: SortConfig | SortConfig[]): ICalendarEvent[];
  sortByDisplayPriority(events: ICalendarEvent[]): ICalendarEvent[];
  private _defaultSort;
  private _sortBy;
}
