var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CalendarStore, DateUtils, getLocale } from '@nexa-calendar/core';
import { applyTheme } from './themes';
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
let NxCalendar = class NxCalendar extends LitElement {
    constructor() {
        super(...arguments);
        this._store = new CalendarStore();
        this._grid = [];
        this._resources = [];
        this._selectionRange = {};
        this.locale = 'en';
        this.weekends = true;
        this.showNonCurrentDates = true;
        this.fixedWeekCount = true;
        this.dayMaxEvents = false;
        this.firstDay = 0;
        this.editable = true;
        this.eventStartEditable = true;
        this.eventDurationEditable = true;
        this.minTime = '00:00';
        this.maxTime = '24:00';
        this.slotDuration = 60;
        this.hourHeight = 48;
        this.slotLabelFormat = 'h:mm a';
        this.scrollToTime = '06:00';
        this.businessHours = false;
        this.headerToolbar = true;
        this.theme = 'light';
        this.views = [
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
        this._modalEvent = null;
        this._handleWindowResize = () => {
            this.requestUpdate();
        };
    }
    set events(value) {
        if (value)
            this._store.setEvents(value);
    }
    set resources(value) {
        if (value)
            this._resources = value.map(r => ({ ...r, children: r.children ?? [] }));
    }
    set view(value) {
        if (value)
            this._store.setView(value);
    }
    connectedCallback() {
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
    disconnectedCallback() {
        this._unsubscribe?.();
        super.disconnectedCallback();
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this._handleWindowResize);
        }
    }
    updated(changed) {
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
    _generateGrid() {
        const { currentDate, view, events } = this._state;
        const range = this._getRange(currentDate, view);
        const viewInstance = this._store.views.getView();
        this._grid = viewInstance.generateGrid(range, events, this._resources);
    }
    _getRange(date, v) {
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
    _getTitle() {
        const { currentDate, view } = this._state;
        const range = this._getRange(currentDate, view);
        const viewInstance = this._store.views.getView();
        return viewInstance.getTitle(range, this.locale);
    }
    _handleViewChange(e) {
        this._store.setView(e.detail);
    }
    _handlePrev() {
        this._store.goPrev();
        this._reFetchSources();
    }
    _handleNext() {
        this._store.goNext();
        this._reFetchSources();
    }
    _handleToday() {
        this._store.goToday();
        this._reFetchSources();
    }
    async _reFetchSources() {
        if (this._store.sources.length > 0) {
            await this._store.fetchAllSources();
        }
    }
    _handleDateClick(e) {
        const detail = e.detail;
        this.dispatchEvent(new CustomEvent('dateClick', {
            detail: {
                date: detail.date.toISOString(),
                allDay: detail.allDay,
            },
            bubbles: true,
            composed: true,
        }));
    }
    _handleEventClick(e) {
        const event = e.detail;
        this.dispatchEvent(new CustomEvent('eventClick', {
            detail: { id: event.id, event },
            bubbles: true,
            composed: true,
        }));
    }
    _handleEventDrop(e) {
        const { eventId, newStart, newEnd } = e.detail;
        const event = this._store.eventManager.getEventById(eventId);
        if (!event)
            return;
        this._store.updateEvent(eventId, { start: newStart, end: newEnd });
        this.dispatchEvent(new CustomEvent('eventDrop', {
            detail: { event, oldStart: event.start.toISOString(), newStart },
            bubbles: true,
            composed: true,
        }));
    }
    _handleEventResize(e) {
        const { eventId, newEnd } = e.detail;
        const event = this._store.eventManager.getEventById(eventId);
        if (!event)
            return;
        this._store.updateEvent(eventId, { end: newEnd });
        this.dispatchEvent(new CustomEvent('eventResize', {
            detail: { event, oldEnd: event.end?.toISOString(), newEnd },
            bubbles: true,
            composed: true,
        }));
    }
    _handleDrop(e) {
        this.dispatchEvent(new CustomEvent('drop', {
            detail: e.detail,
            bubbles: true,
            composed: true,
        }));
    }
    addSource(input) {
        return this._store.addSource(input);
    }
    removeSource(id) {
        return this._store.removeSource(id);
    }
    addEvent(input) {
        return this._store.addEvent(input);
    }
    updateEvent(id, props) {
        return this._store.updateEvent(id, props);
    }
    removeEvent(id) {
        return this._store.removeEvent(id);
    }
    getEvents() {
        return this._store.eventManager.events;
    }
    getView() {
        return this._state.view;
    }
    changeView(view) {
        this._store.setView(view);
    }
    prev() {
        this._store.goPrev();
    }
    next() {
        this._store.goNext();
    }
    today() {
        this._store.goToday();
    }
    goToDate(date) {
        const d = typeof date === 'string' ? DateUtils.from(date) : date;
        this._store.goToDate(d);
    }
    installPlugin(plugin) {
        this._store.installPlugin(plugin);
    }
    _getLocale() {
        try {
            return getLocale(this.locale);
        }
        catch {
            return getLocale('en');
        }
    }
    get _bizHoursKey() {
        if (!this.businessHours)
            return 'false';
        if (typeof this.businessHours === 'boolean')
            return String(this.businessHours);
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
        return html `
      <div
        class="nx-calendar-root rounded-xl overflow-hidden relative"
        style="font-family: inherit; background: var(--nx-bg); border: 1px solid var(--nx-border); box-shadow: var(--nx-shadow); border-radius: var(--nx-radius);"
      >
        ${isFetching
            ? html `
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
            ? html `
              <div
                class="px-4 py-2 text-sm font-medium"
                style="background: #fef2f2; border-bottom: 1px solid #fecaca; color: #991b1b"
              >
                ${error}
              </div>
            `
            : ''}
        ${showHeader
            ? html `
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
            ? html `
                <nx-month-view
                  .key=${bizKey}
                  .cells=${this._grid}
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
                ? html `
                  <nx-work-week-view
                    .key=${bizKey}
                    .columns=${this._grid}
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
                    ? html `
                    <nx-week-view
                      .key=${bizKey}
                      .columns=${this._grid}
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
                        ? html `
                      <nx-day-view
                        .key=${bizKey}
                        .columns=${this._grid}
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
                            ? html `
                        <nx-timeline-view
                          .grid=${this._grid}
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
                                ? html `
                          <nx-resource-timeline-view
                            .grid=${this._grid}
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
                                    ? html `
                            <nx-year-view
                              .grid=${this._grid}
                              .locale=${locale}
                              .eventContent=${this.eventContent}
                              @dateClick=${this._handleDateClick}
                              @navigateToMonth=${(e) => {
                                        this._store.goToDate(e.detail.date);
                                        this._store.setView('month');
                                    }}
                            ></nx-year-view>
                          `
                                    : html `
                            <nx-list-view
                              .items=${this._grid}
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
    _renderEventModal(event) {
        const start = event.start;
        const end = event.end;
        const color = event.backgroundColor ?? '#3b82f6';
        const formatTime = (t) => {
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
        return html `
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
          @click=${(e) => e.stopPropagation()}
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
            ? html `<span
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
            ? html `
                  <div class="border-t pt-3" style="border-color: var(--nx-border-light)">
                    ${Object.entries(event.extendedProps).map(([k, v]) => html `
                        <div class="flex gap-2 text-xs">
                          <span class="font-medium capitalize" style="color: var(--nx-text-muted)"
                            >${k}:</span
                          >
                          <span>${String(v)}</span>
                        </div>
                      `)}
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
            ? html `
                  <button
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style="background: var(--nx-accent); color: var(--nx-accent-text)"
                    @click=${() => {
                const id = event.id;
                this._modalEvent = null;
                this.dispatchEvent(new CustomEvent('editEvent', {
                    detail: { id, event },
                    bubbles: true,
                    composed: true,
                }));
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
    createRenderRoot() {
        return this;
    }
};
__decorate([
    state(),
    __metadata("design:type", Object)
], NxCalendar.prototype, "_state", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], NxCalendar.prototype, "_grid", void 0);
__decorate([
    state(),
    __metadata("design:type", Array)
], NxCalendar.prototype, "_resources", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], NxCalendar.prototype, "_selectionRange", void 0);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], NxCalendar.prototype, "events", null);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], NxCalendar.prototype, "resources", null);
__decorate([
    property({ type: String }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], NxCalendar.prototype, "view", null);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "locale", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "weekends", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "showNonCurrentDates", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "fixedWeekCount", void 0);
__decorate([
    property({ type: [Number, Boolean] }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "dayMaxEvents", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "firstDay", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "editable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "eventStartEditable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "eventDurationEditable", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "minTime", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "maxTime", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "slotDuration", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "hourHeight", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "slotLabelFormat", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "scrollToTime", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], NxCalendar.prototype, "businessHours", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "headerToolbar", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], NxCalendar.prototype, "theme", void 0);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], NxCalendar.prototype, "views", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], NxCalendar.prototype, "_modalEvent", void 0);
NxCalendar = __decorate([
    customElement('nx-calendar')
], NxCalendar);
export { NxCalendar };
//# sourceMappingURL=nx-calendar.js.map