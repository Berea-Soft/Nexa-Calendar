import type { ViewType } from '../types/view';
import type { ICalendarEvent, EventInput, EventId } from '../types/event';
import type { IEventSource, EventSourceInput, EventSourceRawInput } from '../types/source';
import type { CalendarState, Listener, Unsubscribe, CalendarEventPayloads } from '../types/store';
import type { INavigable } from '../types/navigable';
import type { ICalendarPlugin } from '../types/plugin';
import { CalendarNavigator } from './calendar-navigator';
import { EventManager } from './event-manager';
import { EventRecurrence } from './event-recurrence';
import { EventValidator } from './event-validator';
import { EventSorter } from './event-sorter';
import { ViewManager } from './view-manager';
import { SelectionManager } from './selection-manager';
import {
  LocalEventSource,
  FunctionalEventSource,
  JsonEventSource,
} from '../services/event-sources';
import { PluginManager } from '../services/plugin-manager';

export class CalendarStore {
  private _navigator = new CalendarNavigator();
  private _eventManager = new EventManager();
  private _viewManager = new ViewManager();
  private _selectionManager = new SelectionManager();
  private _eventRecurrence = new EventRecurrence();
  private _eventValidator = new EventValidator();
  private _eventSorter = new EventSorter();
  private _pluginManager = new PluginManager();
  private _sources: Map<string, IEventSource> = new Map();
  private _listeners = new Set<Listener>();
  private _isFetching = false;
  private _error?: string;

  get state(): CalendarState {
    return {
      currentDate: this._navigator.currentDate,
      view: this._viewManager.currentType,
      events: this._eventSorter.sort(this._eventManager.events),
      isFetching: this._isFetching,
      error: this._error,
    };
  }

  subscribe(listener: Listener): Unsubscribe {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  private _notify(): void {
    const state = this.state;
    this._listeners.forEach(l => l(state));
  }

  get navigator(): INavigable {
    return this._navigator;
  }
  get eventManager(): EventManager {
    return this._eventManager;
  }
  get views(): ViewManager {
    return this._viewManager;
  }
  get selection(): SelectionManager {
    return this._selectionManager;
  }
  get plugins(): PluginManager {
    return this._pluginManager;
  }
  get validator(): EventValidator {
    return this._eventValidator;
  }
  get sorter(): EventSorter {
    return this._eventSorter;
  }

  get sources(): IEventSource[] {
    return Array.from(this._sources.values());
  }

  addSource(input: EventSourceRawInput): string {
    if (typeof input === 'string') {
      const source = new JsonEventSource(input);
      this._sources.set(source.id, source);
      return source.id;
    }

    if (Array.isArray(input)) {
      const source = new LocalEventSource(
        input.map(i => this.eventManager.addEvent(i)),
        'local'
      );
      this._sources.set(source.id, source);
      return source.id;
    }

    if (typeof input === 'function') {
      const source = new FunctionalEventSource(input);
      this._sources.set(source.id, source);
      return source.id;
    }

    if (typeof input === 'object' && 'fetch' in input) {
      this._sources.set(input.id, input);
      return input.id;
    }

    throw new Error('Invalid event source input');
  }

  removeSource(id: string): boolean {
    return this._sources.delete(id);
  }

  async fetchAllSources(): Promise<void> {
    this._isFetching = true;
    this._error = undefined;
    this._notify();

    try {
      const range = {
        start: this._navigator.currentDate.startOf('month'),
        end: this._navigator.currentDate.endOf('month'),
      };

      const allEvents: ICalendarEvent[] = [];
      for (const source of this._sources.values()) {
        const events = await source.fetch(range);
        allEvents.push(...events);
      }

      this._eventManager.setEvents(allEvents);
      this._isFetching = false;
      this._notify();
    } catch (err) {
      this._isFetching = false;
      this._error = err instanceof Error ? err.message : String(err);
      this._notify();
    }
  }

  setEvents(events: EventInput[]): void {
    this._eventManager.setEvents(events);
    this._notify();
  }

  addEvent(input: EventInput): ICalendarEvent | null {
    const validation = this._eventValidator.validate(input);
    if (!validation.valid) {
      this._error = validation.errors.join('; ');
      this._notify();
      return null;
    }

    const event = this._eventManager.addEvent(input);
    this._error = undefined;
    this._notify();
    return event;
  }

  updateEvent(id: EventId, props: Partial<EventInput>): ICalendarEvent | undefined {
    const result = this._eventManager.updateEvent(id, props);
    if (result) this._notify();
    return result;
  }

  removeEvent(id: EventId): boolean {
    const removed = this._eventManager.removeEvent(id);
    if (removed) this._notify();
    return removed;
  }

  setView(view: ViewType): void {
    this._viewManager.setView(view);
    this._notify();
  }

  goPrev(): void {
    const view = this._viewManager.currentType;
    this._navigator.goPrev(view === 'list' ? 'month' : view);
    this._notify();
  }

  goNext(): void {
    const view = this._viewManager.currentType;
    this._navigator.goNext(view === 'list' ? 'month' : view);
    this._notify();
  }

  goToday(): void {
    this._navigator.goToday();
    this._notify();
  }

  goToDate(date: import('@bereasoftware/time-guard').TimeGuard): void {
    this._navigator.goToDate(date);
    this._notify();
  }

  selectDate(
    start: import('@bereasoftware/time-guard').TimeGuard,
    end: import('@bereasoftware/time-guard').TimeGuard
  ): void {
    this._selectionManager.select(start, end);
  }

  clearSelection(): void {
    this._selectionManager.clear();
  }

  getEventsInRange(
    start: import('@bereasoftware/time-guard').TimeGuard,
    end: import('@bereasoftware/time-guard').TimeGuard
  ): ICalendarEvent[] {
    return this._eventRecurrence.expandRecurringEvents(
      this._eventManager.getEventsInRange(start, end),
      start,
      end
    );
  }

  installPlugin(plugin: ICalendarPlugin): void {
    this._pluginManager.register(plugin, this);
  }
}
