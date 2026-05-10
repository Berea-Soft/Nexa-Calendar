import type { ViewType } from '../types/view';
import type { ICalendarEvent, EventInput, EventId } from '../types/event';
import type { IEventSource, EventSourceRawInput } from '../types/source';
import type { CalendarState, Listener, Unsubscribe } from '../types/store';
import type { INavigable } from '../types/navigable';
import type { ICalendarPlugin } from '../types/plugin';
import { EventManager } from './event-manager';
import { EventValidator } from './event-validator';
import { EventSorter } from './event-sorter';
import { ViewManager } from './view-manager';
import { SelectionManager } from './selection-manager';
import { PluginManager } from '../services/plugin-manager';
export declare class CalendarStore {
  private _navigator;
  private _eventManager;
  private _viewManager;
  private _selectionManager;
  private _eventRecurrence;
  private _eventValidator;
  private _eventSorter;
  private _pluginManager;
  private _sources;
  private _listeners;
  private _isFetching;
  private _error?;
  get state(): CalendarState;
  subscribe(listener: Listener): Unsubscribe;
  private _notify;
  get navigator(): INavigable;
  get eventManager(): EventManager;
  get views(): ViewManager;
  get selection(): SelectionManager;
  get plugins(): PluginManager;
  get validator(): EventValidator;
  get sorter(): EventSorter;
  get sources(): IEventSource[];
  addSource(input: EventSourceRawInput): string;
  removeSource(id: string): boolean;
  fetchAllSources(): Promise<void>;
  setEvents(events: EventInput[]): void;
  addEvent(input: EventInput): ICalendarEvent | null;
  updateEvent(id: EventId, props: Partial<EventInput>): ICalendarEvent | undefined;
  removeEvent(id: EventId): boolean;
  setView(view: ViewType): void;
  goPrev(): void;
  goNext(): void;
  goToday(): void;
  goToDate(date: import('@bereasoftware/time-guard').TimeGuard): void;
  selectDate(
    start: import('@bereasoftware/time-guard').TimeGuard,
    end: import('@bereasoftware/time-guard').TimeGuard
  ): void;
  clearSelection(): void;
  getEventsInRange(
    start: import('@bereasoftware/time-guard').TimeGuard,
    end: import('@bereasoftware/time-guard').TimeGuard
  ): ICalendarEvent[];
  installPlugin(plugin: ICalendarPlugin): void;
}
