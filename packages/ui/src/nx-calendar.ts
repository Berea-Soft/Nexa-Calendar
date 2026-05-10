import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  CalendarState,
  ViewType,
  DayCell,
  DayColumn,
  ListEvent,
  TimelineGrid,
  ResourceTimelineGrid,
  YearGrid,
  EventInput,
  ICalendarEvent,
  IEventSource,
  EventSourceRawInput,
  ICalendarPlugin,
  Locale,
  BusinessHours,
  DropPayload,
  IResource,
  ResourceInput,
} from '@nexa-calendar/core';
import { CalendarStore, DateUtils, getLocale } from '@nexa-calendar/core';
import { applyTheme, type NxTheme, type CustomThemeInput } from './themes';
import './components/toolbar';
import './components/event-chip';
import './views/month-view';
import './views/week-view';
import './views/work-week-view';
import './views/day-view';
import './views/list-view';
import './views/timeline-view';
import './views/year-view';
import './views/resource-timeline-view';

export type NxCalendarOptions = {
  events?: EventInput[];
  resources?: ResourceInput[];
  eventSources?: EventSourceRawInput[];
  view?: ViewType;
  locale?: string;
  businessHours?: BusinessHours | BusinessHours[] | boolean;
  minTime?: string;
  maxTime?: string;
  slotDuration?: number;
  slotLabelFormat?: string;
  scrollToTime?: string;
  dayMaxEvents?: number | boolean;
  fixedWeekCount?: boolean;
  weekends?: boolean;
  showNonCurrentDates?: boolean;
  firstDay?: number;
  editable?: boolean;
  eventStartEditable?: boolean;
  eventDurationEditable?: boolean;
  plugins?: ICalendarPlugin[];
  headerToolbar?: boolean | { start?: string; center?: string; end?: string };
  height?: 'auto' | number | string;
  aspectRatio?: number;
};

@customElement('nx-calendar')
export class NxCalendar extends LitElement {
  private _store = new CalendarStore();
  private _unsubscribe?: () => void;

  @state() private _state!: CalendarState;
  @state() private _grid:
    | DayCell[]
    | DayColumn[]
    | ListEvent[]
    | TimelineGrid
    | ResourceTimelineGrid
    | YearGrid = [];
  @state() private _resources: IResource[] = [];
  @state() private _selectionRange: { start?: Date; end?: Date } = {};

  @property({ type: Array }) set events(value: EventInput[]) {
    if (value) this._store.setEvents(value);
  }

  @property({ type: Array }) set resources(value: ResourceInput[]) {
    if (value)
      this._resources = value.map(r => ({ ...r, children: r.children ?? [] }) as IResource);
  }

  @property({ type: String }) set view(value: ViewType) {
    if (value) this._store.setView(value);
  }

  @property({ type: String }) locale = 'en';
  @property({ type: Boolean }) weekends = true;
  @property({ type: Boolean }) showNonCurrentDates = true;
  @property({ type: Boolean }) fixedWeekCount = true;
  @property({ type: [Number, Boolean] }) dayMaxEvents: number | boolean = false;
  @property({ type: Number }) firstDay = 0;
  @property({ type: Boolean }) editable = true;
  @property({ type: Boolean }) eventStartEditable = true;
  @property({ type: Boolean }) eventDurationEditable = true;
  @property({ type: String }) minTime = '00:00';
  @property({ type: String }) maxTime = '24:00';
  @property({ type: Number }) slotDuration = 60;
  @property({ type: Number }) hourHeight = 48;
  @property({ type: String }) slotLabelFormat = 'h:mm a';
  @property({ type: String }) scrollToTime = '06:00';
  @property() businessHours: BusinessHours | BusinessHours[] | boolean = false;
  @property({ type: Object }) headerToolbar: boolean | Record<string, string> = true;
  @property({ type: String }) theme: NxTheme | CustomThemeInput = 'light';
  @property({ type: Array }) views: ViewType[] = [
    'month',
    'workWeek',
    'week',
    'day',
    'list',
    'timeline',
    'timelineDay',
    'timelineWeek',
    'timelineMonth',
    'year',
  ];

  eventContent?: (event: ICalendarEvent) => { template: string; className?: string };

  @state() private _modalEvent: ICalendarEvent | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    applyTheme(this, this.theme);
    this._state = this._store.state;
    this._unsubscribe = this._store.subscribe(s => {
      this._state = s;
      this._generateGrid();
    });
    if (this._store.sources.length > 0) {
      this._store.fetchAllSources();
    }
    this._generateGrid();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this._handleWindowResize);
    }
  }

  disconnectedCallback(): void {
    this._unsubscribe?.();
    super.disconnectedCallback();
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this._handleWindowResize);
    }
  }

  private _handleWindowResize = (): void => {
    this.requestUpdate();
  };

  updated(changed: Map<string, unknown>): void {
    if (changed.has('theme')) {
      applyTheme(this, this.theme);
    }
    if (changed.has('businessHours')) {
      console.log('NX-CALENDAR updated - businessHours changed to:', this.businessHours);
      // Force update by creating new grid reference
      this._generateGrid();
      // Force re-render by invalidating
      this.requestUpdate();
    }
  }

  private _generateGrid(): void {
    const { currentDate, view, events } = this._state;
    const range = this._getRange(currentDate, view);
    const viewInstance = this._store.views.getView();
    this._grid = viewInstance.generateGrid(range, events, this._resources);
  }

  private _getRange(
    date: import('@bereasoftware/time-guard').TimeGuard,
    v: ViewType
  ): {
    start: import('@bereasoftware/time-guard').TimeGuard;
    end: import('@bereasoftware/time-guard').TimeGuard;
  } {
    switch (v) {
      case 'month':
        return DateUtils.getMonthRange(date);
      case 'workWeek':
        return DateUtils.getWeekRange(date);
      case 'week':
        return DateUtils.getWeekRange(date);
      case 'day':
        return DateUtils.getDayRange(date);
      case 'list':
        return DateUtils.getMonthRange(date);
      case 'timeline':
        return DateUtils.getTimelineRange(date);
      case 'timelineDay':
        return DateUtils.getDayRange(date);
      case 'timelineWeek':
        return DateUtils.getWeekRange(date);
      case 'timelineMonth':
        return DateUtils.getTimelineRange(date);
      case 'year':
        return { start: date.startOf('year'), end: date.endOf('year') };
      default:
        return DateUtils.getMonthRange(date);
    }
  }

  private _getTitle(): string {
    const { currentDate, view } = this._state;
    const range = this._getRange(currentDate, view);
    const viewInstance = this._store.views.getView();
    return viewInstance.getTitle(range, this.locale);
  }

  private _handleViewChange(e: CustomEvent): void {
    this._store.setView(e.detail as ViewType);
  }

  private _handlePrev(): void {
    this._store.goPrev();
    this._reFetchSources();
  }

  private _handleNext(): void {
    this._store.goNext();
    this._reFetchSources();
  }

  private _handleToday(): void {
    this._store.goToday();
    this._reFetchSources();
  }

  private async _reFetchSources(): Promise<void> {
    if (this._store.sources.length > 0) {
      await this._store.fetchAllSources();
    }
  }

  private _handleDateClick(e: CustomEvent): void {
    const detail = e.detail as {
      date: import('@bereasoftware/time-guard').TimeGuard;
      allDay: boolean;
    };
    this.dispatchEvent(
      new CustomEvent('dateClick', {
        detail: {
          date: detail.date.toISOString(),
          allDay: detail.allDay,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleEventClick(e: CustomEvent): void {
    const event = e.detail as ICalendarEvent;
    this.dispatchEvent(
      new CustomEvent('eventClick', {
        detail: { id: event.id, event },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleEventDrop(e: CustomEvent): void {
    const { eventId, newStart, newEnd } = e.detail as {
      eventId: string | number;
      newStart: string;
      newEnd?: string;
    };
    const event = this._store.eventManager.getEventById(eventId);
    if (!event) return;
    this._store.updateEvent(eventId, { start: newStart, end: newEnd });
    this.dispatchEvent(
      new CustomEvent('eventDrop', {
        detail: { event, oldStart: event.start.toISOString(), newStart },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleEventResize(e: CustomEvent): void {
    const { eventId, newEnd } = e.detail as { eventId: string | number; newEnd: string };
    const event = this._store.eventManager.getEventById(eventId);
    if (!event) return;
    this._store.updateEvent(eventId, { end: newEnd });
    this.dispatchEvent(
      new CustomEvent('eventResize', {
        detail: { event, oldEnd: event.end?.toISOString(), newEnd },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleDrop(e: CustomEvent): void {
    this.dispatchEvent(
      new CustomEvent('drop', {
        detail: e.detail as DropPayload,
        bubbles: true,
        composed: true,
      })
    );
  }

  addSource(input: EventSourceRawInput): string {
    return this._store.addSource(input);
  }

  removeSource(id: string): boolean {
    return this._store.removeSource(id);
  }

  addEvent(input: EventInput): ICalendarEvent | null {
    return this._store.addEvent(input);
  }

  updateEvent(id: string | number, props: Partial<EventInput>): ICalendarEvent | undefined {
    return this._store.updateEvent(id, props);
  }

  removeEvent(id: string | number): boolean {
    return this._store.removeEvent(id);
  }

  getEvents(): ICalendarEvent[] {
    return this._store.eventManager.events;
  }

  getView(): ViewType {
    return this._state.view;
  }

  changeView(view: ViewType): void {
    this._store.setView(view);
  }

  prev(): void {
    this._store.goPrev();
  }

  next(): void {
    this._store.goNext();
  }

  today(): void {
    this._store.goToday();
  }

  goToDate(date: string | import('@bereasoftware/time-guard').TimeGuard): void {
    const d = typeof date === 'string' ? DateUtils.from(date) : date;
    this._store.goToDate(d);
  }

  installPlugin(plugin: ICalendarPlugin): void {
    this._store.installPlugin(plugin);
  }

  private _getLocale(): Locale {
    try {
      return getLocale(this.locale);
    } catch {
      return getLocale('en');
    }
  }

  private get _bizHoursKey(): string {
    if (!this.businessHours) return 'false';
    if (typeof this.businessHours === 'boolean') return String(this.businessHours);
    if (Array.isArray(this.businessHours)) {
      return this.businessHours
        .map(h => `${h.daysOfWeek?.join('')}-${h.startTime}-${h.endTime}`)
        .join('|');
    }
    return `${this.businessHours.daysOfWeek?.join('')}-${this.businessHours.startTime}-${this.businessHours.endTime}`;
  }

  render() {
    const { view, isFetching, error } = this._state;
    const locale = this._getLocale();
    const showHeader = this.headerToolbar !== false;
    const bizKey = this._bizHoursKey;

    return html`
      <div
        class="nx-calendar-root rounded-xl overflow-hidden relative"
        style="font-family: inherit; background: var(--nx-bg); border: 1px solid var(--nx-border); box-shadow: var(--nx-shadow); border-radius: var(--nx-radius);"
      >
        ${isFetching
          ? html`
              <div
                class="absolute inset-0 flex items-center justify-center z-50"
                style="background: color-mix(in srgb, var(--nx-bg) 80%, transparent)"
              >
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2"
                  style="border-color: var(--nx-accent)"
                ></div>
              </div>
            `
          : ''}
        ${error
          ? html`
              <div
                class="px-4 py-2 text-sm font-medium"
                style="background: #fef2f2; border-bottom: 1px solid #fecaca; color: #991b1b"
              >
                ${error}
              </div>
            `
          : ''}
        ${showHeader
          ? html`
              <nx-toolbar
                .title=${this._getTitle()}
                .view=${view}
                .locale=${locale}
                .theme=${this.theme}
                .views=${this.views}
                @prev=${this._handlePrev}
                @next=${this._handleNext}
                @today=${this._handleToday}
                @viewChange=${this._handleViewChange}
              ></nx-toolbar>
            `
          : ''}

        <div class="p-0">
          ${view === 'month'
            ? html`
                <nx-month-view
                  .key=${bizKey}
                  .cells=${this._grid as DayCell[]}
                  .locale=${locale}
                  .dayMaxEvents=${this.dayMaxEvents}
                  .showNonCurrentDates=${this.showNonCurrentDates}
                  .weekends=${this.weekends}
                  .firstDay=${this.firstDay}
                  .editable=${this.editable}
                  .eventStartEditable=${this.eventStartEditable}
                  .businessHours=${this.businessHours}
                  .eventContent=${this.eventContent}
                  @dateClick=${this._handleDateClick}
                  @eventClick=${this._handleEventClick}
                  @eventDrop=${this._handleEventDrop}
                  @drop=${this._handleDrop}
                ></nx-month-view>
              `
            : view === 'workWeek'
              ? html`
                  <nx-work-week-view
                    .key=${bizKey}
                    .columns=${this._grid as DayColumn[]}
                    .locale=${locale}
                    .minTime=${this.minTime}
                    .maxTime=${this.maxTime}
                    .slotDuration=${this.slotDuration}
                    .hourHeight=${this.hourHeight}
                    .slotLabelFormat=${this.slotLabelFormat}
                    .scrollToTime=${this.scrollToTime}
                    .editable=${this.editable}
                    .eventStartEditable=${this.eventStartEditable}
                    .eventDurationEditable=${this.eventDurationEditable}
                    .businessHours=${this.businessHours}
                    .eventContent=${this.eventContent}
                    @dateClick=${this._handleDateClick}
                    @eventClick=${this._handleEventClick}
                    @eventDrop=${this._handleEventDrop}
                    @eventResize=${this._handleEventResize}
                    @drop=${this._handleDrop}
                  ></nx-work-week-view>
                `
              : view === 'week'
                ? html`
                    <nx-week-view
                      .key=${bizKey}
                      .columns=${this._grid as DayColumn[]}
                      .locale=${locale}
                      .minTime=${this.minTime}
                      .maxTime=${this.maxTime}
                      .slotDuration=${this.slotDuration}
                      .hourHeight=${this.hourHeight}
                      .slotLabelFormat=${this.slotLabelFormat}
                      .scrollToTime=${this.scrollToTime}
                      .weekends=${this.weekends}
                      .firstDay=${this.firstDay}
                      .editable=${this.editable}
                      .eventStartEditable=${this.eventStartEditable}
                      .eventDurationEditable=${this.eventDurationEditable}
                      .businessHours=${this.businessHours}
                      .eventContent=${this.eventContent}
                      @dateClick=${this._handleDateClick}
                      @eventClick=${this._handleEventClick}
                      @eventDrop=${this._handleEventDrop}
                      @eventResize=${this._handleEventResize}
                      @drop=${this._handleDrop}
                    ></nx-week-view>
                  `
                : view === 'day'
                  ? html`
                      <nx-day-view
                        .key=${bizKey}
                        .columns=${this._grid as DayColumn[]}
                        .locale=${locale}
                        .minTime=${this.minTime}
                        .maxTime=${this.maxTime}
                        .slotDuration=${this.slotDuration}
                        .hourHeight=${this.hourHeight}
                        .slotLabelFormat=${this.slotLabelFormat}
                        .scrollToTime=${this.scrollToTime}
                        .editable=${this.editable}
                        .eventStartEditable=${this.eventStartEditable}
                        .eventDurationEditable=${this.eventDurationEditable}
                        .businessHours=${this.businessHours}
                        .eventContent=${this.eventContent}
                        @dateClick=${this._handleDateClick}
                        @eventClick=${this._handleEventClick}
                        @eventDrop=${this._handleEventDrop}
                        @eventResize=${this._handleEventResize}
                        @drop=${this._handleDrop}
                      ></nx-day-view>
                    `
                  : view === 'timeline'
                    ? html`
                        <nx-timeline-view
                          .grid=${this._grid as TimelineGrid}
                          .locale=${locale}
                          .editable=${this.editable}
                          .eventStartEditable=${this.eventStartEditable}
                          .eventContent=${this.eventContent}
                          @dateClick=${this._handleDateClick}
                          @eventClick=${this._handleEventClick}
                          @eventDrop=${this._handleEventDrop}
                        ></nx-timeline-view>
                      `
                    : view === 'timelineDay' || view === 'timelineWeek' || view === 'timelineMonth'
                      ? html`
                          <nx-resource-timeline-view
                            .grid=${this._grid as ResourceTimelineGrid}
                            .locale=${locale}
                            .editable=${this.editable}
                            .eventStartEditable=${this.eventStartEditable}
                            .eventContent=${this.eventContent}
                            @dateClick=${this._handleDateClick}
                            @eventClick=${this._handleEventClick}
                            @eventDrop=${this._handleEventDrop}
                          ></nx-resource-timeline-view>
                        `
                      : view === 'year'
                        ? html`
                            <nx-year-view
                              .grid=${this._grid as YearGrid}
                              .locale=${locale}
                              .eventContent=${this.eventContent}
                              @dateClick=${this._handleDateClick}
                              @navigateToMonth=${(e: CustomEvent) => {
                                this._store.goToDate(e.detail.date);
                                this._store.setView('month');
                              }}
                            ></nx-year-view>
                          `
                        : html`
                            <nx-list-view
                              .items=${this._grid as ListEvent[]}
                              .locale=${locale}
                              .noEventsText=${locale.noEventsText}
                              .eventContent=${this.eventContent}
                              @eventClick=${this._handleEventClick}
                            ></nx-list-view>
                          `}
        </div>

        ${this._modalEvent ? this._renderEventModal(this._modalEvent) : ''}
      </div>
    `;
  }

  private _renderEventModal(event: ICalendarEvent) {
    const start = event.start;
    const end = event.end;
    const color = event.backgroundColor ?? '#3b82f6';
    const formatTime = (t: import('@bereasoftware/time-guard').TimeGuard) => {
      const h = t.hour();
      const m = t.minute().toString().padStart(2, '0');
      return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
    };
    const dateStr = start.format ? `${start.format('dddd, MMMM D, YYYY')}` : '';
    const timeStr = event.allDay
      ? 'All day'
      : end
        ? `${formatTime(start)} – ${formatTime(end)}`
        : formatTime(start);

    return html`
      <div
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.45)"
        @click=${() => {
          this._modalEvent = null;
        }}
      >
        <div
          class="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
          style="background: var(--nx-surface); border: 1px solid var(--nx-border)"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <!-- Color header bar -->
          <div
            class="px-5 py-4 flex items-start justify-between gap-3"
            style="background: ${color}; border-bottom: 1px solid rgba(0,0,0,.12)"
          >
            <div>
              <div
                class="text-base font-bold leading-snug"
                style="color: ${event.textColor ?? '#fff'}"
              >
                ${event.title}
              </div>
              ${event.allDay
                ? html`<span
                    class="mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-white/20"
                    style="color: ${event.textColor ?? '#fff'}"
                    >All day</span
                  >`
                : ''}
            </div>
            <button
              class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-sm font-bold"
              style="color: ${event.textColor ?? '#fff'}"
              @click=${() => {
                this._modalEvent = null;
              }}
            >
              ✕
            </button>
          </div>
          <!-- Detail rows -->
          <div class="px-5 py-4 space-y-3" style="color: var(--nx-text)">
            <div class="flex items-center gap-3">
              <span class="text-lg">📅</span>
              <div>
                <div class="text-sm font-medium">${dateStr}</div>
                <div class="text-xs mt-0.5" style="color: var(--nx-text-muted)">${timeStr}</div>
              </div>
            </div>
            ${event.extendedProps && Object.keys(event.extendedProps).length
              ? html`
                  <div class="border-t pt-3" style="border-color: var(--nx-border-light)">
                    ${Object.entries(event.extendedProps).map(
                      ([k, v]) => html`
                        <div class="flex gap-2 text-xs">
                          <span class="font-medium capitalize" style="color: var(--nx-text-muted)"
                            >${k}:</span
                          >
                          <span>${String(v)}</span>
                        </div>
                      `
                    )}
                  </div>
                `
              : ''}
          </div>
          <!-- Actions -->
          <div class="px-5 pb-4 flex gap-2 justify-end">
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style="background: var(--nx-hover); color: var(--nx-text)"
              @click=${() => {
                this._modalEvent = null;
              }}
            >
              Close
            </button>
            ${this.editable
              ? html`
                  <button
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style="background: var(--nx-accent); color: var(--nx-accent-text)"
                    @click=${() => {
                      const id = event.id;
                      this._modalEvent = null;
                      this.dispatchEvent(
                        new CustomEvent('editEvent', {
                          detail: { id, event },
                          bubbles: true,
                          composed: true,
                        })
                      );
                    }}
                  >
                    Edit
                  </button>
                  <button
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style="background: #fee2e2; color: #991b1b"
                    @click=${() => {
                      if (confirm(`Delete "${event.title}"?`)) {
                        this._store.removeEvent(event.id);
                        this._modalEvent = null;
                      }
                    }}
                  >
                    Delete
                  </button>
                `
              : ''}
          </div>
        </div>
      </div>
    `;
  }

  protected createRenderRoot() {
    return this;
  }
}
