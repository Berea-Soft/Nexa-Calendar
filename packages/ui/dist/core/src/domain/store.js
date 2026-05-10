import { CalendarNavigator } from './calendar-navigator';
import { EventManager } from './event-manager';
import { EventRecurrence } from './event-recurrence';
import { EventValidator } from './event-validator';
import { EventSorter } from './event-sorter';
import { ViewManager } from './view-manager';
import { SelectionManager } from './selection-manager';
import { LocalEventSource, FunctionalEventSource, JsonEventSource, } from '../services/event-sources';
import { PluginManager } from '../services/plugin-manager';
export class CalendarStore {
    constructor() {
        this._navigator = new CalendarNavigator();
        this._eventManager = new EventManager();
        this._viewManager = new ViewManager();
        this._selectionManager = new SelectionManager();
        this._eventRecurrence = new EventRecurrence();
        this._eventValidator = new EventValidator();
        this._eventSorter = new EventSorter();
        this._pluginManager = new PluginManager();
        this._sources = new Map();
        this._listeners = new Set();
        this._isFetching = false;
    }
    get state() {
        return {
            currentDate: this._navigator.currentDate,
            view: this._viewManager.currentType,
            events: this._eventSorter.sort(this._eventManager.events),
            isFetching: this._isFetching,
            error: this._error,
        };
    }
    subscribe(listener) {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }
    _notify() {
        const state = this.state;
        this._listeners.forEach(l => l(state));
    }
    get navigator() {
        return this._navigator;
    }
    get eventManager() {
        return this._eventManager;
    }
    get views() {
        return this._viewManager;
    }
    get selection() {
        return this._selectionManager;
    }
    get plugins() {
        return this._pluginManager;
    }
    get validator() {
        return this._eventValidator;
    }
    get sorter() {
        return this._eventSorter;
    }
    get sources() {
        return Array.from(this._sources.values());
    }
    addSource(input) {
        if (typeof input === 'string') {
            const source = new JsonEventSource(input);
            this._sources.set(source.id, source);
            return source.id;
        }
        if (Array.isArray(input)) {
            const source = new LocalEventSource(input.map(i => this.eventManager.addEvent(i)), 'local');
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
    removeSource(id) {
        return this._sources.delete(id);
    }
    async fetchAllSources() {
        this._isFetching = true;
        this._error = undefined;
        this._notify();
        try {
            const range = {
                start: this._navigator.currentDate.startOf('month'),
                end: this._navigator.currentDate.endOf('month'),
            };
            const allEvents = [];
            for (const source of this._sources.values()) {
                const events = await source.fetch(range);
                allEvents.push(...events);
            }
            this._eventManager.setEvents(allEvents);
            this._isFetching = false;
            this._notify();
        }
        catch (err) {
            this._isFetching = false;
            this._error = err instanceof Error ? err.message : String(err);
            this._notify();
        }
    }
    setEvents(events) {
        this._eventManager.setEvents(events);
        this._notify();
    }
    addEvent(input) {
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
    updateEvent(id, props) {
        const result = this._eventManager.updateEvent(id, props);
        if (result)
            this._notify();
        return result;
    }
    removeEvent(id) {
        const removed = this._eventManager.removeEvent(id);
        if (removed)
            this._notify();
        return removed;
    }
    setView(view) {
        this._viewManager.setView(view);
        this._notify();
    }
    goPrev() {
        const view = this._viewManager.currentType;
        this._navigator.goPrev(view === 'list' ? 'month' : view);
        this._notify();
    }
    goNext() {
        const view = this._viewManager.currentType;
        this._navigator.goNext(view === 'list' ? 'month' : view);
        this._notify();
    }
    goToday() {
        this._navigator.goToday();
        this._notify();
    }
    goToDate(date) {
        this._navigator.goToDate(date);
        this._notify();
    }
    selectDate(start, end) {
        this._selectionManager.select(start, end);
    }
    clearSelection() {
        this._selectionManager.clear();
    }
    getEventsInRange(start, end) {
        return this._eventRecurrence.expandRecurringEvents(this._eventManager.getEventsInRange(start, end), start, end);
    }
    installPlugin(plugin) {
        this._pluginManager.register(plugin, this);
    }
}
//# sourceMappingURL=store.js.map